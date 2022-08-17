import BytesFormatted from 'components/common/BytesFormatted/BytesFormatted';
import ArrowDownIcon from 'components/common/Icons/ArrowDownIcon';
import ClockIcon from 'components/common/Icons/ClockIcon';
import FileIcon from 'components/common/Icons/FileIcon';
import { SeekDirection, TopicMessageConsuming } from 'generated-sources';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import * as S from './Messages.styled';

interface MetaProps {
  meta?: TopicMessageConsuming;
  phase?: string;
  isFetching: boolean;
  abort: () => void;
}

const Meta: React.FC<MetaProps> = ({ meta = {}, phase, isFetching, abort }) => {
  const [searchParams] = useSearchParams();

  const { bytesConsumed, messagesConsumed, elapsedMs } = meta;

  const isTailing = searchParams.get('seekDirection') === SeekDirection.TAILING;
  const isPhaseVisible = !isTailing && isFetching && phase;

  return (
    <S.Meta>
      <S.MetaRow>
        <S.Metric title="Elapsed Time">
          <S.MetricIcon>
            <ClockIcon />
          </S.MetricIcon>
          <span>{Math.max(elapsedMs || 0, 0)} ms</span>
        </S.Metric>
        <S.Metric title="Bytes Consumed">
          <S.MetricIcon>
            <ArrowDownIcon />
          </S.MetricIcon>
          <BytesFormatted value={bytesConsumed || 0} />
        </S.Metric>
        <S.Metric title="Messages Consumed">
          <S.MetricIcon>
            <FileIcon />
          </S.MetricIcon>
          <span>{messagesConsumed || 0} msg.</span>
        </S.Metric>
      </S.MetaRow>
      <S.MetaMessage>
        {isPhaseVisible && <div>{phase}</div>}
        {isTailing && (
          <>
            <div>Loading messages.</div>
            <S.StopLoading onClick={abort}>Stop loading</S.StopLoading>
          </>
        )}
      </S.MetaMessage>
    </S.Meta>
  );
};

export default Meta;
