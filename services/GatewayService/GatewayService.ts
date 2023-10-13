import { CashipService } from "services/Caship/CashipService";
import { PaagService } from "services/Paag";
import { Pay4FunService } from "services/Pay4Fun";

import {
  DepositParams,
  DepositResponse,
  GatewayResponse,
  GatewayType,
  ScreeningParams,
  WithdrawParams,
  WithdrawResponse,
} from "types/GatewayService";

interface GatewayServiceParams {
  currentGateway: CashipService | Pay4FunService | PaagService;
}

export class GatewayService {
  private currentGateway: any;

  constructor(params?: GatewayServiceParams) {
    this.currentGateway = params?.currentGateway;
  }

  async withdraw(
    withdrawParams: WithdrawParams,
  ): Promise<GatewayResponse<WithdrawResponse>> {
    const { params } = withdrawParams;
    return await this.currentGateway.withdraw(params);
  }

  async deposit(
    depositParams: DepositParams,
  ): Promise<GatewayResponse<DepositResponse>> {
    const { params } = depositParams;

    return await this.currentGateway.deposit(params);
  }

  async checkTransaction(requestPayload: any): Promise<GatewayResponse> {
    const response = await this.currentGateway.checkTransaction(requestPayload);

    return response;
  }

  async screening(requestPayload: ScreeningParams) {
    if (requestPayload.type === GatewayType.PAY4FUN) {
      return this.currentGateway.screening(requestPayload.params);
    }
  }
}

export { GatewayType };
export type { DepositParams, GatewayResponse };
