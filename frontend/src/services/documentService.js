import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000",
})

export const uploadDocument = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await API.post(
        "/documents/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}

export const getDocument = async () => {
    const response  =await API.get("/documents/");
    return response.data;
}

export const deleteDocument = async(filename) => {
    const response  = await API.delete(`/documents/${filename}`);
    return response.data;
}