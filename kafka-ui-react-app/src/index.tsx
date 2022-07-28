/* eslint-disable */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from 'components/App';
import { store } from 'redux/store';
import 'theme/index.scss';
import 'lib/constants';

window.__dynamicImportHandler__ = (importer: string) =>
  window.basePath + importer;

window.__dynamicImportPreload__ = (preloads: string[]) =>
  preloads.map((preload) => window.basePath + preload);

const container =
  document.getElementById('root') || document.createElement('div');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter basename={window.basePath || '/'}>
      <App />
    </BrowserRouter>
  </Provider>
);
