import React from 'react';
import layout from '@splunk/react-page/18';
import { SplunkThemeProvider } from '@splunk/themes';
import "./index.css"
import SavedSearchesPage from './SavedSearchesPage';
import { SnackbarProvider } from './SnackbarProvider';

const DeviceInventories = layout(
  <SplunkThemeProvider family="enterprise" colorScheme="light" density="comfortable">
    <SnackbarProvider>
      <SavedSearchesPage />
    </SnackbarProvider>
  </SplunkThemeProvider>
);

export default DeviceInventories;