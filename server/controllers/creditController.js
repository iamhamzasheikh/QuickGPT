import Transaction from "../models/Transaction"
import Stripe from "stripe"



const plans = [

    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }

]



//Api controller for getting all plans 

export const getPlans = async (req, res) => {

    try {

        return res.json({ success: true, plans })

    } catch (error) {

        return res.json({ success: false, message: message.error })
    }

}


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Api controller for purchasing a plans 

export const purchasePlan = async (req, res) => {

    try {

        const { planId } = req.body;
        const userId = req.body;
        const plan = plans.find(plan => plan._id === planId);

        if (!plan) {
            return res.json({ success: false, message: 'invalid plan' })
        }

        //create new transaction

        const transaction = await Transaction.create({
            userId: userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false
        });


        const { origin } = req.header;


        const session = await stripe.checkout.sessions.create({

            line_items: [
                {
                    price: {
                        currency: "usd",
                        unit_amount: plan.price * 100,

                        product_data: {
                            name: plan.name,

                        }

                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/loading`,
            cancel_url: `${origin}`,
            metadata: { transaction: transaction._id.toString(), appId: 'Quick GPT' },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,  // expire after 30 mints
        });

        return res.json({ success: true, url: session.url, message: 'Payment Successful' })


    } catch (error) {

        return res.json({ success: false, message: error.message })

    }

}