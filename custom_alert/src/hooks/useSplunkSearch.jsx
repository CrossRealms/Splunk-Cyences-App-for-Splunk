// src/hooks/useSplunkSearch.js
import { useState, useEffect, useCallback } from "react";
import SearchJob from "@splunk/search-job";
import { app } from '@splunk/splunk-utils/config';
// ^ Adjust this import to match how you currently use SearchJob

/**
 * A reusable hook to run Splunk search queries.
 * @param {string} searchQuery - The Splunk search string.
 * @returns {array|object} The search results.
 */
export default function useSplunkSearch(searchQuery, earliestProp = null, latestProp = null) {
  const [results, setResults] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  // Extract earliest & latest from query
  const extractTimes = (query) => {
    if (!query) return { pureQuery: "", earliest: null, latest: null };

    let earliestMatch = query.match(/earliest\s*=\s*([^\s]+)/);
    let latestMatch = query.match(/latest\s*=\s*([^\s]+)/);

    let earliest = earliestMatch ? earliestMatch[1] : null;
    let latest = latestMatch ? latestMatch[1] : null;

    // Remove earliest & latest from the actual query
    let pureQuery = query
      .replace(/earliest\s*=\s*[^\s]+/g, "")
      .replace(/latest\s*=\s*[^\s]+/g, "")
      .trim();

    return { pureQuery, earliest, latest };
  };

  const { pureQuery, earliest, latest } = extractTimes(searchQuery);

  const finalEarliest = earliestProp || earliest;
  const finalLatest = latestProp || latest;

  const fetchData = useCallback(() => {
    if (!pureQuery) return;

    setResults([]);
    setFields([]);
    setLoading(true);

    const searchParams = { search: pureQuery };

    // Apply earliest/latest only if available
    if (finalEarliest) searchParams.earliest_time = finalEarliest;
    if (finalLatest) searchParams.latest_time = finalLatest;

    console.log("Final Search Params:", searchParams);

    const mySearchJob = SearchJob.create(searchParams, {
      app: app,
      cache: false,
    });

    const resultsSubscription = mySearchJob
      .getResults({ output_mode: "json", count: 0 })
      .subscribe((res) => {
        if (res.isPreview) return;

        const rows = Array.isArray(res.results) ? res.results : [];
        setResults(rows);
        setFields(res.fields || []);
        setLoading(false);
      });

    return () => resultsSubscription.unsubscribe();
  }, [pureQuery, finalEarliest, finalLatest]);

  useEffect(() => {
    const unsubscribe = fetchData();
    return unsubscribe;
  }, [fetchData]);

  return { results, fields, loading, refetch: fetchData };
}
