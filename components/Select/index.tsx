import { ReactNode } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'

export interface SelectProps extends SelectPrimitive.SelectProps {
  children: ReactNode
  onValueChange: (value: any) => void
}

export function Select({
  children,
  onValueChange,
  value,
  ...props
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      {...props}
      value={value}
      onValueChange={(value) => onValueChange(value)}
    >
      <SelectPrimitive.Trigger className="flex items-center justify-between shadow-sm outline-none ">
        <SelectPrimitive.Value />
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          side="bottom"
          position="popper"
          sideOffset={23}
          className="z-50 h-auto w-10 overflow-hidden rounded-lb border border-primary bg-secondary shadow-sm lg:mr-2"
        >
          <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
