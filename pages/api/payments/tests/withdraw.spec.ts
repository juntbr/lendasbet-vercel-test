import { describe, expect } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import HttpStatus from 'http-status'

import withdraw from '../withdraw'

import { GatewayService, GatewayType } from 'services/GatewayService'
import { GetUserDetails } from 'services/GamMatrix/GetUserDetails'
import { IsActiveUserSession } from 'services/GamMatrix/isActiveUserSession'
import { GetUserAccounts } from 'services/GamMatrix/GetUserAccounts'
import { doc, setDoc } from 'firebase/firestore'

import { GamMatrix } from 'services/GamMatrix'

import {
  INVALID_SESSION_ID,
  USER_ACCOUNTS_RESPONSE,
  USER_DETAILS,
  USER_ID,
  VALID_SESSION_ID,
} from 'mocks/user'
import { TRANSACTION_WITHDRAW_ID } from 'mocks/order'
import { formatDataToPartner } from 'services/Caship/formatDataToPartner'
const GetUserDetailsMock = jest.mocked(GetUserDetails)
const IsActiveUserSessionMock = jest.mocked(IsActiveUserSession)
const GetUserAccountsMock = jest.mocked(GetUserAccounts)
const GamMatrixMock = jest.mocked(GamMatrix)

jest.mock('firebase/firestore')
jest.mock('services/GatewayService')
jest.mock('services/GamMatrix/isActiveUserSession')
jest.mock('services/GamMatrix/GetUserDetails')
jest.mock('services/GamMatrix/GetUserAccounts')
jest.mock('services/GamMatrix')
jest.mock('services/GetUserIp')

const AMOUNT = '100'

const partnerData = formatDataToPartner({
  userDetails: USER_DETAILS,
  amount: AMOUNT,
  orderNumber: TRANSACTION_WITHDRAW_ID,
  userId: USER_ID,
})

const SCREENING_REQUEST_PARAMS = {
  amount: AMOUNT,
  merchantInvoiceId: `${TRANSACTION_WITHDRAW_ID}_GATEWAY_PAY4FUN`,
  currency: 'BRL',
  targetCustomerMainId: partnerData.partner_user_document,
  targetCustomerEmail: partnerData.partner_user_email,
  fullName: partnerData.partner_user_name,
  targetCustomerBirthDate: partnerData.partner_user_birthday,
  targetCustomerPhoneNumberCountryCode: '55',
  targetCustomerPhoneNumberAreaCode: partnerData.partner_user_mobile.substring(
    0,
    2,
  ),
  targetCustomerPhoneNumber: partnerData.partner_user_mobile?.substring(2),
}

describe('api/withdraw', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    IsActiveUserSessionMock.mockResolvedValue({
      isActive: true,
      userId: USER_ID,
    })

    GetUserAccountsMock.mockResolvedValue(USER_ACCOUNTS_RESPONSE)

    GamMatrixMock.mockResolvedValue({
      error: false,
      status: 200,
      data: {
        success: true,
        errorData: {
          errorCode: 0,
        },
      },
    })

    GetUserDetailsMock.mockResolvedValue(USER_DETAILS)
  })

  it('should return a function', () => {
    expect(typeof withdraw).toBe('function')
  })

  it('should return with status 403 when sessionId is invalid', async () => {
    IsActiveUserSessionMock.mockResolvedValue({
      isActive: false,
      userId: null,
    })

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        gatewayType: GatewayType.CASHIP,
        amount: 100,
        sessionId: INVALID_SESSION_ID,
        pixtype: 'CPF',
        pixkey: '12345678901',
      },
    })

    await withdraw(req, res)

    expect(IsActiveUserSessionMock).toHaveBeenCalledWith(INVALID_SESSION_ID)
    expect(res._getStatusCode()).toBe(HttpStatus.FORBIDDEN)
  })

  it('should return message with status 400 if gamatrix withdraw returns error', async () => {
    const MESSAGE_ERROR = 'Falha ao realizar operação.'
    const STATUS_CODE = HttpStatus.BAD_REQUEST

    GamMatrixMock.mockResolvedValue({
      error: true,
      status: STATUS_CODE,
      data: {
        errorData: {
          errorCode: 1,
        },
      },
    })

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        gatewayType: GatewayType.PAY4FUN,
        pixtype: 'CPF',
        pixkey: '12345678901',
        amount: 100,
        sessionId: VALID_SESSION_ID,
      },
    })

    await withdraw(req, res)

    expect(res._getStatusCode()).toBe(STATUS_CODE)
    expect(res._getJSONData()).toEqual({
      error: true,
      message: MESSAGE_ERROR,
    })
  })

  it('should return success if gamatrix withdraw returns success', async () => {
    const MESSAGE_SUCCESS = 'Sua solicitação de saque foi enviada com sucesso.'

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        gatewayType: GatewayType.CASHIP,
        pixtype: 'CPF',
        pixkey: '12345678901',
        amount: 100,
        sessionId: VALID_SESSION_ID,
      },
    })

    await withdraw(req, res)

    expect(doc).toBeCalled()
    expect(setDoc).toBeCalled()
    expect(res._getStatusCode()).toBe(200)
    expect(res._getJSONData()).toEqual({
      error: false,
      data: {},
      message: MESSAGE_SUCCESS,
    })
  })

  it('should call gateway screening if request for pay4fun', async () => {
    const MESSAGE_SUCCESS = 'Sua solicitação de saque foi enviada com sucesso.'

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        gatewayType: GatewayType.PAY4FUN,
        pixtype: 'CPF',
        pixkey: '12345678901',
        amount: AMOUNT,
        sessionId: VALID_SESSION_ID,
      },
    })

    const SCREENING_RESPONSE = {
      error: false,
      statusCode: HttpStatus.OK,
      data: {
        code: HttpStatus.OK,
        message: 'success',
        url: 'SCREENING_URL',
      },
      message: 'success',
    }

    const screeningMock = jest
      .spyOn(GatewayService.prototype, 'screening')
      .mockResolvedValue(SCREENING_RESPONSE)

    await withdraw(req, res)

    expect(screeningMock).toHaveBeenCalledWith({
      type: GatewayType.PAY4FUN,
      params: {
        ...SCREENING_REQUEST_PARAMS,
        okUrl: process.env.PAY4FUN_OK_URL.replace('deposit', 'withdraw'),
        notOkUrl: process.env.PAY4FUN_NOT_OK_URL.replace(
          'deposit',
          'withdraw',
        ).replace('success', 'notok'),
      },
    })
    expect(res._getStatusCode()).toBe(HttpStatus.OK)
    expect(res._getJSONData()).toEqual({
      error: false,
      data: SCREENING_RESPONSE.data,
      message: MESSAGE_SUCCESS,
    })
  })

  it('should return message with status 400 when screening returns error', async () => {
    const MESSAGE = 'Falha na solicitação de saque.'

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        gatewayType: GatewayType.PAY4FUN,
        pixtype: 'CPF',
        pixkey: '12345678901',
        amount: AMOUNT,
        sessionId: VALID_SESSION_ID,
      },
    })

    const SCREENING_RESPONSE = {
      error: true,
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        code: HttpStatus.BAD_REQUEST,
        message: 'error',
      },
      message: 'error',
    }

    jest
      .spyOn(GatewayService.prototype, 'screening')
      .mockResolvedValue(SCREENING_RESPONSE)

    await withdraw(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.BAD_REQUEST)
    expect(res._getJSONData()).toEqual({
      error: true,
      data: null,
      message: MESSAGE,
    })
  })
})
