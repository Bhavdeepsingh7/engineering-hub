import API from "./api";

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


export const syncRepository = async (owner , repo) => {
    const response = await API.post(
        `/github/repos/${owner}/${repo}/sync`
    );
    return response.data;
}

export const removeRepository = async (owner, repo) => {
    const response = await API.delete(
        `/github/repos/${owner}/${repo}`
    );
    return response.data;
}

export const getImportedRepositories = async () => {
    const response = await API.get("/github/imported");
    return response.data
}
