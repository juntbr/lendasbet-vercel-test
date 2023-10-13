import axios from "axios";
import { DefaultResponse, EndpointName } from "types/gamMatrix";
import endpoints from "./endpoints";

/**
 *
 * @param name
 * @param params
 * @param headers
 * @returns DefaultResponse
 */
export async function GamMatrix<T = any>(
  name: EndpointName,
  params = {}
  // headers = {}
): Promise<DefaultResponse<T>> {
  const endpoint = endpoints[name];

  const config = {
    method: endpoint.method,
    url: `${process.env.GAMMATRIX_API_URL}${endpoint.uri}`,
    data: params,
    // headers: headers,
  };

  try {
    const response = await axios(config);

    return { 
      error: response?.data?.error ?? false, 
      data: response.data, 
      status: response.status 
    };
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        data: error.response.data,
        status: error.response.status,
      };
    } else if (error.request) {
      return { error: true, data: error.request, status: 500 };
    } else {
      return { error: true, data: error.message, status: 500 };
    }
  }
}
