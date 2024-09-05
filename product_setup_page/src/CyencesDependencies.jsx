import React, { useEffect, useState } from 'react';
import Heading from '@splunk/react-ui/Heading';
import SearchTable from './components/SearchTable';



const searchQuery = `| rest /services/apps/local splunk_server=local 
| search label IN ("DA-ESS-ContentUpdate", "Splunk Common Information Model", "Flow Map Viz") 
| eval is_installed="Installed" 
| table label, is_installed, disabled
| append 
    [| makeresults count=1 
    | eval label="DA-ESS-ContentUpdate", disabled="-", is_installed="Not Installed", link="https://splunkbase.splunk.com/app/3449/" 
    | table label, is_installed, disabled, link] 
| append 
    [| makeresults count=1 
    | eval label="Splunk Common Information Model", disabled="-", is_installed="Not Installed", link="https://splunkbase.splunk.com/app/1621/" 
    | table label, is_installed, disabled, link] 
| append 
    [| makeresults count=1 
    | eval label="Flow Map Viz", disabled="-", is_installed="Not Installed", link="https://splunkbase.splunk.com/app/4657/" 
    | table label, is_installed, disabled, link] 
| stats first(*) as * by label 
| eval disabled = case(disabled=0, "Enabled", disabled=1, "Disabled", 1==1, "-") 
| table label, is_installed, disabled, link
| rename label as "App Name", is_installed as "Installation Status", link as "Splunkbase Link", disabled as "Enabled/Disabled"
`

export default function CyencesDependencies() {

    return (
        <div style={{ marginLeft: '20px' }}>
            <Heading>App Dependencies</Heading>
            <SearchTable searchQuery={searchQuery} />
        </div>
    );
}