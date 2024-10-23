import React, { useEffect, useState } from 'react';
import { generateToast } from './utils/util';
import { axiosCallWrapper } from './utils/axiosCallWrapper';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Button from '@splunk/react-ui/Button';
import Text from '@splunk/react-ui/Text';
import CyencesDocFooter from './components/CyencesDocFooter';


const EmailConfigurationFields = {
    emailSubjectLabel: 'Environment Name',
    emaiSubjectHelp: 'This will be used in the alert emails sent by Cyences and other places.',
}

const macroName = "cs_email_subject_prefix"


export default function CyencesGeneralConfiguration() {

    const [prefixValue, setData] = useState('');

    useEffect(() => {
        axiosCallWrapper({
            endpointUrl: `configs/conf-alert_actions/cyences_send_email_action`
        })
            .then((resp) => {
                const content = resp.data.entry[0].content;
                const subject_prefix = content['param.subject_prefix'];
                setData(subject_prefix);
            })
            .catch((error) => {
                generateToast(`Failed to load Cyences email alert action configuration. check console for more detail.`, "error");
                console.log(error);
            })
    }, []);


    function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            "param.subject_prefix": prefixValue
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
        
        axiosCallWrapper({
            endpointUrl: `configs/conf-macros/${macroName}`,
            body: new URLSearchParams({ 'definition': prefixValue }),
            customHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: "post",
        })
            .then((resp) => {
                generateToast(`Successfully updated "${macroName}" macro.`, "success")
            })
            .catch((error) => {
                console.log(error);
                generateToast(`Failed updated "${macroName}" macro. check console for more detail.`, "error")
            })

    }

    return (
        <div style={{ marginTop: '15px' }} onSubmit={handleSubmit} >
            <form >
                <ControlGroup required={true} label={EmailConfigurationFields.emailSubjectLabel} help={EmailConfigurationFields.emaiSubjectHelp} >
                    <Text inline name='subjectPrefix' value={prefixValue} onChange={(e, { value }) => setData(value)} />
                </ControlGroup>
                <ControlGroup label=''>
                    <Button style={{ maxWidth: '80px' }} type='submit' label="Save" appearance="primary" />
                </ControlGroup>
            </form>
            <CyencesDocFooter location="install_configure/configuration/#cyences-general-setup"></CyencesDocFooter>
        </div>
    );
}