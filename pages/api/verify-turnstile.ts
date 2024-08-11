import type { NextApiRequest, NextApiResponse } from "next"
import { verifyTurnstileToken } from "@/lib/turnstile"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { token } = req.body

  const isValid = await verifyTurnstileToken(token)

  if (isValid) {
    res.status(200).json({ success: true })
  } else {
    res.status(400).json({ success: false })
  }
}
