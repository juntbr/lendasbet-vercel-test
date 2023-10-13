import { verifyHostName } from 'utils/verifyHostName'
import { readRelativeFile } from 'utils/readRelativeFile'
import { getPolicyFileName } from 'types/policies'

export default async function handler(req, res) {
  const { policy, locale } = req.query

  console.log(locale, 'locale')
  const language = locale ?? 'en'

  if (req.method === 'GET') {
    if (verifyHostName() === 'production') {
      const htmlData = await readRelativeFile(
        `/public/assets/policies/lendasbet.com/${getPolicyFileName(
          policy,
          language,
        )}.com.html`,
      )
      res.json({ htmlData })
    }
    if (verifyHostName() === 'staging') {
      const htmlData = await readRelativeFile(
        `/public/assets/policies/lendasbet.io/${getPolicyFileName(
          policy,
          language,
        )}.io.html`,
      )
      res.json({ htmlData })
    }
    if (verifyHostName() === 'local') {
      const htmlData = await readRelativeFile(
        `/public/assets/policies/lendasbet.io/${getPolicyFileName(
          policy,
          language,
        )}.io.html`,
      )
      res.json({ htmlData })
    }
  }
  res.end()
}
