import EventSource from "eventsource";
import * as Sentry from "@sentry/browser";

export interface EventResponse {
  type: string;
  data: any;
}

interface BalanceUpdateServiceParams {
  userId: number;
  sessionId: string;
}

export class BalanceUpdateService {
  private sessionId: string;
  private url: string;
  private eventsourceInstance: EventSource;
  public onMessage: (value: EventResponse) => void;

  constructor(params: BalanceUpdateServiceParams) {
    const { userId, sessionId } = params;

    this.url = `${process.env.NEXT_PUBLIC_PLAYER_API_URL}/${userId}/balance/updates`;
    this.sessionId = sessionId;
  }

  handleOnMessage = (event: any) => {
    try {
      const data = JSON.parse(event?.data);

      if (data?.needReconnect) {
        this.connect();
      } else {
        this?.onMessage({
          type: event.type,
          data,
        });
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  connect() {
    this.eventsourceInstance = new EventSource(this.url, {
      headers: {
        "X-SessionId": this.sessionId,
      },
    });

    this.eventsourceInstance.onmessage = this.handleOnMessage;
  }

  close() {
    this.eventsourceInstance?.close?.();
  }
}
