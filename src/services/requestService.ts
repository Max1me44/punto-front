import axios from "axios";

/**
 * Add parameters to the URL
 * @param {string} url - The URL to which parameters should be added
 * @param {Object} params - The parameters to add to the URL
 * @returns {string} - The modified URL with added parameters
 */
const addParamsToUrl = (url: string, params: Record<string, any>) => {
    const paramsToAdd = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(JSON.stringify(params[key]))}`)
        .join("&");

    return url + (url.includes("?") ? "&" : "?") + paramsToAdd;
};

/**
 * HTTP request function
 * @param {string} method - The HTTP method (get, post, put, delete)
 * @param {string} url - The URL for the request
 * @param {Object} [data] - The request body data (for post and put requests)
 * @param {Object} [headers] - Additional headers for the request
 * @param {boolean} [needRawResponse] - Flag to indicate if raw response is needed
 * @returns {Promise<any>} - The promise with the response data
 */
async function request(method: string, url: string, data?: any, headers: Record<string, any> = {}, needRawResponse = false) {
    try {
        const response = await axios({ method, url, data, headers, withCredentials: true });

        if (response.status === 204 || needRawResponse) {
            return response;
        } else {
            return response.data;
        }
    } catch (error) {
        console.error("Erreur lors de la requête API:", error);
        throw error;
    }
}

/**
 * Request Service
 * Service for HTTP requests
 * @type {{get(*=): Promise<*>, post(*=, *=): Promise<*>, put(*=, *=): Promise<*>, delete(*=): Promise<*>}}
 */
const RequestService = {
    get(url: string) {
        return request("get", url);
    },
    post(url: string, data: any) {
        return request("post", url, data);
    },
    put(url: string, data: any) {
        return request("put", url, data);
    },
    delete(url: string) {
        return request("delete", url);
    },
    addParamsToUrl,
};

export default RequestService;
