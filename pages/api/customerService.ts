import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { validate } from "./middleware/validate";
import { customerServiceSchema } from "./../../schemas/api/customerservice";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const createCustomerService = req.body;

    try {
      const response = await axios.post(
        process.env.CUSTOMER_SERVICE_TOOL_API_URL,
        createCustomerService,
      );

      if (response.status === 201)
        return res.status(201).json({ error: false, message: "Ok" });
    } catch (error) {
      return res.status(500).json({ error, message: "Error" });
    }
  }

  return res.status(404).end();
}

export default validate(customerServiceSchema, handler);
