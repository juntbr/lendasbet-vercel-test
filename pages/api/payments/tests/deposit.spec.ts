import { describe, expect } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import HttpStatus from 'http-status'

import deposit from '../deposit'

import { GatewayService } from 'services/GatewayService'
import { GetUserDetails } from 'services/GamMatrix/GetUserDetails'
import { IsActiveUserSession } from 'services/GamMatrix/isActiveUserSession'
import { GamMatrix } from 'services/GamMatrix'
import { DepositResponse } from 'types/GatewayService'

import {
  INVALID_SESSION_ID,
  USER_DETAILS,
  USER_ID,
  VALID_SESSION_ID,
} from 'mocks/user'
import { ORDER } from 'mocks/order'
const GetUserDetailsMock = jest.mocked(GetUserDetails)
const IsActiveUserSessionMock = jest.mocked(IsActiveUserSession)
const GamMatrixMock = jest.mocked(GamMatrix)

jest.mock('firebase/firestore')
jest.mock('services/GamMatrix/isActiveUserSession')
jest.mock('services/GamMatrix/GetUserDetails')
jest.mock('services/GamMatrix')
jest.mock('services/GetUserIp')

describe('api/deposit', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    IsActiveUserSessionMock.mockResolvedValue({
      isActive: true,
      userId: USER_ID,
    })

    GamMatrixMock.mockResolvedValue({
      error: false,
      status: 200,
      data: {
        success: true,
      },
    })

    GetUserDetailsMock.mockResolvedValue(USER_DETAILS)
  })

  it('should return a function', () => {
    expect(typeof deposit).toBe('function')
  })

  it('should return Invalid session with status 500', async () => {
    const STATUS_CODE = 500

    IsActiveUserSessionMock.mockResolvedValue({
      isActive: false,
      userId: null,
    })

    const { req, res } = createMocks({
      method: 'GET',
      body: {
        sessionId: INVALID_SESSION_ID,
      },
    })

    await deposit(req, res)

    expect(IsActiveUserSessionMock).toHaveBeenCalledWith(INVALID_SESSION_ID)
    expect(res._getStatusCode()).toBe(STATUS_CODE)
    expect(res._getJSONData()).toEqual({
      message: 'Invalid session',
    })
  })

  it('should return message with status 400 if gamatrix checkdeposittrans returns error', async () => {
    const MESSAGE_ERROR = 'MESSAGE_ERROR'
    const STATUS_CODE = 400

    GamMatrixMock.mockResolvedValue({
      error: true,
      status: STATUS_CODE,
      data: MESSAGE_ERROR,
    })

    const { req, res } = createMocks({
      method: 'GET',
      body: {
        sessionId: VALID_SESSION_ID,
      },
    })

    await deposit(req, res)

    expect(res._getStatusCode()).toBe(STATUS_CODE)
    expect(res._getJSONData()).toEqual({
      error: true,
      data: MESSAGE_ERROR,
      message: 'Falha ao realizar operação. EMGL-1',
    })
  })

  it('should fail if gatewayService deposit returns error', async () => {
    const MESSAGE_ERROR = 'MESSAGE_ERROR'
    const STATUS_CODE = HttpStatus.BAD_REQUEST

    const gatewayServiceDeposit = jest
      .spyOn(GatewayService.prototype, 'deposit')
      .mockResolvedValue({
        statusCode: STATUS_CODE,
        error: true,
        data: null,
        message: MESSAGE_ERROR,
      })

    const { req, res } = createMocks({
      method: 'GET',
      body: {
        sessionId: VALID_SESSION_ID,
      },
    })

    await deposit(req, res)

    expect(gatewayServiceDeposit).toHaveBeenCalled()
    expect(res._getStatusCode()).toBe(STATUS_CODE)
    expect(res._getJSONData()).toEqual({
      error: true,
      data: null,
      message: MESSAGE_ERROR,
    })
  })

  it('should return success if gatewayService deposit returns success', async () => {
    const MESSAGE_ERROR = 'MESSAGE_ERROR'

    const gatewayServiceDeposit = jest
      .spyOn(GatewayService.prototype, 'deposit')
      .mockResolvedValue({
        statusCode: HttpStatus.OK,
        error: false,
        data: {
          partner_order_amount: ORDER.partner_order_amount,
        } as DepositResponse,
        message: MESSAGE_ERROR,
      })

    const { req, res } = createMocks({
      method: 'GET',
      body: {
        sessionId: VALID_SESSION_ID,
      },
    })

    await deposit(req, res)

    expect(gatewayServiceDeposit).toHaveBeenCalled()
    expect(res._getStatusCode()).toBe(200)
    expect(res._getJSONData()).toEqual({
      error: false,
      data: {
        partner_order_amount: ORDER.partner_order_amount,
      },
      message: '',
    })
  })
})
