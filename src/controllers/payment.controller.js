import axios from "axios";
import Subscription from "../models/Subscription.js";
import dotenv from "dotenv";

dotenv.config();

export const createSubscription = async (req, res) => {
  const {
    userId,
    amount,
    currency,
    beneficiaryName,
    sender,
    senderCountry,
    mobileNumber,
  } = req.body;

  try {
    const details = {
      account_bank: "MPS",
      account_number: "2540782773934",
      amount,
      currency,
      beneficiary_name: beneficiaryName,
      meta: {
        sender,
        sender_country: senderCountry,
        mobile_number: mobileNumber,
      },
    };

    const response = await axios.post(
      "https://api.flutterwave.com/v3/transfers",
      details,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const subscriptionDate = new Date();
    const expiryDate = new Date(subscriptionDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Set expiry date to one year from now

    const subscription = new Subscription({
      userId,
      amount,
      currency,
      subscriptionDate,
      expiryDate,
      status: response.data.status,
      transactionId: response.data.data.id,
      beneficiaryName,
      sender,
      senderCountry,
      mobileNumber,
    });

    await subscription.save();

    res.status(200).json(subscription);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Subscription creation failed", error: error.message });
  }
};