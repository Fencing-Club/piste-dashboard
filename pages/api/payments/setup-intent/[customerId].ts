import type { NextApiHandler } from "next"
import Stripe from "stripe"

// Sample: https://github.com/stripe-samples/saving-card-without-payment/blob/14749ed3cf830ba307924092b9ca3e0d4ae726ef/client/script.js#L55
// customerId = cus_Kvm41gHVgqbeeS

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2020-08-27",
  appInfo: {
    name: process.env.NEXT_PUBLIC_SITE_NAME!,
  },
})

// Create or use an existing Customer to associate with the SetupIntent.
// The PaymentMethod will be stored to this Customer for later use.
const setupIntent: NextApiHandler<Stripe.SetupIntent | Error> = async (
  req,
  res
) => {
  const { customerId } = req.query

  if (!customerId) {
    res.status(400).json(new Error("No customerId was provided."))
  }

  if (typeof customerId === "string") {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
      })

      res.status(200).json(setupIntent)
    } catch (error: any) {
      res.status(error.statusCode).json(error)
    }
  } else {
    res.status(400).json(new Error("customerId must be a string."))
  }
}

export default setupIntent
