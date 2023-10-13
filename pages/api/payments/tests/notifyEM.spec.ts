import { describe, expect } from '@jest/globals'
import HttpStatus from 'http-status'
import { createMocks } from 'node-mocks-http'
import { ORDER } from 'mocks/order'

import notifyEM from '../notifyEM'

import { FirebaseService } from 'services/FirebaseService'
import { GamMatrix } from 'services/GamMatrix'
import { GatewayService } from 'services/GatewayService'
import { updateDoc, doc } from 'firebase/firestore'

import { TransactionStatus, TransactionType } from 'types/gamMatrix'
import { OrderStatus, WithdrawResponse } from 'types/GatewayService'
const GamMatrixMock = jest.mocked(GamMatrix)
const updateDocMock = jest.mocked(updateDoc)
const docMock = jest.mocked(doc)

jest.mock('firebase/firestore')
jest.mock('services/GatewayService')
jest.mock('services/GamMatrix')
jest.mock('services/GetUserIp')
jest.mock('services/FirebaseService')
jest.mock('services/GatewayService')
jest.mock('services/FirebaseService')

const WITHDRAW_DATA = {
  ...ORDER,
  partner_order_number: `${ORDER.partner_order_number}_GATEWAY_CASHIP`,
  order_status_id: OrderStatus.APPROVED,
}

describe('notifyEM', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    GamMatrixMock.mockResolvedValue({
      error: false,
      status: 200,
      data: {
        success: true,
      },
    })

    jest
      .spyOn(FirebaseService.prototype, 'findWithdrawByTransactionId')
      .mockResolvedValue(WITHDRAW_DATA)
  })

  it('should be a function', async () => {
    expect(typeof notifyEM).toBe('function')
  })

  it('should return with status 200 and without data if TransactionType is different of Withdraw', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: {
        type: TransactionType.Deposit,
        status: TransactionStatus.Success,
      },
    })

    await notifyEM(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.OK)
    expect(res._getData()).toEqual('')
  })

  it('should return with status 200 and without data if TransactionStatus is different of Success', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: {
        type: TransactionType.Withdraw,
        status: TransactionStatus.Failed,
      },
    })

    await notifyEM(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.OK)
    expect(res._getData()).toEqual('')
  })

  it('should return with status 200 and without data if transactionId is not found', async () => {
    const TRANSACTION_WITHDRAW_ID = '123456789'

    const firebaseServiceFindWithdrawByTransactionIdMock = jest
      .spyOn(FirebaseService.prototype, 'findWithdrawByTransactionId')
      .mockResolvedValue(null)

    const { req, res } = createMocks({
      method: 'POST',
      query: {
        type: TransactionType.Withdraw,
        status: TransactionStatus.Success,
        transactionid: TRANSACTION_WITHDRAW_ID,
      },
    })

    await notifyEM(req, res)

    expect(firebaseServiceFindWithdrawByTransactionIdMock).toHaveBeenCalledWith(
      TRANSACTION_WITHDRAW_ID,
    )
    expect(res._getStatusCode()).toBe(HttpStatus.OK)
    expect(res._getJSONData()).toEqual({
      message: 'Transaction not found',
    })
  })

  it('should fail with status 400 if gatewayService.withdraw returns error', async () => {
    const TRANSACTION_WITHDRAW_ID = WITHDRAW_DATA.partner_order_number
    const MESSAGE = 'Error message'

    const gatewayServiceWithdrawMock = jest
      .spyOn(GatewayService.prototype, 'withdraw')
      .mockResolvedValue({
        statusCode: HttpStatus.BAD_REQUEST,
        error: true,
        message: MESSAGE,
      })

    const { req, res } = createMocks({
      method: 'POST',
      query: {
        type: TransactionType.Withdraw,
        status: TransactionStatus.Success,
        transactionid: TRANSACTION_WITHDRAW_ID,
      },
    })

    await notifyEM(req, res)

    expect(GamMatrixMock).toBeCalled()

    expect(gatewayServiceWithdrawMock).toHaveBeenCalledWith({
      type: 'CASHIP',
      params: {
        ...WITHDRAW_DATA,
        partner_withdraw_pixkey: undefined,
      },
    })
    expect(res._getStatusCode()).toBe(HttpStatus.BAD_REQUEST)
    expect(res._getJSONData()).toEqual({
      error: true,
      message: MESSAGE,
    })
  })

  it('should return with status 200 and update OrderStatus in database', async () => {
    const TRANSACTION_WITHDRAW_ID = WITHDRAW_DATA.partner_order_number

    const RESPONSE_DATA = {
      ...WITHDRAW_DATA,
      error: false,
      error_code: '',
      error_msg: '',
      order_status_id: OrderStatus.APPROVED,
      order_created_at: '2021-01-01 00:00:00',
      order_updated_at: '2021-01-01 00:00:00',
      order_valid_at: '2021-01-01 00:00:00',
      pix_message: '',
    } as WithdrawResponse

    jest.spyOn(GatewayService.prototype, 'withdraw').mockResolvedValue({
      statusCode: HttpStatus.OK,
      error: false,
      message: '',
      data: RESPONSE_DATA,
    })

    const { req, res } = createMocks({
      method: 'POST',
      query: {
        type: TransactionType.Withdraw,
        status: TransactionStatus.Success,
        transactionid: TRANSACTION_WITHDRAW_ID,
      },
    })

    await notifyEM(req, res)

    expect(updateDocMock).toHaveBeenCalledWith(undefined, {
      orderStatus: RESPONSE_DATA.order_status_id,
    })
    expect(res._getStatusCode()).toBe(HttpStatus.OK)
    expect(res._getJSONData()).toEqual({
      error: false,
      data: {
        ...RESPONSE_DATA,
      },
      message: '',
    })
  })
})
