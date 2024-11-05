import { loginMetadata } from "@/lib/metadata"
import LoginPage from "./_components/LoginPage"

export const metadata = loginMetadata

const page = () => {
  return <LoginPage />
}

export default page
