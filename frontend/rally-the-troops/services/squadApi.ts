import axios from "axios";

export const getSquad = async (userId: string | null) => {
  const response = await axios.get(`/squad?userId=${userId}`);
  return response.data.squad;
};

export const getPendingRequests = async (userId: string | null) => {
  const response = await axios.get(`/squad/pending-requests?userId=${userId}`);
  return response.data.pendingRequests;
};

export const respondToRequest = async (requestId: string, action: string) => {
  await axios.post(`/squad/respond-request`, { requestId, status: action });
};

