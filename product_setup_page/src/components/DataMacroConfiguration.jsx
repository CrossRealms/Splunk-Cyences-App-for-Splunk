import React, { useEffect, useState } from 'react';
import Button from '@splunk/react-ui/Button';
import Text from '@splunk/react-ui/Text';
import SearchTable from './SearchTable';

export default function DataMacroConfiguration(props) {
    const { macroName, macroLabel, macroDefinition, defaultSearch, earliestTime, latestTime, updateMacroDefinition } = props;

    const [searchQuery, setSearchQuery] = useState('');
    const [earliestText, setEarliestText] = useState('');
    const [latestText, setLatestText] = useState('');
    const [earliest, setEarliest] = useState('');
    const [latest, setLatest] = useState('');

    useEffect(() => {
        setSearchQuery(defaultSearch.replaceAll(`\`${macroName}\``, macroDefinition));
        setEarliest(earliestTime);
        setEarliestText(earliestTime);
        setLatest(latestTime);
        setLatestText(latestTime);
    }, []);


    function handleChange(e, { value }) {
        updateMacroDefinition(macroName, value)
    };

    function updateSearchQuery() {
        setSearchQuery(defaultSearch.replaceAll(`\`${macroName}\``, macroDefinition));
        setEarliest(earliestText);
        setLatest(latestText);
    }

    return (
        <div style={{ marginBottom: '30px', marginTop: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
                <label>{macroLabel} </label>
            </div>
            <div>
                <Text inline name='search' style={{ width: '600px' }} value={macroDefinition} onChange={handleChange} />
                <Text inline name='earliest' style={{ width: '80px' }} value={earliestText} onChange={(e, { value }) => setEarliestText(value)} />
                <Text inline name='latest' style={{ width: '80px' }} value={latestText} onChange={(e, { value }) => setLatestText(value)} />
                <Button label="Run Search" appearance="primary" onClick={updateSearchQuery} />
            </div>
            <div style={{ marginTop: "10px" }}>
                {searchQuery !== '' && <SearchTable searchQuery={searchQuery} earliestTime={earliest} latestTime={latest} />}
            </div>
        </div>

    );
}
