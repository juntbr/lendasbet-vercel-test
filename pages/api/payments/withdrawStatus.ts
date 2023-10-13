import { NextApiRequest, NextApiResponse } from 'next'
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore'
import dayjs from 'utils/dayjs'

import { IsActiveUserSession } from 'services/GamMatrix/isActiveUserSession'
import { firestore } from 'utils/clientApp'
import { CashipTransactionStatus } from 'types/caship'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const sessionId = req.cookies['lendasbet%3AsessionId']

      const { isActive, userId } = await IsActiveUserSession(sessionId)

      if (isActive) {
        const withDrawCollection = collection(firestore, 'withdraws')

        const withdrawsQuery = query(
          withDrawCollection,
          where('partner_user_uid', '==', userId),
          orderBy('created_at', 'desc'),
          limit(1),
        )

        const querySnapshot = await getDocs(withdrawsQuery)

        const result: QueryDocumentSnapshot<DocumentData>[] = []

        querySnapshot.forEach((snapshot) => {
          result.push(snapshot)
        })

        if (result.length <= 0) {
          return res.status(200).json({
            status: null,
            message: 'Usuário não possui transações em andamento.',
          })
        }

        const withdraw = result[0].data()

        if (withdraw.orderStatus === CashipTransactionStatus.pending) {
          const currentTime = dayjs()
          const duration = currentTime.diff(
            dayjs(withdraw.created_at),
            'minutes',
          )

          if (duration < 10) {
            return res.status(401).json({
              status: CashipTransactionStatus.pending,
              message: `Aguarde ${
                10 - duration
              } minutos para realizar uma nova solicitação de saque.`,
            })
          }

          return res.status(200).json({
            status: CashipTransactionStatus.pending,
            message: 'Usuário pode sacar.',
          })
        }
      }

      return res
        .status(200)
        .json({ status: null, message: 'Pode realizar o saque.' })
    } catch (error) {
      return res
        .status(200)
        .json(
          error.response?.data ?? { status: null, message: 'GENERIC-ERROR' },
        )
    }
  } else {
    return res.status(404).end()
  }
}
