import { axiosCallWrapper } from './axiosCallWrapper';

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

export { fetchProducts, saveProductConfig }