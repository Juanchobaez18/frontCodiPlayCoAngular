import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentService } from '../services/payment.service';
import { StripeService } from '../services/stripe.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss',
})
export class PaymentFormComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private stripeService = inject(StripeService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  cardNumber = '';
  cardExpiry = '';
  cardCvc = '';
  amount = '';
  currency = 'usd';
  description = '';
  isLoading = false;

  async ngOnInit() {
    try {
      await this.stripeService.initializeStripe();
    } catch (error) {
      this.snackBar.open('Error initializing Stripe', 'Close', { duration: 5000 });
    }
  }

  async submitPayment() {
    if (!this.cardNumber || !this.cardExpiry || !this.cardCvc || !this.amount) {
      this.snackBar.open('Por favor completa todos los campos', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    try {
      // Parse card details
      const [month, year] = this.cardExpiry.split('/');
      const cardDetails = {
        number: this.cardNumber.replace(/\s/g, ''),
        exp_month: parseInt(month),
        exp_year: parseInt('20' + year),
        cvc: this.cardCvc,
      };

      // Create payment method
      const paymentMethodId = await this.stripeService.createPaymentMethod(cardDetails);

      if (!paymentMethodId) {
        throw new Error('Failed to create payment method');
      }

      // Create payment intent
      const paymentResponse = await this.paymentService
        .createPaymentIntent({
          amount: Math.round(parseFloat(this.amount) * 100), // Convert to cents
          currency: this.currency,
          paymentMethodId,
          description: this.description,
        })
        .toPromise();

      if (!paymentResponse) {
        throw new Error('Failed to create payment intent');
      }

      // Confirm payment
      const stripeInstance = await this.stripeService.initializeStripe();
      const { paymentIntent, error } = await stripeInstance.confirmCardPayment(
        paymentResponse.clientSecret,
        { payment_method: paymentMethodId }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        this.snackBar.open('¡Pago realizado exitosamente!', 'Close', { duration: 3000 });
        
        // Redirect to /pago-exitoso after 1 second
        setTimeout(() => {
          this.router.navigate(['/pago-exitoso'], { queryParams: { transaccion: paymentResponse.transaction.id } });
        }, 1000);
      } else {
        this.snackBar.open('Pago pendiente. Por favor verifica tu bandeja de entrada.', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      this.snackBar.open(`Error: ${error.message || 'Error al procesar el pago'}`, 'Close', {
        duration: 5000,
      });
    } finally {
      this.isLoading = false;
    }
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    this.cardNumber = value;
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.cardExpiry = value;
  }

  resetForm() {
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCvc = '';
    this.amount = '';
    this.description = '';
  }
}
