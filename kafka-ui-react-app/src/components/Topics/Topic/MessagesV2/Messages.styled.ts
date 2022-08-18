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
      padding: 8px 16px;
      min-height: calc(
        100vh - ${theme.layout.navBarHeight} - ${theme.pageHeading.height} -
          ${theme.primaryTab.height}
      );
    }
  `
);
