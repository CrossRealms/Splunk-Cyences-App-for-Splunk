import React, { useEffect, useState } from 'react';
import SimpleForm from './components/SimpleForm';
import { axiosCallWrapper } from './utils/axiosCallWrapper';
import { generateToast } from './utils/util';

const MaliciousIPCollectorFields = {
    usernameLabel: 'API URL',
    usernameHelp: '',
    passwordLabel: 'Auth Token',
    passwordHelp: 'Re-enter the Auth Token before clicking Save',
}


export default function MaliciousIPCollectorSetup() {

    const [data, setData] = useState('');

    useEffect(() => {
        axiosCallWrapper({
            endpointUrl: `MaliciousIPConfiguration`
        })
            .then((resp) => {
                const content = resp.data.entry[0].content;
                const { api_url = '', auth_token = '' } = content;;
                setData({ api_url, auth_token: '' });
            })
            .catch((error) => {
                generateToast(`Failed to load MaliciousIP Configuration. check console for more detail.`, "error");
                console.log(error);
            })

    }, []);

    function onSave(username, password) {
        const payload = JSON.stringify({
            "api_url": username,
            "auth_token": password
        })
        axiosCallWrapper({
            endpointUrl: `MaliciousIPConfiguration/maliciousip`,
            body: new URLSearchParams({ data: payload }),
            customHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: "post",
        })
            .then((resp) => {
                generateToast(`MaliciousIP configuration saved successfully`, "success")
            })
            .catch((error) => {
                console.log(error);
                generateToast(`Failed to update MaliciousIP Configuration. check console for more detail.`, "error")
            })
    }

    return (
        <>
            <SimpleForm key='maliciousip' {...MaliciousIPCollectorFields} onSave={onSave} username={data.api_url} password={data.auth_token} />
        </>
    );
}