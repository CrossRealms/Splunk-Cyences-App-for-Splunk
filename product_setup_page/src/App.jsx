import React, { useEffect, useState, useCallback } from 'react';
import NavBar from './components/NavBar';

import ProductSetupApp from './ProductSetupApp';
import MacroSetupApp from './MacroSetupApp';
import HoneyDBSetup from './HoneyDBSetup';
import MaliciousIPCollectorSetup from './MaliciousIPCollectorSetup';
import SophosEndpointAPISetup from './SophosEndpointAPISetup';
import SendEmailSetup from './SendEmailSetup';

const TABS = [
    'Products Setup',
    'Macro Setup',
    'HoneyDB Configuration',
    'MaliciousIP Collector Configuration',
    'Sophos Endpoint API Configuration',
    'Cyences Email Action Configuration',
]

export default function App() {

    const [activeTabId, setActiveTabId] = useState(TABS[0]);

    const handleChange = useCallback((e, { selectedTabId }) => {
        setActiveTabId(selectedTabId);
    }, []);


    return (
        <div style={{ display: 'flex' }}>
            <NavBar key='mainMenu' activeTabId={activeTabId} layout='vertical' handleChange={handleChange} items={TABS} />
            <div style={{ marginBottom: '50px' }}></div>
            <div key={TABS[0]} style={{ display: activeTabId === TABS[0] ? 'block' : 'none' }}>
                <ProductSetupApp />
            </div>
            <div key={TABS[1]} style={{ display: activeTabId === TABS[1] ? 'block' : 'none' }}>
                <MacroSetupApp />
            </div>
            <div key={TABS[2]} style={{ display: activeTabId === TABS[2] ? 'block' : 'none' }}>
                <HoneyDBSetup />
            </div>
            <div key={TABS[3]} style={{ display: activeTabId === TABS[3] ? 'block' : 'none' }}>
                <MaliciousIPCollectorSetup />
            </div>
            <div key={TABS[4]} style={{ display: activeTabId === TABS[4] ? 'block' : 'none' }}>
                <SophosEndpointAPISetup />
            </div>
            <div key={TABS[5]} style={{ display: activeTabId === TABS[5] ? 'block' : 'none' }}>
                <SendEmailSetup />
            </div>
        </div>
    );
}