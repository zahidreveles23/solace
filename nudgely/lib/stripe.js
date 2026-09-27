import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_missing");
export const PRICE_CENTS = Number(process.env.PRICE_CENTS || 1900);
