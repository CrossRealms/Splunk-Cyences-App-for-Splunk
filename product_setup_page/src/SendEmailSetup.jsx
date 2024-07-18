import React, { useEffect, useState } from 'react';
import Heading from '@splunk/react-ui/Heading';
import SimpleForm from './components/SimpleForm';
import CyencesDocFooter from './components/CyencesDocFooter';
import { axiosCallWrapper } from './utils/axiosCallWrapper';
import { generateToast } from './utils/util';


const EmailConfigurationFields = {
    usernameLabel: 'Default Email Recipients',
    usernameHelp: 'comma separated list of email addresses who wish to receive all Cyences alerts in the form of an email based on the desired severity level(s)',
    passwordLabel: 'Severities',
    passwordType: 'text',
    passwordHelp: 'comma separated list of alert severity levels that are included in the email; default - critical severity only',
}

const DigestEmailConfigurationFields = {
    usernameLabel: 'Default Email Recipients',
    usernameHelp: 'comma separated list of email addresses who wish to receive all Cyences digest alerts in the form of an email based on the desired severity level(s)',
    passwordLabel: 'Severities',
    passwordType: 'text',
    passwordHelp: 'comma separated list of alert severity levels that are included in the email; default - high & medium severities',
}

export default function SendEmailSetup() {

    const [data, setData] = useState('');
    const [digestData, setDigestData] = useState('');

    useEffect(() => {
        axiosCallWrapper({
            endpointUrl: `configs/conf-alert_actions/cyences_send_email_action`
        })
            .then((resp) => {
                const content = resp.data.entry[0].content;
                const email_to_default = content['param.email_to_default'];
                const cyences_severities = content['param.cyences_severities'];
                setData({ email_to_default: email_to_default, cyences_severities: cyences_severities });
            })
            .catch((error) => {
                generateToast(`Failed to load Cyences email alert action configuration. check console for more detail.`, "error");
                console.log(error);
            })

    }, []);

    useEffect(() => {
        axiosCallWrapper({
            endpointUrl: `configs/conf-alert_actions/cyences_send_digest_email_action`
        })
            .then((resp) => {
                const content = resp.data.entry[0].content;
                const email_to = content['param.email_to'];
                const cyences_severities = content['param.cyences_severities'];
                setDigestData({ email_to: email_to, cyences_severities: cyences_severities });
            })
            .catch((error) => {
                generateToast(`Failed to load Cyences digest email alert action configuration. check console for more detail.`, "error");
                console.log(error);
            })

    }, []);

    function onSave(username, password) {
        const payload = {
            "param.email_to_default": username,
            "param.cyences_severities": password
        }
        axiosCallWrapper({
            endpointUrl: `configs/conf-alert_actions/cyences_send_email_action`,
            body: new URLSearchParams(payload),
            customHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: "post",
        })
            .then((resp) => {
                generateToast(`Cyences email alert action configuration saved successfully`, "success")
            })
            .catch((error) => {
                console.log(error);
                generateToast(`Failed to update Cyences email alert action configuration. check console for more detail.`, "error")
            })
    }

    function onDigestSave(username, password) {
        const payload = {
            "param.email_to": username,
            "param.cyences_severities": password
        }
        axiosCallWrapper({
            endpointUrl: `configs/conf-alert_actions/cyences_send_digest_email_action`,
            body: new URLSearchParams(payload),
            customHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: "post",
        })
            .then((resp) => {
                generateToast(`Cyences digest email alert action configuration saved successfully`, "success")
            })
            .catch((error) => {
                console.log(error);
                generateToast(`Failed to update Cyences digest email alert action configuration. check console for more detail.`, "error")
            })
    }

    return (
        <>
            <Heading style={{ marginLeft: '20px' }}>Digest Email Configuration</Heading>
            <SimpleForm key='senddigestemailconfiguration' {...DigestEmailConfigurationFields} onSave={onDigestSave} username={digestData.email_to} password={digestData.cyences_severities} />

            <Heading style={{ marginLeft: '20px' }}>Critical Email Configuration</Heading>
            <SimpleForm key='sendemailconfiguration' {...EmailConfigurationFields} onSave={onSave} username={data.email_to_default} password={data.cyences_severities} />

            <CyencesDocFooter location="install_configure/configuration/#cyences-email-settings-for-alerts"></CyencesDocFooter>
        </>
    );
}