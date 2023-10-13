import { GamMatrix } from 'services/GamMatrix'
import { IsActiveUserSession } from 'services/GamMatrix/isActiveUserSession'
import dayjs from '../../../../utils/dayjs'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body

    const {
      sessionId,
      pageSize = 10,
      pageIndex = 0,
      transactionType = 'ALL',
      count = false
    } = body

    const { isActive, userId } = await IsActiveUserSession(sessionId)

    if (!isActive) {
      res.status(500).json({ message: 'Invalid session' })
      return false
    }

    const date = dayjs()
    const fromDate = date.subtract(6, 'month').format('YYYY-MM-DD HH:mm:ss')
    const toDate = date.format('YYYY-MM-DD HH:mm:ss')

    const transactionHistory = await GamMatrix('transactionHistory', {
      completedFrom: fromDate,
      completedTo: toDate,
      pageIndex: 0,
      userId,
      pageSize: 100,
    })

    const { error, status, data } = transactionHistory

    const filteredData =
      transactionType === 'ALL'
        ? data.transList
        : data.transList.filter((item) => item.transType === transactionType)

    const dataPerPage = filteredData.slice(10 * pageIndex, 10 * pageIndex + 10)

    if (error) {
      res.status(status).json({ error, status, data })
      return
    }

    const total = filteredData.length

    if(count) {
      res.status(200).json({
        count: total
      });
      return;
    }

    const currentOffset = total - pageSize * (pageIndex + 1)

    const perPage = pageSize
    const offset = currentOffset > 0 ? currentOffset : 0
    const totalPages = Math.ceil(total / perPage)

    res.status(status).json({
      error,
      data: dataPerPage,
      meta: {
        total,
        offset,
        page: pageIndex,
        perPage,
        totalPages,
      },
    })
  }
  res.end()
}
