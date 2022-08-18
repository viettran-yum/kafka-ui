import React from 'react';
import { useTopicMessages } from 'lib/hooks/api/topicMessages';
import useAppParams from 'lib/hooks/useAppParams';
import { RouteParamsClusterTopic } from 'lib/paths';
import { useSearchParams } from 'react-router-dom';
import { MESSAGES_PER_PAGE } from 'lib/constants';

import MessagesTable from './MessagesTable/MessagesTable';
import * as S from './Messages.styled';
import Meta from './Filters/Meta';
import Mode from './Filters/Mode';

const Messages = () => {
  const routerProps = useAppParams<RouteParamsClusterTopic>();
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    if (!searchParams.get('perPage')) {
      searchParams.set('perPage', MESSAGES_PER_PAGE);
    }

    setSearchParams(searchParams);
  }, []);

  const { messages, meta, phase, isFetching, abort } =
    useTopicMessages(routerProps);

  return (
    <S.Wrapper>
      <div>
        <Meta meta={meta} phase={phase} isFetching={isFetching} abort={abort} />
        <Mode />
      </div>
      <MessagesTable messages={messages} />
    </S.Wrapper>
  );
};

export default Messages;
