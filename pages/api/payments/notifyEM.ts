// reference https://everymatrix.atlassian.net/wiki/spaces/GMD/pages/1210319021/Push+Notifications+Transactions
import * as Sentry from '@sentry/node'
import { NextApiResponse } from 'next'

import { doc, updateDoc } from 'firebase/firestore'

import { FirebaseService } from 'services/FirebaseService'
import { GamMatrix } from 'services/GamMatrix'
import { GatewayService } from 'services/GatewayService'
import GetUserIp from 'services/GetUserIp'
import { firestore } from 'utils/clientApp'

import { CashipService } from 'services/Caship'
import { PaagService } from 'services/Paag'
import { Pay4FunService } from 'services/Pay4Fun'
import { GatewayType, PixType } from 'types/GatewayService'
import { WithdrawResponse } from 'types/caship'
import { TransactionStatus, TransactionType } from 'types/gamMatrix'
import logger from 'utils/logger'

function transformKeyByType(key: string, type: string): string {
  switch (type) {
    case 'CPF': // 11 numeros
      return key.replace(/\D/g, '')
    case 'Telefone': // check for pay4fun
      return key.replace(/[\D-]/g, '')
    case 'phone': // regra do bacen
      if (key.includes('+55')) {
        return key.replace(/\D/g, '')
      } else {
        return '+55' + key.replace(/\D/g, '')
      }
    default:
      return key
  }
}

const cashipService = new CashipService({
  url: process.env.CASHIP_API_URL,
  token: process.env.CASHIP_BASIC_AUTH,
})

const pay4funService = new Pay4FunService({
  url: process.env.PAY4FUN_API_URL,
  merchantId: process.env.PAY4FUN_MERCHANT_ID,
  merchantKey: process.env.PAY4FUN_MERCHANT_KEY,
  merchantSecret: process.env.PAY4FUN_MERCHANT_SECRET,
  okUrl: process.env.PAY4FUN_OK_URL,
  notOkUrl: process.env.PAY4FUN_NOT_OK_URL,
  confirmationUrl: process.env.PAY4FUN_CONFIRMATION_URL,
  merchantLogo: process.env.PAY4FUN_MERCHANT_LOGO,
  layoutColor: process.env.PAY4FUN_LAYOUT_COLOR,
})

const firebaseService = new FirebaseService()
const cashipGatewayService = new GatewayService({
  currentGateway: cashipService,
})
const pay4funGatewayService = new GatewayService({
  currentGateway: pay4funService,
})

const paagService = new PaagService()

const paagGatewayService = new GatewayService({
  currentGateway: paagService,
})

function transformP4fToCashipPixType(type: PixType): string {
  if (type === 'Telefone') {
    return 'phone'
  }
  return type
}

function transformP4fToPaagPixType(type: PixType): string {
  if (type === 'Telefone') {
    return 'phone'
  }
  if (type === 'CPF') {
    return 'document'
  }
  if (type === 'Email') {
    return 'email'
  }
  /* @ts-ignore */
  if (type === 'Chave Aleatória') {
    return 'random'
  }

  return type
}

async function randomPixKeyCaship({
  withdraw,
  gatewayType,
  transactionId,
  req,
  res,
}) {
  const newPartnerOrderNumber = withdraw.partner_order_number.replace(
    GatewayType.PAY4FUN,
    GatewayType.CASHIP,
  )

  const withdrawRef = doc(firestore, `withdraws/${transactionId}`)

  const responseCashipWithdraw = await cashipGatewayService.withdraw({
    type: GatewayType.CASHIP,
    params: {
      ...withdraw,
      partner_order_number: newPartnerOrderNumber,
      partner_order_method: 5,
      partner_order_group: 1,
      partner_withdraw_pwd: process.env.CASHIP_PASSWORD_WITHDRAWAL,
      realtime: true,
      partner_withdraw_pixtype: transformP4fToCashipPixType(
        withdraw.partner_withdraw_pixtype,
      ),
      partner_withdraw_pixkey: transformKeyByType(
        withdraw.partner_withdraw_pixkey,
        transformP4fToCashipPixType(withdraw.partner_withdraw_pixtype),
      ),
    },
  })

  if (responseCashipWithdraw.error) {
    await createRollbackDeposit({
      withdrawRef,
      withdraw,
      responseWithdraw: responseCashipWithdraw,
      gatewayType,
      transactionId,
      req,
    })

    const { error, data, message, statusCode } = responseCashipWithdraw

    return res.status(Number(statusCode)).json({ error, data, message })
    // TODO adicionar ROLLBACKs no banco de dados
  }

  return successResponse({
    responseWithdraw: responseCashipWithdraw,
    withdrawRef,
    gatewayType,
    transactionId,
    res,
  })
}

async function createRollbackDeposit({
  withdrawRef,
  withdraw,
  responseWithdraw,
  gatewayType,
  transactionId,
  req,
}) {
  const { error, data, message, statusCode } = responseWithdraw

  const errorMessage = JSON.stringify({
    error,
    data,
    message,
    status: statusCode,
    orderStatus: data?.order_status_id,
  })

  Sentry.captureMessage(
    'Withdraw rejected for gateway, trying to create a rollback (deposit)' +
      errorMessage,
  )

  logger.error(
    `${gatewayType} - WITHDRAW REJECTED ${transactionId}: trying to create a rollback (deposit) ` +
      errorMessage,
  )

  if (data?.order_status_id) {
    await updateDoc(withdrawRef, {
      orderStatus: data?.order_status_id,
    })
  }

  const userIp = (await GetUserIp(req)).ip

  const deposit = {
    version: '1.0',
    partnerID: process.env.GAMMATRIX_API_SITE_ID,
    partnerKey: process.env.GAMMATRIX_API_SITE_CODE,
    userId: withdraw.partner_user_uid,
    requestAmount: withdraw.partner_order_amount,
    requestCurrency: 'BRL',
    transactionReference: withdraw.partner_order_number + '-ROLLBACK',
    userIp,
    note: `ROLLBACK ${withdraw.partner_order_number}, making a deposit to user #${withdraw.partner_user_uid}, gateway returned: ${message}`,
  }

  const gamMatrixResponse = await GamMatrix('deposit', deposit)
  if (gamMatrixResponse.error) {
    Sentry.captureMessage(
      'GamMatrix error after ROLLBACK: - ' +
        JSON.stringify({
          depositData: deposit,
          errorData: gamMatrixResponse.data,
        }),
    )
  }
}

