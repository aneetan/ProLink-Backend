export interface PaymentMethod {
  id: string;
  type: 'eSewa' | 'Stripe';
  accountName: string;
  accountNumber: string;
  companyId: number;
}