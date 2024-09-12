// "use client"
// import { useToast } from "@/components/ui/use-toast"
// import useAuth from "@/hooks/useAuth"
// import useFollow from "@/hooks/useFollow"
// import usePosts from "@/hooks/usePosts"
// import Image from "next/image"
// import { useRouter } from "next/navigation"
// import React, { useCallback, useEffect, useRef, useState } from "react"

// const ProfilePage = ({ params }: { params: { id: string } }) => {
//   const { id } = params
//   const { currentUserId, nickname, profileImage } = useAuth()
//   const { posts, loadMorePosts, hasNextPage, isFetchingNextPage } = usePosts()
//   const {
//     isFollowingUser,
//     toggleFollow,
//     followCounts,
//     fetchFollowers,
//     fetchFollowing,
//   } = useFollow()
//   const { toast } = useToast()
//   const router = useRouter()

//   const [isFollowersModalOpen, setFollowersModalOpen] = useState(false)
//   const [isFollowingModalOpen, setFollowingModalOpen] = useState(false)
//   const [followers, setFollowers] = useState<string[]>([])
//   const [following, setFollowing] = useState<string[]>([])

//   const userPosts = posts.filter((post) => post.user_id === id)

//   const observer = useRef<IntersectionObserver | null>(null)
//   const lastPostElementRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (isFetchingNextPage) return
//       if (observer.current) observer.current.disconnect()
//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasNextPage) {
//           loadMorePosts()
//         }
//       })
//       if (node) observer.current.observe(node)
//     },
//     [isFetchingNextPage, hasNextPage, loadMorePosts],
//   )

//   useEffect(() => {
//     if (id !== currentUserId) {
//       setFollowersModalOpen(false)
//       setFollowingModalOpen(false)
//     }
//   }, [id, currentUserId])

//   const handleToggleFollow = async () => {
//     // 팔로우/언팔로우 API 호출
//     await toggleFollow(id)

//     // UI 업데이트
//     toast({
//       title: isFollowingUser(id) ? "팔로우 취소" : "팔로우",
//       description: isFollowingUser(id)
//         ? "이제 언팔로우 되었습니다."
//         : "팔로우 되었습니다.",
//     })
//   }

//   const handleShowFollowers = async () => {
//     const fetchedFollowers = await fetchFollowers(id)
//     setFollowers(fetchedFollowers || [])
//     setFollowersModalOpen(true)
//   }

//   const handleShowFollowing = async () => {
//     const fetchedFollowing = await fetchFollowing(id)
//     setFollowing(fetchedFollowing || [])
//     setFollowingModalOpen(true)
//   }

//   return (
//     <>
//       <div className="flex items-center mb-2">
//         <Image
//           src={profileImage}
//           alt={`${nickname}'s profile`}
//           className="w-10 h-10 rounded-full mr-2"
//           width={100}
//           height={100}
//         />
//         <span className="font-bold text-lg">{nickname}</span>
//         {id !== currentUserId && (
//           <button
//             onClick={handleToggleFollow}
//             className={`ml-4 px-4 py-2 text-white ${
//               isFollowingUser(id) ? "bg-red-500" : "bg-blue-500"
//             } rounded transition-colors duration-300`}
//           >
//             {isFollowingUser(id) ? "언팔로우" : "팔로우"}
//           </button>
//         )}
//       </div>
//       <div className="mb-4">
//         <span
//           className="cursor-pointer"
//           onClick={handleShowFollowers}
//         >{`팔로워 ${followCounts.followerCount}`}</span>
//         <span
//           className="cursor-pointer ml-4"
//           onClick={handleShowFollowing}
//         >{`팔로잉 ${followCounts.followingCount}`}</span>
//       </div>
//       {userPosts.map((post, index) => (
//         <div
//           key={post.id}
//           className="border p-4 mb-4"
//           ref={index === userPosts.length - 1 ? lastPostElementRef : null}
//         >
//           <h3 className="font-bold">{post.title}</h3>
//           <p>{post.content}</p>
//           {post.image_url && (
//             <img src={post.image_url} alt="Post Image" className="mt-2" />
//           )}
//         </div>
//       ))}
//       {isFetchingNextPage && <div>Loading more posts...</div>}

//       {/* // Followers Modal
// <Dialog open={isFollowersModalOpen} onOpenChange={setFollowersModalOpen}>
//   <DialogContent>
//     <DialogHeader>
//       <h2 className="font-bold text-lg mb-4">팔로워 목록</h2>
//     </DialogHeader>
//     {followers.length > 0 ? (
//       followers.map((follower) => (
//         console.log(followers);
//         <div key={follower.id} className="mb-2">
//           <span>{follower.nickname}</span>
//           {follower.profile_image && (
//             <img src={follower.profile_image} alt={`${follower.nickname}'s profile`} className="w-8 h-8 rounded-full ml-2" />
//           )}
//         </div>
//       ))
//     ) : (
//       <p>팔로워가 없습니다.</p>
//     )}
//   </DialogContent>
// </Dialog>

// // Following Modal
// <Dialog open={isFollowingModalOpen} onOpenChange={setFollowingModalOpen}>
//   <DialogContent>
//     <DialogHeader>
//       <h2 className="font-bold text-lg mb-4">팔로잉 목록</h2>
//     </DialogHeader>
//     {following.length > 0 ? (
//       following.map((followedUser) => (
//         <div key={followedUser.id} className="mb-2">
//           <span>{followedUser.nickname}</span>
//           {followedUser.profile_image && (
//             <img src={followedUser.profile_image} alt={`${followedUser.nickname}'s profile`} className="w-8 h-8 rounded-full ml-2" />
//           )}
//         </div>
//       ))
//     ) : (
//       <p>팔로잉한 사용자가 없습니다.</p>
//     )}
//   </DialogContent>
// </Dialog> */}
//     </>
//   )
// }

// export default ProfilePage
