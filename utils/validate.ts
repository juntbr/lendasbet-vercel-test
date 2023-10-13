export function formatPixKey(pixkey, pixtype = null) {
  if (!pixtype) {
    pixtype = true
  }

  /**
   * @description Padrão de chave pix P4F Telefone -> phone
   */
  if (pixtype === 'Telefone') {
    pixtype = 'phone'
  }

  // qrcode
  if (
    (pixkey?.length > 36 && pixtype === 'qrcode') ||
    (pixkey?.length > 36 && pixtype === true)
  ) {
    return [true, pixkey]
  }

  // email
  if (
    (pixkey?.includes('@') && pixtype === 'Email') ||
    (pixkey?.includes('@') && pixtype === true)
  ) {
    if (!isMail(pixkey)) {
      return [false, 'Invalid Email']
    }
    return [true, pixkey.toLowerCase()]
  }

  // phone
  if (
    (pixkey?.includes('+') && pixtype === 'phone') ||
    (pixkey?.includes('+') && pixtype === true)
  ) {
    pixkey = '+' + pixkey.replace(/[^\d]+/g, '')
    if (pixkey.length != 14) {
      return [false, 'Invalid Phone number']
    }
    if (pixkey?.substring(0, 3) != '+55') {
      return [false, 'Not brasilian number']
    }
    return [true, pixkey]
  }

  // key
  if (
    (pixkey?.length == 36 && pixtype === 'EVP') ||
    (pixkey?.length == 36 && pixtype === true)
  ) {
    return [true, pixkey]
  }

  // formated cnpj
  if (
    (pixkey?.length == 18 && pixtype === 'CNPJ') ||
    (pixkey?.length == 18 && pixtype === true)
  ) {
    if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(pixkey)) {
      return [false, 'invalid pixkey']
    }
    if (!isCnpj(pixkey)) {
      return [false, 'invalid cnpj']
    }
    pixkey = pixkey.replace(/[^\d]+/g, '')
    return [true, pixkey]
  }

  // fone with missing +
  if (
    (pixkey?.length == 13 && pixtype === 'phone') ||
    (pixkey?.length == 13 && pixtype === true)
  ) {
    if (/^\d+$/.test(pixkey)) {
      if (pixkey.substr(0, 2) != '55') {
        return [false, 'invalid pixkey']
      }
      return [true, '+' + pixkey]
    }
  }

  // every other option has at least 11 chars.
  if (pixkey?.length < 11) {
    return [false, 'invalid pixkey']
  }

  // cnpj or formated cpf
  if (
    (pixkey?.length == 14 && pixtype === 'CNPJ') ||
    (pixkey?.length == 14 && pixtype === 'CPF') ||
    (pixkey?.length == 14 && pixtype === true)
  ) {
    // unformated cnpj
    if (/^\d+$/.test(pixkey)) {
      if (!isCnpj(pixkey)) {
        return [false, 'invalid pixkey']
      }
      return [true, pixkey]
    }
    // formated cpf
    if (/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(pixkey)) {
      if (!isCpf(pixkey)) {
        return [false, 'invalid cpf']
      }
      return [true, pixkey.replace(/[^\d]+/g, '')]
    }
  }

  // informated cpf or phone without country
  if (
    (pixkey?.length == 11 && pixtype === 'CPF') ||
    (pixkey?.length == 11 && pixtype === 'phone') ||
    (pixkey?.length == 11 && pixtype === true)
  ) {
    if (!/^\d+$/.test(pixkey)) {
      return [false, 'invalid pixkey']
    }
    if (
      (isCpf(pixkey) && pixtype === 'CPF') ||
      (pixkey.length == 11 && pixtype === true)
    ) {
      return [true, pixkey.replace(/[^\d]+/g, '')]
    }
    if (pixkey.charAt(0) == '0') {
      return [false, 'invalid pixkey']
    }
    return [true, '+55' + pixkey]
  }

  // either wrong formated cpf or formated phone number
  pixkey = pixkey?.replace(/[^\d]+/g, '')
  if (
    (pixkey?.length == 12 && pixtype === 'phone') ||
    (pixkey?.length == 12 && pixtype === true)
  ) {
    if (pixkey?.charAt(0) != '0') {
      return [false, 'invalid pixkey']
    }
    return [true, '+55' + pixkey.substr(1)]
  }

  if (
    (pixkey?.length == 11 && pixtype === 'CPF') ||
    (pixkey?.length == 11 && pixtype === 'phone') ||
    (pixkey?.length == 11 && pixtype === true)
  ) {
    if (isCpf(pixkey)) {
      return [true, pixkey]
    }
    return [true, '+55' + pixkey]
  }
  return [false, 'invalid pixkey']
}

export function isMail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export function isCpf(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf == '') {
    return false
  }
  if (
    cpf.length != 11 ||
    cpf == '00000000000' ||
    cpf == '11111111111' ||
    cpf == '22222222222' ||
    cpf == '33333333333' ||
    cpf == '44444444444' ||
    cpf == '55555555555' ||
    cpf == '66666666666' ||
    cpf == '77777777777' ||
    cpf == '88888888888' ||
    cpf == '99999999999'
  ) {
    return false
  }
  let Soma
  let Resto
  Soma = 0

  for (var i = 1; i <= 9; i++)
    Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
  Resto = (Soma * 10) % 11

  if (Resto == 10 || Resto == 11) Resto = 0
  if (Resto != parseInt(cpf.substring(9, 10))) return false

  Soma = 0
  for (var i = 1; i <= 10; i++)
    Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
  Resto = (Soma * 10) % 11

  if (Resto == 10 || Resto == 11) Resto = 0
  if (Resto != parseInt(cpf.substring(10, 11))) return false
  return true
}

function isCnpj(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, '')
  if (cnpj == '') {
    return false
  }
  if (cnpj.length != 14) {
    return false
  }
  if (
    cnpj == '00000000000000' ||
    cnpj == '11111111111111' ||
    cnpj == '22222222222222' ||
    cnpj == '33333333333333' ||
    cnpj == '44444444444444' ||
    cnpj == '55555555555555' ||
    cnpj == '66666666666666' ||
    cnpj == '77777777777777' ||
    cnpj == '88888888888888' ||
    cnpj == '99999999999999'
  ) {
    return false
  }

  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0, tamanho)
  const digitos = cnpj.substring(tamanho)
  let soma = 0
  let pos = tamanho - 7
  for (var i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado != digitos.charAt(0)) {
    return false
  }
  tamanho = tamanho + 1
  numeros = cnpj.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--
    if (pos < 2) {
      pos = 9
    }
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado != digitos.charAt(1)) {
    return false
  }
  return true
}
