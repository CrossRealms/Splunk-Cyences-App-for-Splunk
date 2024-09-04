import React, { useEffect, useState } from 'react';
import Table from '@splunk/react-ui/Table';
import SearchJob from '@splunk/search-job';
import { app } from '@splunk/splunk-utils/config';
import Link from '@splunk/react-ui/Link';


export default function SearchTable({ searchQuery, earliestTime, latestTime }) {
    const [data, setData] = useState({});

    useEffect(() => {
        setData({});
        const mySearchJob = SearchJob.create({
            search: searchQuery,
            earliest_time: earliestTime,
            latest_time: latestTime,
        }, {
            app: app,
            cache: false
        });

        const resultsSubscription = mySearchJob.getResults().subscribe(results => {
            setData(results)
        });

        return () => {
            resultsSubscription.unsubscribe()
        }

    }, [searchQuery, earliestTime, latestTime]);

    if (data.results == undefined) {
        return (
            <div>Running Search...</div>
        );
    }

    if (data.results.length === 0) {
        return (
            <div>No results</div>
        );
    }

    return (
        <Table stripeRows>
            <Table.Head>
                {data.fields?.map(field => (
                    <Table.HeadCell key={field.name}>{field.name}</Table.HeadCell>
                ))}
            </Table.Head>
            <Table.Body>
                {data.results?.map((row, index) => (
                    <Table.Row key={index}>
                        {data.fields?.map(field => (
                            <Table.Cell key={index + field.name}>{field.name == 'Splunkbase Link'? <Link to={row[field.name]} openInNewContext>{row[field.name]}</Link>: row[field.name] }</Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}
