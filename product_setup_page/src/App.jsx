import React, { useEffect, useState, useCallback } from 'react';
import NavBar from './components/NavBar';

import CyencesGeneralConfiguration from './CyencesGeneralConfiguration';
import ProductSetupApp from './ProductSetupApp';
import MacroSetupApp from './MacroSetupApp';
import CyencesAlertSetup from './CyencesAlertSetup';
import DeviceInventorySetup from './DeviceInventorySetup';
import CyencesDependencies from './CyencesDependencies';
import BlockShieldAPIConfiguration from './BlockShieldAPIConfiguration';
import SOCAIConfiguration from './SOCAIConfiguration';


const TABS = [
    'Cyences General Configuration',
    'Products Setup',
    'Macro Setup',
    'Cyences Alerts Configuration',
    'BlockShield API Configuration',
    'SOC AI API Configuration',
    'Device Inventory Configuration',
    'Cyences Dependencies'
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
                <CyencesGeneralConfiguration />
            </div>
            <div key={TABS[1]} style={{ display: activeTabId === TABS[1] ? 'block' : 'none' }}>
                <ProductSetupApp />
            </div>
            <div key={TABS[2]} style={{ display: activeTabId === TABS[2] ? 'block' : 'none' }}>
                <MacroSetupApp />
            </div>
            <div key={TABS[3]} style={{ display: activeTabId === TABS[3] ? 'block' : 'none' }}>
                <CyencesAlertSetup />
            </div>
            <div key={TABS[4]} style={{ display: activeTabId === TABS[4] ? 'block' : 'none' }}>
                <BlockShieldAPIConfiguration />
            </div>
            <div key={TABS[5]} style={{ display: activeTabId === TABS[5] ? 'block' : 'none' }}>
                <SOCAIConfiguration />
            </div>
            <div key={TABS[6]} style={{ display: activeTabId === TABS[6] ? 'block' : 'none' }}>
                <DeviceInventorySetup />
            </div>
            <div key={TABS[7]} style={{ display: activeTabId === TABS[7] ? 'block' : 'none' }}>
                <CyencesDependencies />
            </div>
        </div>
    );
}