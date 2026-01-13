import axios from "axios";


export const createManualPaymentEndpoint = async (
  userId: string | number,
  paymentData: {
    startpay: string;
    endpay: string;
    amount: number;
    status: boolean;
  },
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.post(
    `/manualpay/create/${userId}`,
    paymentData,
    { headers }
  );
  return response.data;
};


export const confirmPaymentEndpoint = async (
  userId: string | number,
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.post(
    `/payments/confirm`,
    { userId },
    { headers }
  );
  return response.data;
};