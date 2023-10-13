let endpoints = {
  deposit: {
    name: "deposit",
    method: "POST",
    uri: `/ServerAPI/Deposit/{version}/{partnerID}/{partnerKey}`,
  },
  withdraw: {
    name: "withdraw",
    method: "POST",
    uri: `/ServerAPI/Withdraw/{version}/{partnerID}/{partnerKey}`,
  },
  checkdeposittrans: {
    name: "checkdeposittrans",
    method: "POST",
    uri: `/ServerAPI/CheckDepositTrans/{version}/{partnerID}/{partnerKey}`,
  },
  proceedwithdraw: {
    name: "proceedwithdraw",
    method: "POST",
    uri: `/ServerAPI/ProceedWithdraw/{version}/{partnerID}/{partnerKey}`,
  },
  rollbackwithdraw: {
    name: "rollbackwithdraw",
    method: "POST",
    uri: `/ServerAPI/RollbackWithdraw/{version}/{partnerID}/{partnerKey}`,
  },
  approvewithdraw: {
    name: "approvewithdraw",
    method: "POST",
    uri: `/ServerAPI/ApproveWithdraw/{version}/{partnerID}/{partnerKey}`,
  },
  balance: {
    name: "balance",
    method: "GET",
    uri: `/ServerAPI/GetBalance/{version}/{partnerID}/{partnerKey}`,
  },
  transactionHistory: {
    name: "transactionHistory",
    method: "POST",
    uri: `/ServerAPI/GetUserTransactionHistory_Payment/{version}/{partnerID}/{partnerKey}`,
  }
};

Object.entries(endpoints).forEach(([key]) => {
  endpoints[key].uri = endpointResolver(endpoints[key].uri);
});

export function endpointResolver(uri: string) {
  return uri
    .replace("{version}", "1.0")
    .replace("{partnerID}", process.env.GAMMATRIX_API_SITE_ID)
    .replace("{partnerKey}", process.env.GAMMATRIX_API_SITE_CODE);
}

export function getGamMatrixUri(method: string) {
  return endpointResolver(
    `${process.env.GAMMATRIX_API_URL}/ServerAPI/${method}/{version}/{partnerID}/{partnerKey}`
  );
}

export default endpoints;
