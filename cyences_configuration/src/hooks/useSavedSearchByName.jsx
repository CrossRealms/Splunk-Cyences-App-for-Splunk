import { useCallback, useEffect, useState } from "react";
import { useToast } from "../SnackbarProvider";
import { fetchSavedSearchesByname } from "../utils/api";

export default function useSavedSearchById(
  name,
  options = { enabled: true }
) {
  const { enabled = true } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    if (!enabled || !name) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchSavedSearchesByname(name, showToast);
      const entry = response?.data?.entry?.[0];

      if (!entry) {
        throw new Error("Saved search not found");
      }

      setData(entry);
    } catch (err) {
      console.error("Failed to fetch saved search", err);
      setError(err);
      showToast("Failed to load alert details", "error");
    } finally {
      setLoading(false);
    }
  }, [name, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
