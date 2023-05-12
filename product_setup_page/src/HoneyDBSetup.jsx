import React, { useEffect, useState } from 'react';
import SimpleForm from './components/SimpleForm';
import CyencesDocFooter from './components/CyencesDocFooter';
import { axiosCallWrapper } from './utils/axiosCallWrapper';
import { generateToast } from './utils/util';

const HoneyDBFields = {
    usernameLabel: 'API ID',
    usernameHelp: '',
    passwordLabel: 'API Key',
    passwordHelp: 'Re-enter the API key before clicking Save',
}


export default function HoneyDBSetup() {

    const [data, setData] = useState('');

    useEffect(() => {
        axiosCallWrapper({
            endpointUrl: `HoneyDBConfiguration`
        })
            .then((resp) => {
                const content = resp.data.entry[0].content;
                const { api_id = '', api_key = '' } = content;;
                setData({ api_id, api_key: '' });
            })
            .catch((error) => {
                generateToast(`Failed to load HoneyDB Configuration. check console for more detail.`, "error");
                console.log(error);
            })

    }, []);

    function onSave(username, password) {
        const payload = JSON.stringify({
            "api_id": username,
            "api_key": password
        })
        axiosCallWrapper({
            endpointUrl: `HoneyDBConfiguration/honeydb`,
            body: new URLSearchParams({ data: payload }),
            customHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: "post",
        })
            .then((resp) => {
                generateToast(`HoneyDB configuration saved successfully`, "success")
            })
            .catch((error) => {
                console.log(error);
                generateToast(`Failed to update HoneyDB Configuration. check console for more detail.`, "error")
            })
    }

    return (
        <>
            <SimpleForm key="honeydb" {...HoneyDBFields} onSave={onSave} username={data.api_id} password={data.api_key} />
            <CyencesDocFooter location="install_configure/configuration/#honey-db-configuration"></CyencesDocFooter>
        </>
    );
}