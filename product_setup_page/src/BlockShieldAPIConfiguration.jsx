
import React, { useEffect, useState } from 'react';
import SimpleForm from './components/SimpleForm';
import CyencesDocFooter from './components/CyencesDocFooter';
import { axiosCallWrapper } from './utils/axiosCallWrapper';
import { generateToast } from './utils/util';

const BlockShieldFields = {
    usernameLabel: 'Username',
    usernameHelp: 'BlockShield Username',
    passwordLabel: 'Password',
    passwordHelp: 'BlockShield Password',
}


export default function BlockShieldAPIConfiguration() {

    const [data, setData] = useState('');

    useEffect(() => {
        axiosCallWrapper({
            endpointUrl: `BlockShieldConfiguration`
        })
            .then((resp) => {
                const content = resp.data.entry[0].content;
                const { username = '', password = '' } = content;;
                setData({ username, password: '' });
            })
            .catch((error) => {
                console.log(error);
                if (error?.response?.data?.messages[0]?.text){
                    error=error.response.data.messages[0].text;
                }
                generateToast(`Failed to load BlockShield Configuration. error=${error}`, "error");
            })

    }, []);

    function onSave(username, password) {
        const payload = JSON.stringify({
            "username": username,
            "password": password
        })
        axiosCallWrapper({
            endpointUrl: `BlockShieldConfiguration/blockshield`,
            body: new URLSearchParams({ data: payload }),
            customHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: "post",
        })
            .then((resp) => {
                generateToast(`BlockShield configuration saved successfully`, "success")
            })
            .catch((error) => {
                console.log(error);
                if (error?.response?.data?.messages[0]?.text){
                    error=error.response.data.messages[0].text;
                }
                generateToast(`Failed to update BlockShield Configuration. error=${error}`, "error")
            })
    }

    return (
        <>
            <SimpleForm key="blockshield" {...BlockShieldFields} onSave={onSave} username={data.username} password={data.password} />
            <CyencesDocFooter location="install_configure/configuration/#blockshield-api-configuration"></CyencesDocFooter>
        </>
    );
}
