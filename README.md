"# Tradewave" 

# TradeWave Platform

## Recent Features & Improvements

### Seamless Onboarding & Profile Creation
- Users can now sign up or log in with Google, email, or anonymously.
- After login/signup, a user and profile document are automatically created in Firestore if missing.
- Role selection is improved: authenticated users update their role in Firestore and are routed to profile setup or dashboard.
- Profile setup ensures a profile exists and allows role changes without logging out.

### Stripe Payment Method Integration
- Users can now add or update their card securely from the profile page using Stripe Elements.
- A new API endpoint (`/api/stripe/setup-intent`) creates a Stripe SetupIntent and returns the client secret for secure card setup.
- The payment method form is ready for future expansion (e.g., showing saved cards, Stripe Connect for creators).

### Next Steps
- Test the full onboarding, profile creation, and payment method flow on Vercel.
- Optionally, expand the payment system to support payouts for creators using Stripe Connect.

---

For more details, see the code and comments in the relevant files:
- `app/profile/page.tsx`
- `components/PaymentMethodForm.tsx`
- `pages/api/stripe/setup-intent.ts` 
