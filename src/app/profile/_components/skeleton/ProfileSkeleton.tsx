import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const ProfileSkeleton = () => (
  <div className="flex items-center mb-10">
    <Skeleton circle height={144} width={144} className="mr-10" />
    <div>
      <div className="flex items-center mb-4">
        <Skeleton width={150} height={30} className="mr-4" />
        <Skeleton width={100} height={40} />
      </div>
      <div className="flex space-x-8 mb-4">
        <Skeleton width={80} height={20} />
        <Skeleton width={80} height={20} />
        <Skeleton width={80} height={20} />
      </div>
    </div>
  </div>
)

export default ProfileSkeleton
