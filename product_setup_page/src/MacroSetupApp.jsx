import React, { useEffect, useState, useCallback } from 'react';
import Button from '@splunk/react-ui/Button';
import Text from '@splunk/react-ui/Text';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import NavBar from './components/NavBar';
import { axiosCallWrapper } from './utils/axiosCallWrapper';
import { generateToast } from './utils/util';
import allMacros from "./allMacros";


function MacroSetup(props) {
    const { macroName } = props;
    const [macro, setMacro] = useState('Loading...');

    useEffect(() => {
        axiosCallWrapper({
            endpointUrl: `configs/conf-macros/${macroName}`
        })
            .then((resp) => {
                setMacro(resp.data.entry[0].content.definition);
            })
            .catch((error) => {
                console.log(error);
            })

    }, [macroName]);

    function updateMacro() {
        axiosCallWrapper({
            endpointUrl: `configs/conf-macros/${macroName}`,
            body: new URLSearchParams({ 'definition': macro }),
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

    function handleChange(e, { value }) {
        setMacro(value)
    };

    return (
        <div>
            <ControlGroup style={{ maxWidth: '600px' }} label={macroName} >
                <Text inline style={{ width: '400px' }} value={macro} onChange={handleChange} />
                <Button style={{ maxWidth: '80px' }} label="Update" appearance="primary" onClick={updateMacro} />
            </ControlGroup>
        </div>
    );
}

export default function MacroSetupApp() {
    const [activeTabId, setActiveTabId] = useState(allMacros[0].section);

    const handleChange = useCallback((e, { selectedTabId }) => {
        setActiveTabId(selectedTabId);
    }, []);

    return (

        <div style={{ display: 'flex' }}>
            <NavBar key='macroMenu' activeTabId={activeTabId} handleChange={handleChange} items={allMacros?.map((item) => item.section)} />
            <div style={{ 'marginLeft': '320px', marginTop: '20px' }}>
                {
                    allMacros?.map((item) => (
                        <div key={item.section} style={{ display: activeTabId === item.section ? 'block' : 'none' }}>
                            {item.macros.map((macroName) => <MacroSetup key={macroName} macroName={macroName} />)}
                        </div>
                    ))
                }
            </div>
        </div>

    );
}
