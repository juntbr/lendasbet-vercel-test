import axios from 'axios'
import { HAS_CUSTOMER_SERVICE } from '../../../../constants';
import Cookies from 'js-cookie'

export const sendForCS = async (
    username,
    customerService: { name: string; linkSent: string },
    depositValue: string,
  ) => {
    try {
      await axios.post('/api/customerService', {
        customerService: customerService.name,
        depositValue: String(depositValue),
        username: username,
        linkSent: customerService.linkSent,
      })
    } catch (e) {
      console.log(e)
    }
  
    Cookies.remove(HAS_CUSTOMER_SERVICE)
  }