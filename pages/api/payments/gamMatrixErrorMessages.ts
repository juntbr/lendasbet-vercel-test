const CODE_TO_MESSAGES = new Map([
  ['10014', 'Você não tem fundos suficientes.'],
  ['1000', 'Você não tem fundos suficientes.'],
])

export function gamMatrixErrorMessages(errorCode: string) {
  if (CODE_TO_MESSAGES.has(errorCode)) {
    return CODE_TO_MESSAGES.get(errorCode)
  }

  return 'Falha ao realizar operação.'
}
