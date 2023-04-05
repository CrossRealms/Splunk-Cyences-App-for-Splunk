import React, { useEffect, useState } from 'react';
import Button from '@splunk/react-ui/Button';
import Text from '@splunk/react-ui/Text';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Accordion from '@splunk/react-ui/Accordion';
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
            <ControlGroup label={macroName}>
                <Text inline value={macro} onChange={handleChange} /> <Button label="Update" appearance="primary" onClick={updateMacro} />
            </ControlGroup>
        </div>
    );
}

export default function MacroSetupApp() {
    return (
        <div>
            <Accordion defaultOpenPanelId={1}>
                {allMacros.map(({ section, macros }) => {
                    return (
                        <Accordion.Panel key={section} panelId={section} title={section}>
                            <div key={section} style={{ marginLeft: '300px' }}>
                                {macros?.map((macroName) => <MacroSetup key={macroName} macroName={macroName} />)}
                            </div>
                        </Accordion.Panel>
                    )
                })}
            </Accordion>
        </div>
    );
}
