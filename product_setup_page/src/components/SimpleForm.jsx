import React, { useEffect, useState } from 'react';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Button from '@splunk/react-ui/Button';
import Text from '@splunk/react-ui/Text';


function SimpleForm(props) {
    const { username = 'Loading...', password = '', usernameLabel, usernameHelp = '', passwordLabel, passwordHelp = '', passwordType = 'password', onSave, marginLeft = 'none' } = props;
    const [user, setUser] = useState(username);
    const [pass, setPass] = useState(password);

    useEffect(() => {
        setUser(username);
    }, [username]);

    useEffect(() => {
        setPass(password);
    }, [password]);

    function handleSubmit(e) {
        e.preventDefault();
        onSave(user, pass);
    }

    return (
        <div style={{ marginTop: '15px', marginLeft: marginLeft }} onSubmit={handleSubmit} >
            <form>
                <ControlGroup required={true} label={usernameLabel} help={usernameHelp} >
                    <Text inline name='username' value={user} onChange={(e, { value }) => setUser(value)} />
                </ControlGroup>
                <ControlGroup required={true} label={passwordLabel} help={passwordHelp} >
                    <Text inline name='password' type={passwordType} value={pass} onChange={(e, { value }) => setPass(value)} />
                </ControlGroup>
                <ControlGroup label=''>
                    <Button style={{ maxWidth: '80px' }} type='submit' label="Save" appearance="primary" />
                </ControlGroup>
            </form>
        </div>
    );

}

export default SimpleForm;