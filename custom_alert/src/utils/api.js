import { axiosCallWrapper } from './axiosCallWrapper';

const SAVED_SEARCH_ENDPOINT = 'saved/searches';

async function fetchSavedSearches(params = {},showToast) {
  return await axiosCallWrapper({
    endpointUrl: SAVED_SEARCH_ENDPOINT,
    params,   // axiosCallWrapper should map this to query params
    method: 'get',
    showToast
  });
}

async function fetchSavedSearchesByname(name, params = {}, showToast) {
  const endpointUrl = `${SAVED_SEARCH_ENDPOINT}/${encodeURIComponent(name)}`;
  return await axiosCallWrapper({
    endpointUrl: endpointUrl,
    params,   // axiosCallWrapper should map this to query params
    method: 'get',
    showToast
  });
}

async function createOrUpdateSavedSearch(name, payload, showToast) {
    const isCreate = !name;
  console.log("createOrUpdateSavedSearch called with:", { name, payload });
    // For create, Splunk uses POST on /saved/searches
    // For update, /saved/searches/{name}
    const endpointUrl = isCreate
        ? SAVED_SEARCH_ENDPOINT
        : `${SAVED_SEARCH_ENDPOINT}/${encodeURIComponent(name)}`;

    const body = new URLSearchParams();

    // 🔹 Static params only for CREATE alert
    const staticCreateParams = isCreate
        ? {
            "alert.track": 1,
            "alert.severity": 3,
            alert_type: "number of events",
            alert_threshold: 0,
            alert_comparator: "greater than",
        }
        : {};

    // 🔹 Merge static + dynamic payload
    const finalPayload = {
        ...staticCreateParams,
        ...payload,
    };

    Object.keys(finalPayload).forEach((key) => {
        const value = finalPayload[key];
        if (value !== undefined && value !== null && value !== "") {
            body.append(key, value);
        }
    });

    return await axiosCallWrapper({
        endpointUrl,
        body,
        method: "post",
        showToast,
    });
}

async function deleteSavedSearchByName(name, showToast) {
    const endpointUrl = `${SAVED_SEARCH_ENDPOINT}/${encodeURIComponent(name)}`;

    return await axiosCallWrapper({
        endpointUrl,
        method: "delete",
        showToast
    });
}


export { fetchSavedSearches, createOrUpdateSavedSearch, fetchSavedSearchesByname, deleteSavedSearchByName };