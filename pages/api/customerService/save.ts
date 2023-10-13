import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "ioredis";
import { customerServiceSchema } from "schemas/api/customerservice";
import { validate } from "../middleware/validate";
import { sendOk, sendServerError } from "server/helpers/http-helper";

const redisClient = new Redis(
  process.env.CUSTOMER_SERVICE_UPSTASH_REDIS_API_URI,
);

const CACHE_TTL = 86400; // 1 dia

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId, customerService, linkSent, username } = req.body;

    const data = { customerService, linkSent, username };

    try {
      await redisClient.set(userId, JSON.stringify(data), "EX", CACHE_TTL);

      return sendOk(res, data);
    } catch (error) {
      return sendServerError(
        res,
        new Error("Could not save customer service data"),
      );
    }
  }

  return res.status(404).end();
}

export default validate(customerServiceSchema, handler);
