import autobahn from "autobahn-browser";
// há falta de tipos para o autobahm-browser, por hora estamos utilizando o do autobahn.
import { Session, ISubscription } from "autobahn";

import {
  InitializeParams,
  Handler,
  WebApiConfig,
  ConnectionBasic,
  SessionCallSucessResponse,
  SessionCallErrorResponse,
  ConnectionParams,
} from "./types";

export class WebApi {
  private url: string;
  private realm: string;
  public connection: Session | null;
  private listeners: Map<string, Handler>;
  private subscribers: Map<string, ISubscription>;
  private initializeParamsCache: InitializeParams;
  private isReinitializing: boolean;

  constructor() {
    this.url = process.env.NEXT_PUBLIC_API_URL;
    this.realm = process.env.NEXT_PUBLIC_API_REALM;
    this.connection = null;
    this.listeners = new Map();
    this.subscribers = new Map();
  }

  async initialize(
    params?: InitializeParams,
    isReinitialize = false
  ): Promise<Session> {
    if (isReinitialize === false) {
      this.initializeParamsCache = {
        withRegistration: params?.withRegistration,
        onOpen: params?.onOpen,
        onClose: params?.onClose,
        onSessionStateChange: params?.onSessionStateChange,
      };
    }

    this.isReinitializing = true;

    const session = await this.getConnection(this.initializeParamsCache);

    if (this.initializeParamsCache?.onSessionStateChange) {
      this.connection.subscribe("/sessionStateChange", (_, data) => {
        this.initializeParamsCache.onSessionStateChange(data?.code);
      });
    }

    this.isReinitializing = false;

    return session;
  }

  async reinitialize() {
    if (this.isReinitializing === false) {
      this.connection = null;

      return this.initialize(this.initializeParamsCache, true);
    }
  }

  setConfig(config: WebApiConfig) {
    this.url = config.url;
    this.realm = config.realm;

    if (this.connection) {
      this.connection = null;
    }
  }

  async getConnection(params: ConnectionParams) {
    if (!this.connection) {
      this.connection = await new Promise((resolve, reject) => {
        if (!this.url || !this.realm) {
          return reject(
            "Missing connection config url or realm, please use setConfig to define them"
          );
        }

        const autobahnConnection = new autobahn.Connection({
          transports: [
            {
              type: "websocket",
              url: this.url,
              max_retries: 3,
            },
          ],
          realm: this.realm,
        });

        autobahnConnection.onopen = (session) => {
          params?.onOpen?.(session);

          resolve(session);
        };

        autobahnConnection.onclose = (reason: string, message: any) => {
          this.connection = null;

          const rejectResponse = { reason, message };

          params?.onClose?.(rejectResponse);

          reject(rejectResponse);
        };

        autobahnConnection.open();
      });
    }

    return this.connection;
  }

  async rawCall<T = any>(url: string, params?: any): Promise<T> {
    try {
      if (this.connection === null) {
        await this.reinitialize();
      }

      if (this.connection !== null) {
        return this.initialize(this.initializeParamsCache, true).then(
          (session) => {
            return session
              .call(url, [], params)
              .then((response: SessionCallSucessResponse<T>) => {
                if (!response) {
                  return null;
                }
                return response.kwargs;
              })
              .catch((err: SessionCallErrorResponse) => {
                return Promise.reject(err.kwargs);
              });
          }
        );
      } else {
        throw new Error("FAIL_GETCONNECTION_NOT_EXISTS");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async call<T = any>(url: string, params?: any): Promise<T> {
    return this.rawCall(url, params);
  }

  async subscribe(topicURI: string, handler: Handler) {
    this.listeners.set(topicURI, handler);

    const subscriber = await this.connection?.subscribe(topicURI, handler);

    if (subscriber !== undefined) {
      this.subscribers.set(topicURI, subscriber);
    }

    return subscriber;
  }

  unsubscribe(topicURI: string) {
    this.listeners.delete(topicURI);

    const currentSubscriber = this.subscribers.get(topicURI);

    if (this.connection && currentSubscriber !== undefined) {
      this.connection?.unsubscribe(currentSubscriber);

      this.subscribers.delete(topicURI);
    }
  }
}

export type { WebApiConfig } from "./types";

export default WebApi;
