import { axiosCallWrapper } from './axiosCallWrapper';

const SAVED_SEARCH_ENDPOINT = 'saved/searches';
const MACROS_ENDPOINT = "data/macros";
const PRODUCT_CONFIG_ENDPOINT = 'CyencesProductConfiguration/product_config';

async function fetchProducts() {
    return await axiosCallWrapper({
        endpointUrl: PRODUCT_CONFIG_ENDPOINT,
    })
}

async function saveProductConfig(payload) {
    const body = new URLSearchParams({ 'data': JSON.stringify(payload) })
    return await axiosCallWrapper({
        endpointUrl: PRODUCT_CONFIG_ENDPOINT,
        body: body,
        method: 'post'
    })
}

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

async function createOrUpdateMacro(name, definition, showToast, mode) {
  const body = new URLSearchParams();
const endpointUrl = mode === "add"
        ? MACROS_ENDPOINT
        : `${MACROS_ENDPOINT}/${encodeURIComponent(name)}`;
  if(mode !== "edit") body.append("name", name);
  body.append("definition", definition);

  return await axiosCallWrapper({
    endpointUrl: endpointUrl,
    body,
    method: "post",
    showToast,
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


export { fetchProducts, saveProductConfig, fetchSavedSearches, createOrUpdateSavedSearch, fetchSavedSearchesByname, deleteSavedSearchByName, createOrUpdateMacro};