import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});
export const saveApiKey = async (provider, apiKey) => {
    const response = await api.post("/settings/api-key", {
        provider,
        api_key: apiKey,
    })

    return response.data;
}


export const getApiKeyStatus = async (provider) => {
    const response = await api.get(`/settings/api-key/${provider}`);

    return response.data;
}