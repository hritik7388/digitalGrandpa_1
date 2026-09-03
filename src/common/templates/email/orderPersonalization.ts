// src/common/templates/email/orderPersonalization.ts
import { emailLayout } from "../layout.template";

export const orderPersonalizationTemplate = (
  orderId: string,
  customerName?: string,
) =>
  emailLayout(`
    <h2>Hi ${customerName || "there"} 👋</h2>

    <p>
      Thank you for your order!
    </p>

    <p>
      Now make your T-shirt even more special with our AI personalization.
    </p>

    <p>
      Create a personalized design just for you.
    </p>

    <p style="text-align: center; margin: 30px 0;">
      <a
        href="https://YOUR-WEBSITE.com/personalize?orderId=${orderId}"
        style="
          display: inline-block;
          padding: 14px 28px;
          background-color: #000000;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Personalize Your T-Shirt with AI
      </a>
    </p>

    <p>
      Your Order ID: <strong>#${orderId}</strong>
    </p>
  `);