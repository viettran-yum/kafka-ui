import React from 'react';
import { useTopicMessages } from 'lib/hooks/api/topicMessages';
import useAppParams from 'lib/hooks/useAppParams';
import { RouteParamsClusterTopic } from 'lib/paths';

import MessagesTable from './MessagesTable';
import * as S from './Messages.styled';
import Meta from './Meta';

const Messages = () => {
  const routerProps = useAppParams<RouteParamsClusterTopic>();

  const { messages, meta, phase, isFetching, abort } =
    useTopicMessages(routerProps);

  return (
    <S.Wrapper>
      <div>
        <Meta meta={meta} phase={phase} isFetching={isFetching} abort={abort} />
      </div>
      <MessagesTable messages={messages} />
    </S.Wrapper>
  );
};

export default Messages;
