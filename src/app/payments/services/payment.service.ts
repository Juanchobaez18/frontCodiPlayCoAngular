import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  paymentMethodId: string;
  description?: string;
  customerEmail?: string;
}

export interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/payments';

  constructor(private http: HttpClient) {}

  createPaymentIntent(payload: CreatePaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/create-intent`, payload);
  }

  confirmPayment(paymentIntentId: string): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/confirm`, {
      paymentIntentId,
    });
  }

  getPaymentHistory(): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(`${this.apiUrl}/history`);
  }
}
