import axios from "axios";
import {
  ICheckResponse,
  ICreateReferFriend,
  ICreateResponse,
  IDepositReferFriend,
  RequestResponse,
} from "./types";

export class ReferFriendApi {
  public url: string;

  constructor(url?: string) {
    this.url = url ?? process.env.NEXT_PUBLIC_REFER_FRIEND_API_URL;
  }

  async create(
    params: ICreateReferFriend
  ): Promise<RequestResponse<ICreateResponse>> {
    try {
      const { token, ...createParams } = params;

      const response = await axios.post<ICreateResponse>(
        `${this.url}/users/`,
        createParams,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        error: false,
        statusCode: response?.status ?? 200,
        message: response?.statusText,
        data: response.data,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: error?.statusCode ?? 400,
        message: error.message,
        data: null,
      };
    }
  }

  async deposit(
    params: IDepositReferFriend
  ): Promise<RequestResponse<ICreateResponse>> {
    try {
      const { token, userId, ...depositParams } = params;

      const response = await axios.put<ICreateResponse>(
        `${this.url}/users/${userId}/deposit`,
        depositParams,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        error: false,
        statusCode: response?.status ?? 200,
        message: response?.statusText,
        data: null,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: error?.statusCode ?? 400,
        message: error.message,
        data: null,
      };
    }
  }

  async check(referCode: string): Promise<RequestResponse<ICheckResponse>> {
    try {
      const response = await axios.get<ICheckResponse>(
        `${this.url}/refercode/${referCode}`
      );

      if (response.data.referCode !== referCode) {
        throw new Error("Invalid refer code");
      }

      return {
        error: false,
        statusCode: response?.status ?? 200,
        message: response?.statusText,
        data: response.data,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: error?.statusCode ?? 400,
        message: error?.message,
        data: null,
      };
    }
  }

  async getByUserId(userId: string): Promise<RequestResponse<ICheckResponse>> {
    try {
      const response = await axios.get<ICheckResponse>(
        `${this.url}/users/${userId}/refercode`,
        {
          headers: {
            "partner-slug": "lendasbet"
          }
        }
      );

      return {
        error: false,
        statusCode: response?.status ?? 200,
        message: response?.statusText,
        data: response.data,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: error?.statusCode ?? 400,
        message: error?.message,
        data: null,
      };
    }
  }
}

export type {
  ICheckResponse,
  ICreateReferFriend,
  ICreateResponse,
  IDepositReferFriend,
  RequestResponse,
};

export default new ReferFriendApi();
