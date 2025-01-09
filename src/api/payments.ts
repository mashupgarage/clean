import axios from "axios";

const kPayAppSecret = import.meta.env.VITE_KPAY_APP_SECRET;
const kPayDeviceUrl = import.meta.env.VITE_KPAY_DEVICE_URL;
const kPayAppId = `${import.meta.env.VITE_KPAY_APP_ID}`;
const serverUrl = `${import.meta.env.VITE_CLOUD_SERVER_URL}`;

type TransactionBody = {
  outTradeNo: string; // max 32 chars
  payAmount: string; // 12 chars, i.e. 000000001250 === 12.50
  tipsAmount?: string; // 12 chars, NOTE: Optional when in Kiosk Mode
  payCurrency: string; // max 4 chars. NOTE: currently only supports HKD (344)
  memberCode?: string; // max 32 chars
  description?: string; // max 128 chars
  // note: Only able to use 1,3,7 for API v1
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
  const body = JSON.stringify(transactionBody);
  const endpoint = `/v1/pos/sales`;

  const response = await axios.post(`${serverUrl}/api/sales/`, {
    kPayDeviceUrl,
    endpoint,
    appId: kPayAppId,
    body,
    privKey, // Transfer to backend later
  });

  return response.data;
};

// Print Receipt
// Run this after transaction ??? Automatic??

// Query Transaction API
// Use when transaction takes longer than 65 seconds (?)
