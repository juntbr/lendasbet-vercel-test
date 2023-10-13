import { InputProps } from './types'
import { useState, ForwardRefRenderFunction, forwardRef } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid'
import clsxm from '@/utils/clsxm'

export const InputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  InputProps
> = (
  {
    id,
    errorMessage,
    labelMessage,
    isFullWidth = false,
    className,
    type,
    displayPassword = false,
    ...rest
  },
  ref,
) => {
  const [showPassword, setShowPassword] = useState(false)
  const isCheckbox = type === 'checkbox'

  const classNameSchema = isCheckbox
    ? 'w-4.5 h-4.5 mr-1 mb-0.5 transition duration-200 bg-secondary hover:!bg-primaryHover border-2 border-borderColor rounded-lb cursor-pointer focus:!bg-primaryHover checked:bg-primaryHover focus:outline-none focus:!ring-0 focus:!ring-offset-0'
    : 'px-4 py-3 border rounded-lb shadow-sm focus:ring-0 text-white bg-secondary placeholder-textPrimary border-borderColor focus:outline-none focus:ring-primary focus:border-textPrimary text-xs lg:text-sm data-[isFullWidth=true]:w-full mt-0.5'

  const handleSwitchShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div
      data-isCheckbox={isCheckbox}
      className="relative data-[isCheckbox=false]:w-full"
    >
      <div
        className="relative data-[isCheckbox=true]:flex data-[isCheckbox=true]:flex-row-reverse data-[isCheckbox=true]:items-center data-[isCheckbox=true]:justify-end"
        data-isCheckbox={isCheckbox}
      >
        {labelMessage && (
          <label
            className="text-xs font-medium text-white cursor-pointer lg:text-sm"
            htmlFor={id}
          >
            {labelMessage}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          data-isFullWidth={isFullWidth}
          type={showPassword ? 'text' : type}
          className={clsxm(classNameSchema, className)}
          {...rest}
        />
        {type === 'password' && displayPassword ? (
          <button
            onClick={handleSwitchShowPassword}
            type="button"
            title={showPassword ? 'Esconder senha' : 'Ver senha'}
            aria-label={showPassword ? 'esconder senha' : 'ver senha'}
            className="absolute right-0 flex items-center justify-center p-2 pr-3 bottom-1 lg:bottom-2"
          >
            {showPassword ? (
              <EyeIcon className="w-4 h-4 transition-all duration-200 ease-in-out text-primary hover:text-primary" />
            ) : (
              <EyeSlashIcon className="w-4 h-4 transition-all duration-200 ease-in-out text-primary hover:text-primary" />
            )}
          </button>
        ) : null}
      </div>
      {errorMessage ? (
        <span className="text-xs text-red-500 lg:text-sm">
          {String(errorMessage?.message)}
        </span>
      ) : null}
    </div>
  )
}

export const Input = forwardRef(InputBase)
