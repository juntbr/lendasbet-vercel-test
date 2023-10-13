import axios from "axios";

interface DefaultResponse {
  items: any[];
}

export async function fetcher<T = DefaultResponse>(
  url: string,
  params?: any,
): Promise<T> {
  try {
    const response = await axios.get<T>(url, params);

    return response.data;
  } catch (e) {
    throw new Error("An error occurred while fetching the data.");
  }
}

export default fetcher;