async function successResponse({
  responseWithdraw,
  withdrawRef,
  gatewayType,
  transactionId,
  res,
}) {
  const responseData = responseWithdraw.data as WithdrawResponse

  logger.info(
    `${gatewayType} - SUCCESS WITHDRAW ${transactionId}: ` +
      JSON.stringify(responseWithdraw.data),
  )

  if (responseData?.order_status_id) {
    await updateDoc(withdrawRef, {
      orderStatus: responseData.order_status_id,
    })
  }

  return res
    .status(200)
    .json({ error: false, data: responseWithdraw.data, message: '' })
}

export default async function notifyEmHandler(req, res: NextApiResponse) {
  const type = req.query?.type as TransactionType
  const status = req.query?.status as TransactionStatus
  const transactionId = req.query?.transactionid

  if (
    type === TransactionType.Withdraw &&
    status === TransactionStatus.Success
  ) {
    const withdraw =
      await firebaseService.findWithdrawByTransactionId(transactionId)

    if (withdraw === null) {
      return res.status(200).json({ message: 'Transaction not found' })
    }

    const gatewayType = (
      withdraw.partner_order_number?.includes(GatewayType.PAY4FUN)
        ? GatewayType.PAY4FUN
        : GatewayType.CASHIP
    ) as GatewayType

    if (withdraw.partner_withdraw_pixtype === 'EVP') {
      return await randomPixKeyCaship({
        withdraw,
        gatewayType,
        req,
        res,
        transactionId,
      })
    }

    let responseWithdraw

    responseWithdraw = await pay4funGatewayService.withdraw({
      type: gatewayType,
      params: {
        ...withdraw,
        partner_withdraw_pixkey: transformKeyByType(
          withdraw.partner_withdraw_pixkey,
          withdraw.partner_withdraw_pixtype,
        ),
      },
    })

    const withdrawRef = doc(firestore, `withdraws/${transactionId}`)

    if (responseWithdraw.error) {
      // CASHIP
      const newPartnerOrderNumber = withdraw.partner_order_number.replace(
        GatewayType.PAY4FUN,
        GatewayType.CASHIP,
      )

      await updateDoc(withdrawRef, {
        partner_order_number: newPartnerOrderNumber,
      })

      const responseCashipWithdraw = await cashipGatewayService.withdraw({
        type: GatewayType.CASHIP,
        params: {
          ...withdraw,
          partner_order_number: newPartnerOrderNumber,
          partner_order_method: 5,
          partner_order_group: 1,
          partner_withdraw_pwd: process.env.CASHIP_PASSWORD_WITHDRAWAL,
          realtime: true,
          partner_withdraw_pixtype: transformP4fToCashipPixType(
            withdraw.partner_withdraw_pixtype,
          ),
          partner_withdraw_pixkey: transformKeyByType(
            withdraw.partner_withdraw_pixkey,
            transformP4fToCashipPixType(withdraw.partner_withdraw_pixtype),
          ),
        },
      })

      if (responseCashipWithdraw.error) {
        // PAAG
        const newPartnerOrderNumber = withdraw.partner_order_number.replace(
          GatewayType.CASHIP,
          GatewayType.PAAG,
        )

        await updateDoc(withdrawRef, {
          partner_order_number: newPartnerOrderNumber,
        })

        const responsePaagWithdraw = await paagGatewayService.withdraw({
          type: GatewayType.PAAG,
          params: {
            ...withdraw,
            processor_id: process.env.PAAG_PROCESSOR_ID,
            amount: withdraw.partner_order_amount,
            merchant_transaction_id: newPartnerOrderNumber,
            first_name: withdraw.partner_user_name,
            last_name: withdraw.partner_user_name,
            email: withdraw.partner_user_email,
            document_number: withdraw.partner_user_document,
            pix_key_type: transformP4fToPaagPixType(
              withdraw.partner_withdraw_pixtype,
            ),
            pix_key_value: transformKeyByType(
              withdraw.partner_withdraw_pixkey,
              transformP4fToPaagPixType(withdraw.partner_withdraw_pixtype),
            ),
          },
        })

        if (responsePaagWithdraw.error) {
          // TODO adicionar ROLLBACKs no banco de dados
          await createRollbackDeposit({
            withdrawRef,
            withdraw,
            responseWithdraw: responsePaagWithdraw,
            gatewayType,
            transactionId,
            req,
          })

          const { error, data, message, statusCode } = responsePaagWithdraw

          return res.status(Number(statusCode)).json({ error, data, message })
        }

        return successResponse({
          responseWithdraw: responsePaagWithdraw,
          withdrawRef,
          gatewayType,
          transactionId,
          res,
        })
      }

      return successResponse({
        responseWithdraw: responseCashipWithdraw,
        withdrawRef,
        gatewayType,
        transactionId,
        res,
      })
    }

    return successResponse({
      responseWithdraw,
      withdrawRef,
      gatewayType,
      transactionId,
      res,
    })
  }

  return res.status(200).end()
}
