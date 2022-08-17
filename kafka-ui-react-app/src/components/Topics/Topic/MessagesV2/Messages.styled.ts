import styled, { css } from 'styled-components';

export const Wrapper = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: 300px 1fr;
    justify-items: center;
    align-items: start;

    & > div:first-child {
      border-right: 1px solid ${theme.layout.stuffBorderColor};
      width: 300px;
      min-height: calc(
        100vh - ${theme.layout.navBarHeight} - ${theme.pageHeading.height} -
          ${theme.primaryTab.height}
      );
    }
  `
);

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
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
  justify-content: space-around;
  gap: 8px;
`;

export const StopLoading = styled.div`
  color: ${({ theme }) => theme.pageLoader.borderColor};
  cursor: pointer;
`;
