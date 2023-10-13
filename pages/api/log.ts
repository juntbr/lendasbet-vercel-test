import logger from "../../utils/logger";

export default function handler(req, res) {
  logger.info("Hello World!");
  logger.error(
    `CASHIP - DEPOSIT REJECTED 20: ` +
      JSON.stringify({ msg: 'test'}),
  )
  return res.status(200).json({ message: "Ok" });
}
