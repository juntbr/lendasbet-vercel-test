import axios from 'axios'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const cpfCnpjReq = await axios.post(
      `https://api.cpfcnpj.com.br/${process.env.CPFCNPJAPI}/${process.env.CPFCNPJAPI_PACOTE}/${req.body.document}`,
    )
    res.json({ cpfCnpjReq: cpfCnpjReq.data })
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
  res.json('Testing.')
}
