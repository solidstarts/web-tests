import { VALID_DEMO_STRIPE_CARD } from "../constants/stripe-card.constant";
import { isProd } from "./isProd";


export interface CreditCard {
    number: string,
    expiry: string,
    cvv: string
}

export function getCardDetails(): CreditCard {
    return isProd() ? {
        number: process.env.CARD_NUMBER as string,
        expiry: process.env.CARD_EXPIRY as string,
        cvv: process.env.CARD_CVV as string
    } : VALID_DEMO_STRIPE_CARD
}