import React, { useEffect, useState } from 'react';
import SimpleForm from './components/SimpleForm';
import { axiosCallWrapper } from './utils/axiosCallWrapper';
import { generateToast } from './utils/util';


const EmailConfigurationFields = {
    usernameLabel: 'Default Email Recipients',
    usernameHelp: 'comma separated list of email addresses who wish to receive all Cyences alerts in the form of an email based on the desired severity level(s)',
    passwordLabel: 'Severities',
    passwordType: 'text',
    passwordHelp: 'comma separated list of alert severity levels that are included in the email; default - critical severity only',
}

export default function SendEmailSetup() {

    const [data, setData] = useState('');

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

    return (
        <>
            <SimpleForm key='sendemailconfiguration' {...EmailConfigurationFields} onSave={onSave} username={data.email_to_default} password={data.cyences_severities} />
        </>
    );
}