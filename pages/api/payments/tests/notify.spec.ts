import { describe, expect } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import HttpStatus from 'http-status'
import dayjs from 'dayjs'
import { getDocs, QuerySnapshot } from 'firebase/firestore'

import { GatewayService } from 'services/GatewayService'
import { GamMatrix } from 'services/GamMatrix'
import notify from '../notify'

import { USER_IP } from 'mocks/user'
import { ORDER, TRANSACTION_ID, TRANSACTION_WITHDRAW_ID } from 'mocks/order'
import { TransactionStatus } from 'types/GatewayService'
const GamMatrixMock = jest.mocked(GamMatrix)

jest.mock('firebase/firestore')
jest.mock('services/GamMatrix')
jest.mock('services/GetUserIp')
jest.mock('utils/clientApp')

const getDocsMock = jest.mocked(getDocs)

const MESSAGE_ERROR = 'MESSAGE_ERROR'

const GAMMATRIX_DATA = {
  version: '1.0',
  partnerID: process.env.GAMMATRIX_API_SITE_ID,
  partnerKey: process.env.GAMMATRIX_API_SITE_CODE,
  userId: ORDER.partner_user_uid,
  requestAmount: ORDER.partner_order_amount,
  requestCurrency: 'BRL',
  transactionReference: ORDER.partner_order_number,
  userIp: USER_IP,
  applyBonusCode: '',
}

const DOCS = [
  {
    data: () => ({
      id: 'DEPOSIT_ID',
      bonusCode: '',
      transactionId: TRANSACTION_ID,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      ...ORDER,
    }),
  },
]

describe('api/notify', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(GatewayService.prototype, 'checkTransaction').mockResolvedValue({
      statusCode: HttpStatus.OK,
      status: TransactionStatus.SUCCESS,
      error: false,
      message: '',
    })

    GamMatrixMock.mockResolvedValue({
      error: false,
      status: 200,
      data: {
        success: true,
      },
    })

    getDocsMock.mockResolvedValue({
      docs: DOCS,
      forEach: (callback) => DOCS.forEach(callback),
    } as unknown as QuerySnapshot)
  })

  it('should return a function', () => {
    expect(typeof notify).toBe('function')
  })

  it('should fail if checkTransaction returns error', async () => {
    const STATUS_CODE = HttpStatus.OK

    const BODY = {
      partner_order_number: 'TRANSACTION_ID_DEPOSIT',
    }

    const gatewayCheckTransaction = jest
      .spyOn(GatewayService.prototype, 'checkTransaction')
      .mockResolvedValue({
        statusCode: STATUS_CODE,
        status: TransactionStatus.FAILED,
        error: true,
        message: MESSAGE_ERROR,
      })

    const { req, res } = createMocks({
      method: 'POST',
      body: BODY,
    })

    await notify(req, res)

    expect(gatewayCheckTransaction).toHaveBeenCalledWith(BODY)
    expect(res._getStatusCode()).toBe(STATUS_CODE)
  })

  it('should return message with status 200 and message Transaction not found when not exist', async () => {
    const MESSAGE_ERROR = 'Transaction not found'
    const STATUS_CODE = HttpStatus.OK

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        partner_order_number: TRANSACTION_ID,
      },
    })

    getDocsMock.mockResolvedValue({
      docs: [],
      forEach: (callback) => [].forEach(callback),
    } as unknown as QuerySnapshot)

    await notify(req, res)

    expect(res._getStatusCode()).toBe(STATUS_CODE)
    expect(res._getJSONData()).toEqual({
      message: MESSAGE_ERROR,
    })
  })

  it('should call gamatrix when transaction exists [Caship]', async () => {
    const BODY = {
      partner_order_number: TRANSACTION_ID,
    }

    const { req, res } = createMocks({
      method: 'POST',
      body: BODY,
    })

    await notify(req, res)

    expect(GamMatrix).toHaveBeenCalledWith('deposit', GAMMATRIX_DATA)
  })

  it('should call gamatrix when transaction exists [Pay4Fun]', async () => {
    const BODY = {
      MerchantInvoiceId: TRANSACTION_ID,
    }

    const { req, res } = createMocks({
      method: 'POST',
      body: BODY,
    })

    await notify(req, res)

    expect(GamMatrix).toHaveBeenCalledWith('deposit', GAMMATRIX_DATA)
  })

  it('should call gamatrix with requested amount [Pay4Fun]', async () => {
    const REQUESTED_AMOUNT = '100.00'

    const BODY = {
      MerchantInvoiceId: TRANSACTION_ID,
      Amount: REQUESTED_AMOUNT,
    }

    const { req, res } = createMocks({
      method: 'POST',
      body: BODY,
    })

    await notify(req, res)

    expect(GamMatrix).toHaveBeenCalledWith('deposit', {
      ...GAMMATRIX_DATA,
      requestAmount: REQUESTED_AMOUNT,
    })
  })

  it('should return 500 when an error occurs', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        MerchantInvoiceId: 'TRANSACTION_ID_WITHDRAW',
      },
    })

    jest
      .spyOn(GatewayService.prototype, 'checkTransaction')
      .mockRejectedValue(null)

    await notify(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
  })

  it('should return 200 if transaction is withdraw', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        partner_order_number: TRANSACTION_WITHDRAW_ID,
      },
    })

    getDocsMock.mockResolvedValue({
      docs: [
        {
          data: () => ({
            id: 'DEPOSIT_ID',
            bonusCode: '',
            transactionId: TRANSACTION_ID,
            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            ...ORDER,
          }),
        },
      ],
      forEach: (callback) => DOCS.forEach(callback),
    } as unknown as QuerySnapshot)

    await notify(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.OK)
  })

  it('should return 200 if method is different from POST', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await notify(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.OK)
  })
})
