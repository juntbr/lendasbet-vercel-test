import { createPortal } from 'react-dom'

export default function Notifications() {
  return createPortal(
    <div id="fasttrack-crm"></div>,
    document.body,
    'fasttrack-main',
  )
}
