import Razorpay from "razorpay";
import database from "../database/db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Load .env explicitly (since this file runs independently)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../config/config.env") });
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Debug check (optional, remove later)
console.log("🧩 Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("🧩 Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET ? "Loaded ✅" : "❌ Missing");

// ✅ Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

export async function generatePaymentIntent(orderId, totalPrice) {
  try {
    const options = {
      amount: Math.round(totalPrice * 100), // INR in paise
      currency: "INR",
      receipt: `rcpt_${Date.now().toString().slice(-8)}`, // ✅ short & valid
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    await database.query(
      "INSERT INTO payments (order_id, payment_type, payment_status, payment_intent_id) VALUES ($1, $2, $3, $4)",
      [orderId, "Online", "Pending", order.id]
    );

    console.log("✅ Razorpay Order Created:", order);

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("💥 Razorpay Payment Error:", error);
    return { success: false, message: "Payment Failed." };
  }
}

