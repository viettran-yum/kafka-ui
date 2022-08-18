import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'components/common/Select/Select';
import { SeekDirection, SeekType } from 'generated-sources';

const MODES = [
  { value: 'live', label: 'Live mode' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'newest', label: 'Newest first' },
  { value: 'fromOffset', label: 'From offset' },
  { value: 'tOffset', label: 'To offset' },
  { value: 'sinceTime', label: 'Since time' },
  { value: 'untilTime', label: 'Until time' },
];

const Mode: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [seekDirection, setSeekDirection] = React.useState<SeekDirection>(
    (searchParams.get('seekDirection') as SeekDirection) ||
      SeekDirection.BACKWARD
  );
  const [seekType, setSeekType] = React.useState<SeekType>(
    (searchParams.get('seekType') as SeekType) || SeekType.OFFSET
  );

  React.useEffect(() => {}, []);

  return (
    <>
      <Select
        selectSize="M"
        onChange={(option) => console.log(option)}
        value="live"
        minWidth="100%"
        options={MODES}
      />
      <div></div>
    </>
  );
};

export default Mode;
