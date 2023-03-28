import React, { useEffect, useState } from 'react';
import Button from '@splunk/react-ui/Button';
import Text from '@splunk/react-ui/Text';
import SearchTable from './SearchTable';


export default function MacroConfiguration(props) {
    const { macroName, macroDefinition, defaultSearch, earliestTime, latestTime, updateMacroDefinition } = props;

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setSearchQuery(defaultSearch.replace(`\`${macroName}\``, macroDefinition));
    }, []);


    function handleChange(e, { value }) {
        updateMacroDefinition(macroName, value)
    };

    function updateSearchQuery() {
        setSearchQuery(defaultSearch.replace(`\`${macroName}\``, macroDefinition));
    }

    return (
        <div style={{ marginBottom: '30px' }}>
            <div>{macroName} <Text inline value={macroDefinition} onChange={handleChange} /> <Button label="Run Search" appearance="primary" onClick={updateSearchQuery} /></div>
            <div style={{ marginTop: "10px" }}>
                {searchQuery !== '' && <SearchTable searchQuery={searchQuery} earliestTime={earliestTime} latestTime={latestTime} />}
            </div>
        </div>

    );
}
