import { useCasino } from '@/hooks/useCasino'

export default function VendorGridItem({ vendor }) {
  const {
    setActiveCasinoVendorFilter,
    setActiveCasinoVendor,
    setActiveCasino,
  } = useCasino()

  function filterVendor() {
    setActiveCasinoVendorFilter(vendor.id)
    setActiveCasinoVendor(vendor.name)
    setActiveCasino('')
    window.scrollTo(0, 0)
  }

  const changeVendorName = (name: string) => {
    if (name.includes('_')) return name.replace('_', ' ')
    return name
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full p-6 overflow-hidden transition duration-300 ease-in-out cursor-pointer group rounded-lb bg-borderColor hover:bg-opacity-70 hover:text-background"
      title={changeVendorName(vendor.name)}
      onClick={filterVendor}
    >
      <span className="text-sm font-bold text-center text-white uppercase break-words w-36 lg:text-lg">
        {changeVendorName(vendor.name)}
      </span>
    </div>
  )
}
