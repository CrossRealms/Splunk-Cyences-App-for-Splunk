import React, { useEffect, useState } from 'react';
import Heading from '@splunk/react-ui/Heading';
import CyencesDocFooter from './components/CyencesDocFooter';
import { MacroSetup } from './MacroSetupApp';


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

    return (
        <>
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