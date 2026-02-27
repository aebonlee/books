/**
 * PortOne V1 (Iamport) PG 결제 브릿지
 * www.dreamitbiz.com과 동일한 imp 코드 사용
 */

const IMP_CODE = process.env.NEXT_PUBLIC_IMP_CODE || 'imp61949262';
const PG_PROVIDER = process.env.NEXT_PUBLIC_PG_PROVIDER || 'html5_inicis.MOIkorcom1';

interface PGRequestData {
  merchantUid: string;
  amount: number;
  name: string;
  buyerName: string;
  buyerEmail: string;
  buyerTel: string;
}

interface PGResponse {
  success: boolean;
  imp_uid: string;
  merchant_uid: string;
  error_msg?: string;
}

declare global {
  interface Window {
    IMP?: {
      init: (code: string) => void;
      request_pay: (
        data: Record<string, unknown>,
        callback: (response: PGResponse) => void,
      ) => void;
    };
  }
}

let sdkLoaded = false;

function loadIamportSDK(): Promise<void> {
  if (sdkLoaded && window.IMP) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.onload = () => { sdkLoaded = true; resolve(); };
    script.onerror = () => reject(new Error('Failed to load payment SDK'));
    document.head.appendChild(script);
  });
}

export async function requestPayment(data: PGRequestData): Promise<PGResponse> {
  await loadIamportSDK();
  if (!window.IMP) throw new Error('Payment SDK not available');

  window.IMP.init(IMP_CODE);

  return new Promise((resolve, reject) => {
    window.IMP!.request_pay(
      {
        pg: PG_PROVIDER,
        pay_method: 'card',
        merchant_uid: data.merchantUid,
        amount: data.amount,
        name: data.name,
        buyer_name: data.buyerName,
        buyer_email: data.buyerEmail,
        buyer_tel: data.buyerTel,
      },
      (response: PGResponse) => {
        if (response.success) resolve(response);
        else reject(new Error(response.error_msg || 'Payment failed'));
      },
    );
  });
}
