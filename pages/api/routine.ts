// import axios from 'axios'
// import * as url from 'url';
// import fs from 'fs'
// import path from 'path';

export default async function handler(req, res) {

  res.end()
  return

  // const __dirname = path.dirname(new URL(import.meta.url).pathname);
  // const jsonFilePath = path.join(__dirname, 'caship-notification-2023-09-29.json');

  //   // Read the JSON file
  //   fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  //     if (err) {
  //       console.error('Error reading JSON file:', err);
  //       return;
  //     }
  
  //     // Parse the JSON content into a JavaScript object
  //     try {
  //       const jsonArray = JSON.parse(data);
  
  //       // Check if the parsed data is an array
  //       if (Array.isArray(jsonArray)) {
  //         // Calculate the sum of 'partner_order_amount' values
  //         const totalAmount = jsonArray.reduce((acc, obj) => {
  //           if (obj.partner_order_amount) {
  //             return acc + parseFloat(obj.partner_order_amount);
  //           }
  //           return acc;
  //         }, 0);
  
  //         console.log(`Number of objects in the array: ${jsonArray.length}`);
  //         console.log(`Total partner_order_amount: ${totalAmount.toFixed(2)}`);
  //       } else {
  //         console.error('The JSON data is not an array.');
  //       }
  //     } catch (parseError) {
  //       console.error('Error parsing JSON:', parseError);
  //     }
  //   });
  

  // res.end()
  // return
  // const transactions = [
  //   'WITHDRAW_c0db567b-8b9b-4deb-bb8d-9c84f7e43615',
  //   'WITHDRAW_0dbe491e-5287-4900-a8ac-9bcced99257e',
  //   'WITHDRAW_c8acffd2-3fbe-4933-bfd7-5bc1f0cb684e',
  //   'WITHDRAW_5c1563d5-1384-40b5-abe7-c5d035c7b2c3',
  //   'WITHDRAW_94252c4b-ba50-4f5c-850f-c8dc686c9423',
  //   'WITHDRAW_9416a6b5-ce68-4973-a011-cf48d8b254e5',
  //   'WITHDRAW_2f0866f1-6b1f-4da8-8470-6f86cc47e985',
  //   'WITHDRAW_4dd1cb73-2540-4dfe-a741-118ebf714981',
  //   'WITHDRAW_2e978e52-9043-4043-82b5-3de3a27a5046',
  //   'WITHDRAW_41216924-0ba2-4a4e-9dca-825dd8f33739',
  //   'WITHDRAW_48343cfc-91d1-4eb5-b2f3-c1daa255a15b',
  //   'WITHDRAW_d0939be8-ce96-4704-934e-2f3b99ca6a25',
  //   'WITHDRAW_6a38d3ea-7709-4174-bd44-cf0d953b1d2a',
  //   'WITHDRAW_f1fb9b62-2ed0-445d-bc9d-2f504fa80e3a',
  //   'WITHDRAW_60635c4e-a2b7-4ebc-95c6-777b0af50708',
  //   'WITHDRAW_73b20cf4-f513-43d0-bc77-fe9abfdd0644',
  //   'WITHDRAW_6ffc6421-ebeb-4c31-90a4-296d7237de3a',
  //   'WITHDRAW_b02d1c59-4a10-47a4-a78f-ecf89bd6c97c',
  //   'WITHDRAW_d96eb64f-6a87-4f96-92c3-5458a0e0c598',
  //   'WITHDRAW_6137e634-9ea3-4917-87d1-7a96475ca0a7',
  //   'WITHDRAW_27577188-7acc-4b12-bfc8-800bb16ace81',
  //   'WITHDRAW_45574e90-eb44-4169-aac5-352a38d1196c',
  //   'WITHDRAW_b70a7a23-82ad-4c86-bc5e-58534b4f56c7',
  //   'WITHDRAW_a9ff773c-216d-4971-ad27-66dbade9ceff',
  //   'WITHDRAW_8b71f188-d678-4160-a216-7b98942f8020',
  //   'WITHDRAW_a8e283a2-e1c2-4f40-9b34-d3601a4711e3',
  //   'WITHDRAW_38024556-e224-416f-8600-9a8a843ecbed',
  //   'WITHDRAW_12ebead9-7975-421e-9001-cea300a588d3',
  //   'WITHDRAW_197f5b71-37e0-4c69-9118-fae0588018e3',
  //   'WITHDRAW_fae2dc1e-12f6-476d-8337-4213c3c37b03',
  //   'WITHDRAW_00e2e038-b202-41ce-a301-40db1e45a6b0',
  //   'WITHDRAW_43fc9b88-0f0e-471b-9ada-24016e9bc950',
  //   'WITHDRAW_46eabfd5-052e-4e96-8770-e7f8542929ab',
  //   'WITHDRAW_3ef2502c-6690-4b25-be23-a584f282e16d',
  //   'WITHDRAW_5d643b45-0d27-46f0-bb58-392a8bef5b98',
  //   'WITHDRAW_e77a2d83-afa3-40ee-965d-391f1d629a81',
  //   'WITHDRAW_0c0e1ebe-120c-4d9e-9c22-707ae2b1521c',
  //   'WITHDRAW_d4eab6ff-b158-41e2-968f-26e488e3a1a7',
  //   'WITHDRAW_45958b6b-26a1-4e80-9a1d-5ee931a4015c',
  //   'WITHDRAW_30b4be6c-c37a-4788-9e3b-8f580b06c694',
  //   'WITHDRAW_05f37367-e265-4baf-94d3-2aab2cb4a526',
  //   'WITHDRAW_c8da7460-e97d-4682-b1b0-f3b72c31127d',
  //   'WITHDRAW_85bdf326-7616-40e1-ab3f-d636bf2dcf25',
  //   'WITHDRAW_885562b4-0eed-40a8-9ad3-ab3ea60ddc66',
  //   'WITHDRAW_2d934322-faf8-4d30-b3e8-fa557bf065d4',
  //   'WITHDRAW_0f5f653d-1b63-48ae-bc35-1a9ec3e88f7a',
  //   'WITHDRAW_6ff494bd-197d-4d4c-bfcc-27cbf3cdf99d',
  //   'WITHDRAW_5f3f8a42-799d-4767-9ee8-027c721fdff3',
  //   'WITHDRAW_6bca66d7-5c30-487a-a029-406f0a8d284e',
  //   'WITHDRAW_015d3655-b161-41ce-b2e1-449380ce60a2',
  //   'WITHDRAW_639e84d9-676f-4559-aa48-68dacc8a0f53',
  //   'WITHDRAW_7cfa688f-dbbe-410a-b2b4-94513e2a0e3f',
  //   'WITHDRAW_4380bda3-2ef4-4fe6-b9b8-b3381a45e599',
  // ]

  // let dataArr = []

  // async function getTransaction(transaction) {
  //   try {
  //     const res = await axios.get(
  //       `https://caship.com.br/v1/transaction/${transaction}`,
  //       {
  //         headers: {
  //           Authorization: 'Basic ' + process.env.CASHIP_BASIC_AUTH,
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     )
  //     const data = res.data
  //     console.log('SUCCESS DATA: ' + transaction)
  //     return data
  //   } catch (e) {
  //     const data = e.response.data
  //     console.log('ERROR DATA: ' + transaction, data)
  //     return { ...data, partner_order_number: transaction }
  //   }
  // }

  // const promises = []
  // for (const element of transactions) {
  //   promises.push(getTransaction(element))
  // }

  // await Promise.all(promises).then((values) => {
  //   console.log(values)
  //   dataArr = values
  // })

  // console.log('data', dataArr)
  // fs.writeFile(
  //   './testing/transactionData.json',
  //   JSON.stringify(dataArr),
  //   function (err) {
  //     if (err) {
  //       return console.log(err)
  //     }
  //     console.log('The file was saved!')
  //   },
  // )

  // res.end()
}
