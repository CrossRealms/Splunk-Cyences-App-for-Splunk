import React, { useState, useMemo } from 'react';
import SavedSearchesHeader from './Components/SavedSearchesHeader';
import SavedSearchesTable from './Components/SavedSearchesTable';
import useSavedSearches from './hooks/useSavedSearch';

export default function SavedSearchesPage() {
  const { data, loading, error, refetch } = useSavedSearches();
  const [filter, setFilter] = useState('');

  const filteredRows = useMemo(() => {
    if (!filter) return data;
    return data.filter((row) =>
      row.title?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading saved searches</div>;

  return (
    <div className="p-6">
      <SavedSearchesHeader
        filter={filter}
        onFilterChange={setFilter}
        refetch={refetch}
      />
      <SavedSearchesTable rows={filteredRows} refetch={refetch} />
    </div>
  );
}
