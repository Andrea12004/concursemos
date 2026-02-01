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


export const getSubscriptionsEndpoint = async (
  userId: string | number,
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.get(
    `/payments/subscriptions/${userId}`,
    { headers }
  );
  return response.data;
};

export const cancelSubscriptionEndpoint = async (
  subscriptionId: string,
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.post(
    `/payments/cancel-subscription/${subscriptionId}`,
    {},
    { headers }
  );
  return response.data;
};


export const getManualPaymentsEndpoint = async (
  userId: string | number,
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.get(
    `/manualpay/user/${userId}`,
    { headers }
  );
  return response.data;
};

export const createCardTokenEndpoint = async (
  cardData: {
    number: string;
    exp_year: string;
    exp_month: string;
    cvc: string;
  },
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.post(
    `/payments/create-token`,
    { card: cardData },
    { headers }
  );
  return response.data;
};



export const createCustomerEndpoint = async (
  customerData: {
    token_card: string;
    name: string;
    last_name: string;
    email: string;
    default: boolean;
    city: string;
    address: string;
    phone: string;
    cell_phone: string;
  },
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.post(
    `/payments/create-customer`,
    customerData,
    { headers }
  );
  return response.data;
};


export const subscribeEndpoint = async (
  userId: string | number,
  subscriptionData: {
    id_plan: string;
    customer: string;
    token_card: string;
    doc_type: string;
    doc_number: string;
  },
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.post(
    `/payments/subscribe/${userId}`,
    subscriptionData,
    { headers }
  );
  return response.data;
};



export const chargePaymentEndpoint = async (
  chargeData: {
    id_plan: string;
    name: string;
    last_name: string;
    email: string;
    value: number;
    currency: string;
    customer_id: string;
    token_card: string;
    doc_type: string;
    doc_number: string;
    ip: string;
  },
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.post(
    `/payments/charge`,
    chargeData,
    { headers }
  );
  return response.data;
};