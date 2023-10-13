import axios from "axios";
import { HAS_CUSTOMER_SERVICE } from "../constants";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useAuth } from "./useAuth";
import { AppContext } from "contexts/context";

export function useGetCustomerServiceParam() {
  const { asPath, query } = useRouter();
  const { userId } = useAuth();
  const { account } = useContext(AppContext);

  const saveCustomerServiceDataOnRedis = async (customerService: {
    name: string;
    linkSent: string;
  }) => {
    try {
      await axios.post("/api/customerService/save", {
        username: account.username,
        userId,
        customerService: customerService.name,
        linkSent: customerService.linkSent,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const customerServiceName = query[HAS_CUSTOMER_SERVICE]?.toString();
    const linkSent = asPath;

    if (customerServiceName && linkSent) {
      saveCustomerServiceDataOnRedis({
        name: customerServiceName,
        linkSent: linkSent,
      });
    }
  }, [query, asPath]);
}
