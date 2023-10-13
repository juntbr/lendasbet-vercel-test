export default function EllipsisLoading() {
  return (
    <div className="loader-dots relative my-2 mr-20 flex h-4 items-center justify-center">
      <div className="absolute top-0 mt-1 h-3 w-3 rounded-full bg-white"></div>
      <div className="absolute top-0 mt-1 h-3 w-3 rounded-full bg-white"></div>
      <div className="absolute top-0 mt-1 h-3 w-3 rounded-full bg-white"></div>
      <div className="absolute top-0 mt-1 h-3 w-3 rounded-full bg-white"></div>
    </div>
  )
}
