/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiResponse } from 'next'
import { ServerError, UnauthorizedError } from './errors'

type HttpResponse = {
  statusCode: number
  body: any
}

const sendResponse = (
  res: NextApiResponse,
  httpResponse: HttpResponse,
): void => {
  res.status(httpResponse.statusCode).json(httpResponse.body)
}

export const sendBadRequest = (res: NextApiResponse, error: Error): void => {
  sendResponse(res, {
    statusCode: 400,
    body: error,
  })
}

export const sendForbidden = (res: NextApiResponse, error: Error): void => {
  sendResponse(res, {
    statusCode: 403,
    body: error,
  })
}

export const sendNotFound = (res: NextApiResponse, error: Error): void => {
  sendResponse(res, {
    statusCode: 404,
    body: error,
  })
}

export const sendUnauthorized = (res: NextApiResponse): void => {
  sendResponse(res, {
    statusCode: 401,
    body: new UnauthorizedError(),
  })
}

export const sendServerError = (res: NextApiResponse, error: Error): void => {
  sendResponse(res, {
    statusCode: 500,
    body: new ServerError(error.stack),
  })
}

export const sendOk = (res: NextApiResponse, data: any): void => {
  sendResponse(res, {
    statusCode: 200,
    body: data,
  })
}

export const sendNoContent = (res: NextApiResponse): void => {
  sendResponse(res, {
    statusCode: 204,
    body: null,
  })
}
