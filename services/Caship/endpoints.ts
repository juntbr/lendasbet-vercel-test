const endpoints = {
  deposit: {
    name: "deposit",
    method: "POST",
    uri: `/v1/payment`,
  },
  withdraw: {
    name: "withdraw",
    method: "POST",
    uri: `/v1/prizepool`,
  },
  check: {
    name: "check",
    method: "POST",
    uri: `/ewallet/api/check`,
  },
  transaction: {
    name: "transaction",
    method: "GET",
    uri: `/v1/transaction/`,
  },
  validateCPF: {
    name: "validateCPF",
    method: "POST",
    uri: `/ewallet/api/cpf`,
  },
};

export default endpoints;
