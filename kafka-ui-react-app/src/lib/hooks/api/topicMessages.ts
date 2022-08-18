import React from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { BASE_PARAMS, MESSAGES_PER_PAGE } from 'lib/constants';
import { ClusterName } from 'redux/interfaces';
import { useSearchParams } from 'react-router-dom';
import {
  SeekDirection,
  TopicMessage,
  TopicMessageConsuming,
  TopicMessageEvent,
  TopicMessageEventTypeEnum,
} from 'generated-sources';
import { showServerError } from 'lib/errorHandling';

interface UseTopicMessagesProps {
  clusterName: ClusterName;
  topicName: string;
}

const controller = new AbortController();

export const useTopicMessages = ({
  clusterName,
  topicName,
}: UseTopicMessagesProps) => {
  const [searchParams] = useSearchParams();

  const isLive = searchParams.get('seekDirection') === SeekDirection.TAILING;

  const [messages, setMessages] = React.useState<TopicMessage[]>([]);
  const [phase, setPhase] = React.useState<string>();
  const [meta, setMeta] = React.useState<TopicMessageConsuming>();
  const [isFetching, setIsFetching] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const url = `${BASE_PARAMS.basePath}/api/clusters/${clusterName}/topics/${topicName}/messages`;

      // API use `limit` param insted of `perPage`. So we need to replace it manually.
      const limit = searchParams.get('perPage') || MESSAGES_PER_PAGE;
      searchParams.delete('perPage');
      searchParams.set('limit', limit);

      await fetchEventSource(`${url}?${searchParams.toString()}`, {
        method: 'GET',
        signal: controller.signal,
        async onopen(response) {
          const { ok, status } = response;
          if (ok && status === 200) {
            // Reset list of messages.
            setMessages([]);
          } else if (status >= 400 && status < 500 && status !== 429) {
            showServerError(response);
          }
        },
        onmessage(event) {
          const parsedData: TopicMessageEvent = JSON.parse(event.data);
          const { message, consuming } = parsedData;

          switch (parsedData.type) {
            case TopicMessageEventTypeEnum.MESSAGE:
              if (message) {
                setMessages((prevMessages) => {
                  if (isLive) {
                    return [message, ...prevMessages];
                  }
                  return [...prevMessages, message];
                });
              }
              break;
            case TopicMessageEventTypeEnum.PHASE:
              if (parsedData.phase?.name) setPhase(parsedData.phase.name);
              break;
            case TopicMessageEventTypeEnum.CONSUMING:
              if (consuming) setMeta(consuming);
              break;
            default:
          }
        },
        onclose() {
          setIsFetching(false);
        },
        onerror(err) {
          setIsFetching(false);
          showServerError(err);
        },
      });
    };
    fetchData();
    return () => controller.abort();
  }, [searchParams]);

  return { phase, messages, meta, isFetching, abort: controller.abort };
};
