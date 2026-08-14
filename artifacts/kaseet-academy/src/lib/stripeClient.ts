/**
 * Loads the Stripe publishable key from the API and returns a shared Stripe promise.
 * Fetches the key lazily so it doesn't block page load.
 */
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

let _promise: Promise<Stripe | null> | null = null;

export function getStripePromise(): Promise<Stripe | null> {
  if (!_promise) {
    _promise = (async () => {
      try {
        const res = await fetch('/api/checkout/config');
        if (!res.ok) throw new Error(`Stripe config ${res.status}`);
        const { publishableKey } = await res.json() as { publishableKey: string };
        return loadStripe(publishableKey);
      } catch (err) {
        console.error('[Stripe] failed to load publishable key', err);
        return null;
      }
    })();
  }
  return _promise;
}
