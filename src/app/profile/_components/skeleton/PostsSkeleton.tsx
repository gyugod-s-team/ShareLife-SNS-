import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const PostsSkeleton = () => (
  <div className="grid grid-cols-3 gap-1 md:gap-6">
    {[...Array(9)].map((_, index) => (
      <Skeleton key={index} height={200} />
    ))}
  </div>
)

export default PostsSkeleton
