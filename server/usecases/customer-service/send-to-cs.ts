import axios from "axios";

export async function sendToCustomerService(createCustomerService) {
  try {
    const res = await axios.post(
      process.env.CUSTOMER_SERVICE_TOOL_API_URL,
      createCustomerService,
    );
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
