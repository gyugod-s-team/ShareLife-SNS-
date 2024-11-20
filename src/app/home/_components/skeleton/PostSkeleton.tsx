import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const PostSkeleton = () => (
  <div className="bg-neutral-900 text-white border-2 border-neutral-900 rounded-lg mb-6 shadow-sm p-3">
    <div className="flex items-center mb-3">
      <Skeleton circle width={32} height={32} className="mr-3" />
      <Skeleton width={100} />
    </div>
    <Skeleton height={300} className="mb-3" />
    <Skeleton count={3} className="mb-2" />
  </div>
)

export default PostSkeleton
