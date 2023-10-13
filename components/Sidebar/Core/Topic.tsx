import SubTopic from './SubTopic'
import { MenuItem, SubItem } from './types'

type Props = {
  item: MenuItem
}

export default function Topic({ item }: Props) {
  let shouldHide = false

  if (item.sub) {
    const subLength = item.sub?.length
    const hiddenSubLength = item.sub?.filter((subItem) => subItem.hide).length
    shouldHide = subLength - hiddenSubLength === 0
  }

  if (shouldHide) return null

  return (
    <>
      {item.sub &&
        item.sub.map((subItem: SubItem) => (
          <SubTopic item={subItem} key={subItem.name} />
        ))}
    </>
  )
}
