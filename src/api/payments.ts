import axios from "axios";
// import queryString from "query-string";

// axios.defaults.headers.common["ngrok-skip-browser-warning"] = true;
// axios.defaults.headers.common["User-Agent"] = "PostmanRuntime/7.42.0";

// const baseUrl = `${import.meta.env.VITE_CLOUD_SERVER_URL}`;
const kPayAppSecret = import.meta.env.VITE_KPAY_APP_SECRET;
const kPayDeviceUrl = import.meta.env.VITE_KPAY_DEVICE_URL;
const kPayAppId = `${import.meta.env.VITE_KPAY_APP_ID}`;
const serverUrl = `${import.meta.env.VITE_CLOUD_SERVER_URL}`;

type TransactionBody = {
  outTradeNo: string; // max 32 chars
  payAmount: string; // 12 chars, i.e. 000000001250 === 12.50
  tipsAmount?: string; // 12 chars
  payCurrency: string; // max 4 chars. NOTE: currently only supports HKD (344)
  memberCode?: string; // max 32 chars
  description?: string; // max 128 chars
  paymentType?: number; // 1: Card, 2: QR Code positive scan, 3: QR Code reverse scan, 4: Octopus, 5: Octopus QR Code, 6: Payme positive scan, 7: Payme reverse scan
  callbackUrl?: string; // max 256 chars
  qrCodeContent?: string; // max 256 chars
  includeReceipt?: boolean;
  remark?: string; // max 256 chars
};

// Sign in to the payment provider (Note: Make a page to run this API, also  )
// https://docs-posserver.kpay-group.com/#/api/index?id=%e6%87%89%e7%94%a8%e7%b0%bd%e5%88%b0
export const signInToKPay = async (): Promise<{
  code: number;
  data: { platformPublicKey: string; appPrivateKey: string };
  message: string;
}> => {
  const endpoint = `${kPayDeviceUrl}/v1/pos/sign`;

  const generateNonce = (length = 32) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let nonce = "";
    for (let i = 0; i < length; i++) {
      nonce += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return nonce;
  };

  const headers = {
    timestamp: Math.floor(Date.now()),
    nonceStr: generateNonce(),
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    appId: kPayAppId,
    appSecret: kPayAppSecret,
    actionCallbackUrl: `${kPayDeviceUrl}`,
  });
  console.log(headers);
  console.log(body);

  return axios
    .post(endpoint, body, { headers })
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

// Transaction API
// https://docs-posserver.kpay-group.com/#/apiv2/index?id=%e6%b6%88%e8%b2%bb%e4%ba%a4%e6%98%93
// Note: Using v2 API
export const startTransaction = async (
  transactionBody: TransactionBody,
  privKey: string,
  // Docs are not so clear what the return type for data is
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ code: string; data: any; message: string }> => {
  // const signWithRSA = async () => {
  // try {
  // console.log("Signature String:", signatureString);
  const body = JSON.stringify(transactionBody);
  const endpoint = `${kPayDeviceUrl}/v1/pos/sales`;
  const response = await axios.post(`${serverUrl}/api/encrypt-rsa/`, {
    // signatureString,
    endpoint,
    appId: kPayAppId,
    // timestamp,
    // nonceStr,
    body,
    privKey,
  });
  console.log("Encrypted Data:", response.data.signature);
  return response.data;
  // } catch (error) {
  //   console.log("Encryption error:", error);
  //   // console.error("Encryption error:", error.response?.data || error.message);
  // }
};
//   console.log(serverUrl, kPayDeviceUrl);

//   // const timestamp = Math.floor(Date.now());
//   // const nonceStr = Math.random().toString(36).substring(2, 15);
//   // try generating the nonce & timestamp in the backend

//   // const signatureString = `POST\n/v2/pos/sales\n${timestamp}\n${nonceStr}\n${body}\n`;
//   const signature = await signWithRSA();

//   console.log(signature);

//   const headers = {
//     appId: kPayAppId,
//     signature,
//     // timestamp: timestamp.toString(), // convert to str as required by API
//     // nonceStr,
//   };

//   console.log(headers);
//   return axios
//     .post(endpoint, body, { headers })
//     .then((res) => res.data)
//     .catch((err) => err.response.data.error);
// };

// Print Receipt
// Run this after transaction ??? Automatic??

// Query Transaction API
// Use when transaction takes longer than 65 seconds (?)
