
import React, { useEffect, useState } from 'react';
import SimpleForm from './components/SimpleForm';
import CyencesDocFooter from './components/CyencesDocFooter';
import { axiosCallWrapper } from './utils/axiosCallWrapper';
import { generateToast } from './utils/util';

const SOCAIFields = {
    usernameLabel: 'Username',
    usernameHelp: 'SOC AI Username',
    passwordLabel: 'Password',
    passwordHelp: 'SOC AI Password',
}


export default function SOCAIConfiguration() {

    const [data, setData] = useState('');

    useEffect(() => {
        axiosCallWrapper({
            endpointUrl: `SOCAIConfiguration`
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
                generateToast(`Failed to load SOC AI Configuration. error=${error}`, "error");
            })

    }, []);

    function onSave(username, password) {
        const payload = JSON.stringify({
            "username": username,
            "password": password
        })
        axiosCallWrapper({
            endpointUrl: `SOCAIConfiguration/soc_ai`,
            body: new URLSearchParams({ data: payload }),
            customHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: "post",
        })
            .then((resp) => {
                generateToast(`SOC AI configuration saved successfully`, "success")
            })
            .catch((error) => {
                console.log(error);
                if (error?.response?.data?.messages[0]?.text){
                    error=error.response.data.messages[0].text;
                }
                generateToast(`Failed to update SOC AI Configuration. error=${error}`, "error")
            })
    }

    return (
        <>
            <SimpleForm key="socai" {...SOCAIFields} onSave={onSave} username={data.username} password={data.password} />
            <CyencesDocFooter location="install_configure/configuration/#socai-api-configuration"></CyencesDocFooter>
        </>
    );
}
