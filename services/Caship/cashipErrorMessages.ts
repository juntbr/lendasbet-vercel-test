const CODE_TO_MESSAGES = new Map([
  ["1001", "Erro de autenticação: Verifique se o header da request está enviando as informações de acordo com a documentação."],
  ["1003", "Método não autorizado."],
  ["1004", "Formato de JSON errado."],
  ["1005", "Há campos obrigatórios para esta operação que não foram enviados."],
  ["1008", "Você precisa ter no mínimo 18 anos para realizar transações."],
  ["1010", "Usuário deve conter nome e sobrenome completo."],
  ["1011", "O campo order_method não é valido."],
  ["1012", "O valor pedido está abaixo do valor mínimo aceitável"],
  ["1013", "Houve um erro adicionando o usuário (verifique os dados enviados)."],
  ["1014", "O campo partner_order_number já foi utilizado."],
  ["1015", "Houve um erro na adição da transação (verifique os dados enviados)."],
  ["1016", "O valor enviado para o campo partner_order_method não é valido."],
  ["1017", "Houve um erro enquanto gerava o boleto bancário."],
  ["1018", "Houve um erro enquanto gerava o PIX."],
  ["1019", "Houve um erro enquanto gerava o PicPay."],
  ["1020", "Houve um erro enquanto gerava a transação com criptomoedas."],
  ["1022", "Houve um erro obtendo as transações, verifique os parâmetros inseridos"],
  ["1024", "Você excedeu o limite de transações pelo período de uma hora."],
  ["1025", "Você excedeu o limite de transações pelo período de um dia."],
  ["1026", "O saque não foi autorizado."],
  ["1027", "O saque não foi autorizado, saldo insuficiente."],
  ["1030", "Tentativa de retirada, sem transações com parceiros."],//	Attempt to withdraw by user without partner transactions
  ["1031", "Para o método de pedido informado, o valor da quantidade do pedido excedeu o valor máximo permitido."],
  ["1032", "O CPF informado é inválido."],
  ["1033", "Documento do usuário bloqueado internamente."],
  ["1035", "Método bloqueado internamente."],
  ["1036", "O CEP informado é inválido."],
  ["1038", "E-mail já utilizado, por favor utilize outro."],
  ["1039", "Você só pode realizar depósito em contas que pertencem a você."],
  ["1042", "Seus depósitos estão sendo cancelados. Entre em contato com o suporte!"],
  ["1040", "Tentativa de conexão recusada."],
  ["1041", "A chave pix utilizada não existe."],
  [
    "1043",
    "Você já tem um saque em andamento, aguarde alguns instantes para solicitar novamente.",
  ],
]);

export function cashipErrorMessages(errorCode: string) {
  if (CODE_TO_MESSAGES.has(errorCode)) {
    return CODE_TO_MESSAGES.get(errorCode);
  }

  return "Falha ao realizar operação.";
}
