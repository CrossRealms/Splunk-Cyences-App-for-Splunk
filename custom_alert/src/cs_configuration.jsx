import React from 'react';
import layout from '@splunk/react-page/18';
import { SplunkThemeProvider } from '@splunk/themes';
import ProductSetupPage from './ProducSetupPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css"

layout(
    <SplunkThemeProvider family="enterprise" colorScheme="light" density="comfortable">
            <ToastContainer position="top-right" autoClose={3000} />
            <ProductSetupPage />
    </SplunkThemeProvider>
);