import React, { useEffect, useState } from 'react';
import Link from '@splunk/react-ui/Link';
import Heading from '@splunk/react-ui/Heading';
import CyencesDocFooter from './components/CyencesDocFooter';

export default function UserInventorySetup() {
    return (
        <>
        <div style={{ marginLeft: '20px' }}>
            <Heading>Backfill User Inventory</Heading>
            <Link style={{ marginLeft: '40px', marginTop: '15px' }} to="/en-GB/manager/cyences_app_for_splunk/saved/searches?app=cyences_app_for_splunk&count=100&offset=0&itemType=&owner=nobody&search=User Inventory - Lookup Backfill" openInNewContext>Open Search</Link>
            <Heading>CleanUp User Inventory Related Lookups</Heading>
            <Link style={{ marginLeft: '40px', marginTop: '15px' }} to="/en-GB/manager/cyences_app_for_splunk/saved/searches?app=cyences_app_for_splunk&count=100&offset=0&itemType=&owner=nobody&search=User Inventory - Lookup CleanUp" openInNewContext>Open Search</Link>
        </div>
        <CyencesDocFooter location="install_configure/configuration/#user-inventory"></CyencesDocFooter>
        </>
    );
}