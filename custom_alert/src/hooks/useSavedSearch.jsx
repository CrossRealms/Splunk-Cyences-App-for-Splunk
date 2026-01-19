import { useCallback, useEffect, useState } from 'react';
import { fetchSavedSearches } from '../utils/api';
import { useToast } from '../SnackbarProvider';

export default function useSavedSearches(options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchSavedSearches({
        count: 0,
        add_orphan_field: true,
        ...options,
        search: `(eai:acl.app="cyences_app_for_splunk") AND ((is_scheduled=1 AND (alert_type!=always OR alert.track=1 OR (actions="*" AND actions!=""))))`
      }, showToast);

      const entries = response?.data?.entry || [];

      const rows = entries.map((item) => {
        const { content = {}, acl = {}, name } = item;

        let type = 'Search';
        if (content.is_scheduled && content.alert_type) type = 'Alert';
        else if (content.is_scheduled) type = 'Report';

        return {
          id: name,
          title: name,
          description: content.description,
          search: content.search,
          Type: type,
          next_scheduled_time: content.next_scheduled_time,
          Owner: acl.owner,
          App: acl.app,
          Sharing: acl.sharing,
          Status: content.disabled ? 'Disabled' : 'Enabled',
          orphaned: content.orphaned === 1,
          severity: content['alert.severity'] || 3,
        };
      });

      setData(rows);
    } catch (err) {
      console.error('Failed to fetch saved searches', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
