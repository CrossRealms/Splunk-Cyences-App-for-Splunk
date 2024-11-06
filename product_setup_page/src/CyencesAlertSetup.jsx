import React, { useEffect, useState } from 'react';
import Heading from '@splunk/react-ui/Heading';
import CyencesDocFooter from './components/CyencesDocFooter';
import { axiosCallWrapper } from './utils/axiosCallWrapper';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import { MacroSetup } from './MacroSetupApp';
import Switch from '@splunk/react-ui/Switch';
import { isTrue, generateToast } from './utils/util';


const SeparateDigestMacro = "cs_separate_digest_required_for_common_recipients"

const SOCTeamConfigurationMacros = [
    { name: 'cs_soc_email', description: 'comma separated list of email addresses of the SOC team/members' },
    { name: 'cs_soc_immediate_alert_severities', description: 'comma separated list of alert severity levels that are included in the email; default - critical severity only' },
    { name: 'cs_soc_digest_alert_severities', description: 'comma separated list of alert severity levels that are included in the email; default - high & medium severities' },
    { name: 'cs_soc_alerts_to_exclude_from_digest_alert', description: 'comma separated alert titles to exclude from alert digest email' },
    { name: 'cs_soc_recipients_to_exclude_for_digest_alert', description: 'comma separated recipients to exclude from alert digest email' },
]

const ComplianceTeamConfigurationMacros = [
    { name: 'cs_compliance_email', description: 'comma separated list of email addresses of the Compliance team/members.' },
    { name: 'cs_compliance_immediate_alert_severities', description: 'comma separated list of alert severity levels that are included in the email; default - critical severity only' },
    { name: 'cs_compliance_digest_alert_severities', description: 'comma separated list of alert severity levels that are included in the email; default - high & medium severities' },
    { name: 'cs_compliance_alerts_to_exclude_from_digest_alert', description: 'comma separated alert titles to exclude from alert digest email' },
    { name: 'cs_compliance_recipients_to_exclude_for_digest_alert', description: 'comma separated recipients to exclude from alert digest email' },
]

export default function CyencesAlertSetup() {

    const [isEnabled, setEnabled] = useState(null)

    useEffect(() => {
        axiosCallWrapper({
            endpointUrl: `configs/conf-macros/${SeparateDigestMacro}`
        })
            .then((resp) => {
                setEnabled(isTrue(resp.data.entry[0].content.definition));
            })
            .catch((error) => {
                console.log(error);
            })

    }, [SeparateDigestMacro]);

    function updateMacro() {
        axiosCallWrapper({
            endpointUrl: `configs/conf-macros/${SeparateDigestMacro}`,
            body: new URLSearchParams({ 'definition': !isEnabled }),
            customHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: "post",
        })
            .then((resp) => {
                generateToast(`Successfully updated "${SeparateDigestMacro}" macro.`, "success")
                setEnabled(!isEnabled)
            })
            .catch((error) => {
                console.log(error);
                generateToast(`Failed updated "${SeparateDigestMacro}" macro. check console for more detail.`, "error")
            })
    }

    return (
        <>
            <Heading style={{ marginLeft: '20px' }}>General Alert Configuration</Heading>
            <div style={{ marginLeft: '250px' }}>
                <ControlGroup style={{marginLeft: '20px'}} label="Do you want separate digest alert for the common SOC and Compliance receipents?" help="">
                    <Switch inline key={SeparateDigestMacro} value={SeparateDigestMacro} selected={isEnabled} appearance="toggle" onClick={updateMacro}></Switch>
                </ControlGroup>
            </div>

            <Heading style={{ marginLeft: '20px' }}>SOC Team Configuration</Heading>
            <div style={{ marginLeft: '250px' }}>
                {SOCTeamConfigurationMacros.map((macroItem) => <MacroSetup key={macroItem.name} macroName={macroItem.name} description={macroItem.description} />)}
            </div>

            <Heading style={{ marginLeft: '20px' }}>Compliance Team Configuration</Heading>
            <div style={{ marginLeft: '250px' }}>
                {ComplianceTeamConfigurationMacros.map((macroItem) => <MacroSetup key={macroItem.name} macroName={macroItem.name} description={macroItem.description} />)}
            </div>

            <CyencesDocFooter location="install_configure/configuration/#cyences-alerts-configuration"></CyencesDocFooter>
        </>
    );
}