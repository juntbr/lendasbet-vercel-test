import axios from "axios";
import { DefaultResponse, EndpointName } from "types/caship";
import endpoints from "./endpoints";

export { cashipErrorMessages } from "./cashipErrorMessages";

export const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Basic ${process.env.CASHIP_BASIC_AUTH}`,
};

/**
 *
 * @param name
 * @param params
 * @param headers
 * @returns DefaultResponse
 */
export async function CashipApi(
  name: EndpointName,
  params = {},
  headers = defaultHeaders,
  urlParam = ""
): Promise<DefaultResponse> {
  const endpoint = endpoints[name];

  const config = {
    method: endpoint.method,
    url: `${process.env.CASHIP_API_URL}${endpoint.uri}${urlParam}`,
    data: params,
    headers: headers,
  };

  try {
    const response = await axios(config);
    return {
      error: false,
      data: response.data,
      status: response.status,
      orderStatus: response.data?.order_status_id ?? null,
    };
  } catch (error) {
    if (error.response) {
      if (error.response.data.hasOwnProperty("error_code")) {
        return {
          error: true,
          data: error.response.data,
          status: error.response.status,
          orderStatus: null,
        };
      } else {
        return {
          error: true,
          data: {
            ...error.response.data,
            error_code: error.response.data.error_msg.split("COD:")[1].trim(),
          },
          status: error.response.status,
          orderStatus: null,
        };
      }
    } else if (error.request) {
      return {
        error: true,
        data: error.request,
        status: 500,
        orderStatus: null,
      };
    } else {
      return {
        error: true,
        data: error.message,
        status: 500,
        orderStatus: null,
      };
    }
  }
}

export { CashipService } from "./CashipService";
export type { CashipParams } from "./CashipService";
