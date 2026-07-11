import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const getGitHubStatus = async () => {
    const response = await API.get("/github/status");
    return response.data;
}

export const getGitHubLoginUrl = async () => {
    const response = await API.get("/github/login");
    return response.data;
}

export const getRepositories = async () => {
    const response = await API.get("/github/repos");
    return response.data;
}


export const importRepository = async (owner , repo) => {
    const response = await API.get(
        `/github/repos/${owner}/${repo}/download`
    );

    return response.data
}


export const syncRepository = (owner , repo) => {
    API.post(
        `/github/repos/${owner}/${repo}/sync`
    );
}

export const removeRepository = (owner, repo) => {
    API.delete(
        `/github/repos/${owner}/${repo}`
    );
}

export const getImportedRepositories = async () => {
    const response = await API.get("/github/imported");
    return response.data
}