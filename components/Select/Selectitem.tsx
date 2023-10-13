import { ReactNode } from 'react'
import * as Select from '@radix-ui/react-select'

export type SelectItemProps = Select.SelectItemProps & {
  children: ReactNode
}

export function SelectItem({ children, ...props }: SelectItemProps) {
  return (
    <Select.Item
      className="flex cursor-pointer items-center justify-center bg-secondary p-2 text-xs outline-none data-[highlighted]:bg-[#2F3636] data-[highlighted]:text-black"
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
}
