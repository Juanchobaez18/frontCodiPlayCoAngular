import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, PaymentMethodCreateParams, Appearance } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePublicKey = 'pk_test_51SX7J1LnBWT23pwfQ5w01GDpKm4tNHtOLUwgRVgtlbRND0E4VB4VFuuwXDjVCvuGs9egukRU1EsnpPIjKyZf1PWJ00EBZK4FXw';
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;

  async initializeStripe() {
    if (!this.stripe) {
      this.stripe = await loadStripe(this.stripePublicKey);
      if (!this.stripe) {
        throw new Error('Failed to initialize Stripe');
      }
    }
    return this.stripe;
  }

  async createElements() {
    const stripe = await this.initializeStripe();
    const appearance: Appearance = {
      theme: 'stripe',
    };
    if (!this.elements) {
      this.elements = stripe.elements({ appearance });
    }
    return this.elements;
  }

  async createPaymentMethod(
    cardDetails: any,
  ): Promise<string | null> {
    const stripe = await this.initializeStripe();
    
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardDetails,
    });

    if (error) {
      throw new Error(error.message || 'Error creating payment method');
    }

    return paymentMethod?.id || null;
  }

  getStripe() {
    return this.stripe;
  }

  getElements() {
    return this.elements;
  }
}
