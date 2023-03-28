import React from 'react';
import layout from '@splunk/react-page';
import { SplunkThemeProvider } from '@splunk/themes';
import ToastMessages from '@splunk/react-toast-notifications'
import App from './App';

layout(
    <SplunkThemeProvider family="enterprise" colorScheme="light" density="comfortable">
        <App />
        <ToastMessages position="top-right" />
    </SplunkThemeProvider>
);