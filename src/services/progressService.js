import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch dashboard data" };
  }
};

const trackStudySession = async ({ documentId, durationSeconds }) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${BASE_URL}${API_PATHS.PROGRESS.TRACK_STUDY_SESSION}`, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        documentId,
        durationSeconds,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to record study session");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

const progressService = {
  getDashboardData,
  trackStudySession,
};

export default progressService;
