const enMessagesToPtBr = new Map([
  [
    "The login failed. Please check your username and password.",
    "O login falhou. Por favor, verifique seu usuário e senha.",
  ],
  [
    "You are not allowed to login because you are from a restricted country. If you have any problem, please contact support.",
    "Você não tem permissão para fazer login porque é de um país restrito. Se você tiver qualquer problema, entre em contato com o suporte.",
  ],
  [
    "Unfortunately you are logging in from a country that we do not accept bets from. We will not be able to proceed with your registration.",
    "Infelizmente, estás tentado registrar-se a partir de um país do qual não aceitamos apostas. Não poderemos prosseguir com o seu registo.",
  ],
  [
    "You are not allowed to deposit because of incomplete profile.",
    "Você não tem permissão para fazer depósitos por ter um perfil incompleto.",
  ],
]);

export function handleMessages(message: string, extraMsg?: string) {
  if (enMessagesToPtBr.has(message)) {
    return enMessagesToPtBr.get(message);
  }

  return `Tivemos um erro, entre em contato com o suporte.${
    extraMsg ? ` ${extraMsg}` : ""
  }`;
}
