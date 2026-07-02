import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  paymentMethodId: string;
  description?: string;
  customerEmail?: string;
}

export interface PaymentResponse {
  transaction: any;
  clientSecret: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = environment.apiUrl + '/payments';

  constructor(private http: HttpClient) {}

  createPaymentIntent(payload: CreatePaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/stripe/checkout`, payload);
  }

  getPaymentHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
