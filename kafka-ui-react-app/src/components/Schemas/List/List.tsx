import React from 'react';
import {
  ClusterNameRoute,
  clusterSchemaNewRelativePath,
  clusterSchemaPath,
} from 'lib/paths';
import ClusterContext from 'components/contexts/ClusterContext';
import { Button } from 'components/common/Button/Button';
import PageHeading from 'components/common/PageHeading/PageHeading';
import { useAppDispatch, useAppSelector } from 'lib/hooks/redux';
import useAppParams from 'lib/hooks/useAppParams';
import {
  selectAllSchemas,
  fetchSchemas,
  getAreSchemasFulfilled,
  SCHEMAS_FETCH_ACTION,
} from 'redux/reducers/schemas/schemasSlice';
import PageLoader from 'components/common/PageLoader/PageLoader';
import { resetLoaderById } from 'redux/reducers/loader/loaderSlice';
import { ControlPanelWrapper } from 'components/common/ControlPanel/ControlPanel.styled';
import Search from 'components/common/Search/Search';
import useSearch from 'lib/hooks/useSearch';
import PlusIcon from 'components/common/Icons/PlusIcon';
import Table, { LinkCell } from 'components/common/NewTable';
import { ColumnDef } from '@tanstack/react-table';
import { SchemaSubject } from 'generated-sources';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PER_PAGE } from 'lib/constants';

import GlobalSchemaSelector from './GlobalSchemaSelector/GlobalSchemaSelector';

const List: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isReadOnly } = React.useContext(ClusterContext);
  const { clusterName } = useAppParams<ClusterNameRoute>();
  const navigate = useNavigate();
  const schemas = useAppSelector(selectAllSchemas);
  const isFetched = useAppSelector(getAreSchemasFulfilled);
  const totalPages = useAppSelector((state) => state.schemas.totalPages);
  const [searchParams] = useSearchParams();
  const [searchText, handleSearchText] = useSearch();

  React.useEffect(() => {
    dispatch(
      fetchSchemas({
        clusterName,
        page: Number(searchParams.get('page') || 1),
        perPage: Number(searchParams.get('perPage') || PER_PAGE),
        search: searchParams.get('q') || '',
      })
    );
    return () => {
      dispatch(resetLoaderById(SCHEMAS_FETCH_ACTION));
    };
  }, [clusterName, dispatch, searchParams]);

  const columns = React.useMemo<ColumnDef<SchemaSubject>[]>(
    () => [
      { header: 'Subject', accessorKey: 'subject', cell: LinkCell },
      { header: 'Version', accessorKey: 'version' },
      { header: 'Compatibility', accessorKey: 'compatibilityLevel' },
    ],
    []
  );

  return (
    <>
      <PageHeading text="Schema Registry">
        {!isReadOnly && (
          <>
            <GlobalSchemaSelector />
            <Button
              buttonSize="M"
              buttonType="primary"
              to={clusterSchemaNewRelativePath}
            >
              <PlusIcon /> Create Schema
            </Button>
          </>
        )}
      </PageHeading>
      <ControlPanelWrapper hasInput>
        <Search
          placeholder="Search by Schema Name"
          value={searchText}
          handleSearch={handleSearchText}
        />
      </ControlPanelWrapper>
      {isFetched ? (
        <Table
          columns={columns}
          data={schemas}
          pageCount={totalPages}
          emptyMessage="No schemas found"
          onRowClick={(row) =>
            navigate(clusterSchemaPath(clusterName, row.original.subject))
          }
          serverSideProcessing
        />
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default List;
