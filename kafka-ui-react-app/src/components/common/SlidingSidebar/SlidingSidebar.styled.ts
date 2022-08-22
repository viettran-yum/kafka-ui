import styled from 'styled-components';

export const Wrapper = styled.div<{ $open?: boolean }>(
  ({ theme, $open }) => `
  background-color: ${theme.layout.backgroundColor};
  position: fixed;
  top: ${theme.layout.navBarHeight};
  bottom: 0;
  width: 60vw;
  padding: 16px;
  right: calc(${$open ? '0px' : theme.layout.rightSidebarWidth} * -1);
  box-shadow: -1px 0px 10px 0px rgba(0, 0, 0, 0.75);
  transition: right 0.3s linear;

  h3 {
    display: flex;
    justify-content: space-between;
  }
`
);

export const Content = styled.div<{ $open?: boolean }>(
  ({ theme }) => `
  background-color: ${theme.layout.backgroundColor};
  overflow-y: auto;
  position: absolute;
  top: 50px;
  bottom: 16px;
  left: 0;
  right: 0;
`
);
