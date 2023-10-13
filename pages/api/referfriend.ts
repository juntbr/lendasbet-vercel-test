import { NextApiRequest, NextApiResponse } from 'next'

import referFriendApi, { ICreateReferFriend } from 'services/referFriendApi'
import { validate } from './middleware/validate'

import { referFriendSchema } from 'schemas/api/referfriend'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const createReferfriendData = req.body as Omit<ICreateReferFriend, 'token'>

    const response = await referFriendApi.create({
      ...createReferfriendData,
      token: process.env.RAF_API_TOKEN,
    })

    res.status(response.statusCode).json(response)
  }

  return res.status(400).end()
}

export default validate(referFriendSchema, handler)
