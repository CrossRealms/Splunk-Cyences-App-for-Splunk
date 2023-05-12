import React, { useEffect, useState } from 'react';
import CyencesDocFooter from './components/CyencesDocFooter';
import SimpleForm from './components/SimpleForm';
import { axiosCallWrapper } from './utils/axiosCallWrapper';
import { generateToast } from './utils/util';


const SophosEndpointAPIFields = {
    usernameLabel: 'Client ID',
    usernameHelp: '',
    passwordLabel: 'Client Secret',
    passwordHelp: 'Re-enter the Client Secret before clicking Save',
}

export default function SophosEndpointAPISetup() {

    const [data, setData] = useState('');

    useEffect(() => {
        axiosCallWrapper({
            endpointUrl: `SophosEndpointConfiguration`
        })
            .then((resp) => {
                const content = resp.data.entry[0].content;
                const { client_id = '', client_secret = '' } = content;;
                setData({ client_id, client_secret: '' });
            })
            .catch((error) => {
                generateToast(`Failed to load Sophos Endpoint Configuration. check console for more detail.`, "error");
                console.log(error);
            })

    }, []);

    function onSave(username, password) {
        const payload = JSON.stringify({
            "client_id": username,
            "client_secret": password
        })
        axiosCallWrapper({
            endpointUrl: `SophosEndpointConfiguration/sophosendpoint`,
            body: new URLSearchParams({ data: payload }),
            customHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: "post",
        })
            .then((resp) => {
                generateToast(`Sophos Endpoint configuration saved successfully`, "success")
            })
            .catch((error) => {
                console.log(error);
                generateToast(`Failed to update Sophos Endpoint Configuration. check console for more detail.`, "error")
            })
    }

    return (
        <>
            <SimpleForm key='sophosendpoint' {...SophosEndpointAPIFields} onSave={onSave} username={data.client_id} password={data.client_secret} />
            <CyencesDocFooter location="install_configure/configuration/#sophos-central-api-endpoints-configuration"></CyencesDocFooter>
        </>
    );
}