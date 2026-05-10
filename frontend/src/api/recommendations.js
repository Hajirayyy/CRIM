import { BASE_URL } from "./api";
export const getRecommendations = async (uploadId, customerId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/recommendations/${uploadId}/${customerId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

  return res.json();
};