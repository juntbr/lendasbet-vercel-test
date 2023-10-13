export function zendeskAction(...args: any) {
  window?.zE?.apply?.(null, args)
}

export function openChat() {
  zendeskAction('messenger', 'open')
}

export function closeChat() {
  zendeskAction('messenger', 'close')
}
