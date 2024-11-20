import { registerMetadata } from "@/lib/metadata/metadata"
import RegisterPage from "./_components/RegisterPage"

export const metadata = registerMetadata

const page = () => {
  return <RegisterPage />
}

export default page
