import React from 'react';
import TabBar from '@splunk/react-ui/TabBar';

export default function NavBar({ activeTabId, handleChange, items }) {
    return (
        <TabBar activeTabId={activeTabId} onChange={handleChange} layout="vertical">
            {
                items?.map((item) => (
                    <TabBar.Tab key={item} label={item} tabId={item} />
                ))
            }
        </TabBar>
    );
}
