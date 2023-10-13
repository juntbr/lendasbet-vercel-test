import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
export default function SelectGateway({ options }) {
  const { t } = useTranslation()
  const { control } = useFormContext()

  const imageToWhite = (opt) => {
    return opt.value === 'CASHIP' || opt.value === 'PAAG'
      ? {
          filter:
            'brightness(0) saturate(100%) invert(100%) sepia(96%) saturate(14%) hue-rotate(236deg) brightness(103%) contrast(103%)',
        }
      : null
  }

  return (
    <div className="flex flex-col col-span-full text-start">
      <h3 className="text-xs font-medium text-center cursor-pointer text-textPrimary sm:text-base">
        {t('Select a platform')}
      </h3>
      <ul className="flex items-center justify-center w-full mt-3 space-x-3">
        {options.map((opt) => {
          return (
            <li key={opt.id} className="relative w-full">
              <Controller
                name="gatewayType"
                control={control}
                render={({ field }) => {
                  return (
                    <input
                      {...field}
                      id={opt.value}
                      type="radio"
                      value={opt.value}
                      checked={field.value === opt.value}
                      className="peer absolute inset-0 hidden rounded-[inherit]"
                    />
                  )
                }}
              />
              <label
                htmlFor={opt.value}
                className="flex flex-col items-center justify-center w-full h-12 p-2 space-y-1 border cursor-pointer rounded-lb border-borderColor bg-secondary peer-checked:border-primary peer-checked:bg-primaryHover peer-checked:text-primary lg:h-16"
              >
                <img
                  style={imageToWhite(opt)}
                  src={opt.logo}
                  alt={`Logo da ${opt.value}`}
                  width={100}
                  height={100}
                />
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
