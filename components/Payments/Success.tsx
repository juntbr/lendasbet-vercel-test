export default function Success({ message }) {
  return (
    <div className="flex h-full items-center">
      <div className="flex w-full flex-col items-center space-y-4">
        <img
          src="/images/approve.svg"
          className="h-12 w-12"
          alt="Approve icon"
        />
        <span className="text-center font-semibold text-white">
          {typeof message === 'string' ? message : 'Sucesso!'}
        </span>
      </div>
    </div>
  )
}
