import { useCasino } from '@/hooks/useCasino'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import LoadingSkeletonCasino from '../../Loadings/LoadingSkeletonCasino'
import VendorGridItem from './VendorsGridItem'
import { useSubVendors } from '@/components/Sidebar/Core/Casino/useSubVendors'
import { useVendors } from '@/components/Sidebar/Core/Casino/useVendors'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export default function VendorsGridShowAll({ isLoading = false }) {
  const { t } = useTranslation(['common'])
  const { subvendors } = useSubVendors(373)
  const { vendors } = useVendors(373)

  const vendorsAndSubvendors = [...vendors, ...subvendors]

  const { changeGameCurrentCategory } = useCasino()

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-row-reverse items-center justify-between w-full space-x-0 text-white">
        <Button
          size="small"
          variant="outline"
          onClick={() => changeGameCurrentCategory('Ver tudo')}
          startIcon={<ArrowLeftIcon className="w-4 h-4 mb-1 text-primary" />}
        >
          Voltar
        </Button>
        <h2 className="font-bold text-white text-start lg:text-lg">
          {t('Vendors')}
        </h2>
      </div>
      <div className="grid grid-cols-2 col-span-4 gap-4 lg:grid-cols-5">
        {isLoading ? (
          <LoadingSkeletonCasino />
        ) : (
          vendorsAndSubvendors?.map?.((vendor, i) => (
            <VendorGridItem key={i} vendor={vendor} />
          ))
        )}
      </div>
    </div>
  )
}
