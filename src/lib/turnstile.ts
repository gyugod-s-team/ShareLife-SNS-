export async function verifyTurnstileToken(token: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  const response = await fetch(
    `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    },
  )

  const data = await response.json()

  return data.success
}
