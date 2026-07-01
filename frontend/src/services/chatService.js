import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const askQuestion = async (chatId, question) => {
  const response = await API.post(
    `/chats/${chatId}/message`,
    {
      question,
    }
  );

  return response.data;
};

export const createChat = async () => {
  const response = await API.post("/chats");
  return response.data;
};

export const getChat = async (chatId) => {
    const response = await API.get(`/chats/${chatId}`);
    return response.data;
}

export const getChats = async () => {
  const response = await API.get("/chats");
  return response.data;
}