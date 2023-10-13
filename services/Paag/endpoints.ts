const endpoints = {
    pay: {
        name: "pay",
        method: "POST",
        uri: `/pix/pay`,
    },
    charge: {
        name: "charge",
        method: "POST",
        uri: `/pix/charge`,
    },
    transactions: {
      name: "transactions",
      method: "GET",
      uri: `/transactions`,
    },
    transaction: {
        name: "transaction",
        method: "GET",
        uri: `/transaction/`,
      },
  };
  
  export default endpoints;