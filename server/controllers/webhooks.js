import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";


export const stripeWebHooks = async (req, res) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature']

    let event;

    try {

        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    } catch (error) {

        return res.status(400).send(`Webhook error: ${error.message}`)

    }

    try {

        switch (event.type) {
            case 'payment_intent.succeeded': {

                const paymentIntent = event.data.object;
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                })

                const session = sessionList.data[0];
                const { transactionId, appId } = session.metadata;

                if (appId === 'quickgpt') {
                    const transaction = await Transaction.findOne({
                        _id: transactionId,
                        isPaid: false
                    })

                    //update credit in user account

                    await User.updateOne({
                        _id: transaction.userId,
                    },
                        { $inc: { credits: transaction.credits } }
                    )


                    // ✅ Get the user from transaction.userId
                    const user = await User.findById(transaction.userId);

                    if (!user) {
                        console.error("User not found:", transaction.userId);
                        return res.json({ received: true, message: "User not found, skipping credit update" });
                    }


                    // Add credits to user
                    user.credits += transaction.credits;
                    await user.save();

                    //update credit payment status 

                    transaction.isPaid = true;
                    transaction.userName = user.name;
                    transaction.userEmail = user.email;
                    await transaction.save();


                } else {
                    return res.json({ received: true, message: "ignored event: invalid app" })
                }

            }

                break;

            default:
                console.log("unhandled event type:", event.type)
                break;
        }
        res.json({ received: true })

    } catch (error) {
        console.error("webhook processing error")
        return res.status(500).send("Internal Server Error")
    }

} 