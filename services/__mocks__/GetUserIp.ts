import { USER_IP } from "mocks/user";

export async function GetUserIp(req = null): Promise<{ ip: string }> {
  return {
    ip: USER_IP,
  };
}

export default GetUserIp;
