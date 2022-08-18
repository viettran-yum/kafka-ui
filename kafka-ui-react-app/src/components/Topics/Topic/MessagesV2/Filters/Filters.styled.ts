import styled from 'styled-components';

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 50px;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const Metric = styled.div`
  color: ${({ theme }) => theme.metrics.filters.color.normal};
  font-size: 12px;
  display: flex;
`;

export const MetricIcon = styled.div`
  color: ${({ theme }) => theme.metrics.filters.color.icon};
  padding-right: 6px;
  height: 12px;
`;

export const MetaMessage = styled.div.attrs({
  role: 'contentLoader',
})`
  color: ${({ theme }) => theme.heading.h3.color};
  font-size: 12px;
  display: flex;
  gap: 8px;
`;

export const StopLoading = styled.div`
  color: ${({ theme }) => theme.pageLoader.borderColor};
  cursor: pointer;
`;
