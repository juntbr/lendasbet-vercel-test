import { Button } from 'design-system/button'

export default function AddNumberSelector({ items, setValue, value, name }) {
  function addValue(e, number) {
    e.preventDefault()
    const amount = isNaN(value) ? '0' : value
    if (Number(amount) === 0) {
      setValue(name, number)
    } else {
      setValue(name, String(Number(amount) + Number(number)))
    }
  }

  return (
    <div className="flex items-center justify-around space-x-2 lg:space-x-4">
      {items.map((number, i) => {
        return (
          <Button
            variant="primary"
            title={`R$${number}`}
            key={i}
            onClick={(e) => addValue(e, number)}
            className="w-full"
          >{`R$ ${number}`}</Button>
        )
      })}
    </div>
  )
}
