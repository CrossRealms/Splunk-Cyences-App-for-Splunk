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
const outsideWorkingHourMacro = "cs_outside_working_hour_definition"


export default function CyencesGeneralConfiguration() {

    const [prefixValue, setData] = useState('');
    const [outsideWorkingHourValue, setOutsideWorkingHourValue] = useState('');


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
                console.log(error);
                if (error?.response?.data?.messages[0]?.text){
                    error=error.response.data.messages[0].text;
                }
                generateToast(`Failed to load Cyences email alert action configuration. error=${error}`, "error");
            })
        
        axiosCallWrapper({
            endpointUrl: `configs/conf-macros/${outsideWorkingHourMacro}`,
        })
            .then((resp) => {
                const content = resp.data.entry[0].content;
                setOutsideWorkingHourValue(content.definition);
            })
            .catch((error) => {
                console.log(error);
                if (error?.response?.data?.messages[0]?.text){
                    error = error.response.data.messages[0].text;
                }
                generateToast(`Failed to load "${outsideWorkingHourMacro}" macro. error=${error}`, "error");
            });
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
                if (error?.response?.data?.messages[0]?.text){
                    error=error.response.data.messages[0].text;
                }
                generateToast(`Failed to update Cyences email alert action configuration. error=${error}`, "error")
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
                if (error?.response?.data?.messages[0]?.text){
                    error=error.response.data.messages[0].text;
                }
                generateToast(`Failed to update Cyences digest email alert action configuration. error=${error}`, "error")
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
                if (error?.response?.data?.messages[0]?.text){
                    error=error.response.data.messages[0].text;
                }
                generateToast(`Failed updated "${macroName}" macro. error=${error}`, "error")
            })
        
        axiosCallWrapper({
            endpointUrl: `configs/conf-macros/${outsideWorkingHourMacro}`,
            body: new URLSearchParams({ 'definition': outsideWorkingHourValue }),
            customHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: "post",
        })
            .then(() => {
                generateToast(`Successfully updated "${outsideWorkingHourMacro}" macro.`, "success");
            })
            .catch((error) => {
                console.log(error);
                if (error?.response?.data?.messages[0]?.text){
                    error = error.response.data.messages[0].text;
                }
                generateToast(`Failed to update "${outsideWorkingHourMacro}" macro. error=${error}`, "error");
            });
    }

    return (
        <div style={{ marginTop: '15px' }} onSubmit={handleSubmit} >
            <form >
                <ControlGroup required={true} label={EmailConfigurationFields.emailSubjectLabel} help={EmailConfigurationFields.emaiSubjectHelp} >
                    <Text inline name='subjectPrefix' value={prefixValue} onChange={(e, { value }) => setData(value)} />
                </ControlGroup>
                <ControlGroup required={true} label='Outside Working Hours' help='Definition for outside working hours (default setting is set to the weekend plus any weekday before 6am and after 7pm)'>
                    <Text inline name='passwordChangeHours' value={outsideWorkingHourValue} onChange={(e, { value }) => setOutsideWorkingHourValue(value)} />
                </ControlGroup>
                <ControlGroup label=''>
                    <Button style={{ maxWidth: '80px' }} type='submit' label="Save" appearance="primary" />
                </ControlGroup>
            </form>
            <CyencesDocFooter location="install_configure/configuration/#cyences-general-setup"></CyencesDocFooter>
        </div>
    );
}