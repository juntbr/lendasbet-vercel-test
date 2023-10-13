export default function LoadingEllipses() {
  return (
    <div className="flex w-full justify-center px-5 py-2">
      <div className="loader-dots relative mt-2 block h-5 w-20">
        <div className="absolute top-0 mt-1 h-3 w-3 rounded-full bg-primary"></div>
        <div className="absolute top-0 mt-1 h-3 w-3 rounded-full bg-primary"></div>
        <div className="absolute top-0 mt-1 h-3 w-3 rounded-full bg-primary"></div>
        <div className="absolute top-0 mt-1 h-3 w-3 rounded-full bg-primary"></div>
      </div>
    </div>
  )
}
