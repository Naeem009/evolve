import { site } from "./site";

export type DocSection = { heading: string; paragraphs: string[] };

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  lede: string;
  sections: DocSection[];
};

const reviewNote =
  "This is a working draft for the EVOLVE website. Have the final text reviewed by the business owner or a lawyer before you rely on it.";

export const policies: DocPage[] = [
  {
    slug: "shipping",
    title: "Shipping Policy",
    description: "Delivery coverage, timing and charges for EVOLVE orders across Pakistan.",
    lede: "We ship across Pakistan. Metro cities move first. Every order is prepared in our studio before it is handed to a courier.",
    sections: [
      {
        heading: "Where we deliver",
        paragraphs: [
          "We deliver to cities across Sindh, Punjab, Islamabad, Khyber Pakhtunkhwa, Balochistan, Azad Jammu & Kashmir and Gilgit-Baltistan. The city list at checkout is the current coverage. If your city is missing, write to us on WhatsApp and we will tell you whether a booking is possible.",
        ],
      },
      {
        heading: "Processing time",
        paragraphs: [
          "Orders are prepared in 1–2 working days. Cash on Delivery orders may wait for a confirmation call or WhatsApp message before they are packed. A confirmed order placed on Friday may dispatch on Monday.",
        ],
      },
      {
        heading: "Delivery estimates",
        paragraphs: [
          "After dispatch: Karachi, Lahore, Islamabad and Rawalpindi usually take 2–4 days. Other major cities take 3–5 days. The rest of Pakistan takes 4–7 days. Express dispatch, where offered, is 1–2 days after handover and is limited to the four metro cities. These are estimates, not guarantees. Weather, customs of the courier and incomplete addresses can add time.",
        ],
      },
      {
        heading: "Charges and free shipping",
        paragraphs: [
          `Standard delivery is PKR 250 in metro cities, PKR 400 in major cities and PKR 550 elsewhere. Standard delivery is free when the merchandise total, after discounts, reaches ${site.freeShippingThreshold.toLocaleString("en-PK")} rupees. Express delivery, where available, is charged even when standard delivery is free.`,
        ],
      },
      {
        heading: "Tracking",
        paragraphs: [
          "When a parcel is booked you receive a tracking number by the contact method on the order. You can also look it up on the Track Order page with your order number and phone.",
        ],
      },
      {
        heading: "Failed delivery",
        paragraphs: [
          "Couriers usually attempt delivery more than once. If the parcel cannot be delivered it may return to us. A returned Cash on Delivery parcel may affect whether we can offer COD on a later order. Contact us as soon as you know you will miss the courier.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [`Questions about a shipment: WhatsApp ${site.whatsapp} or ${site.email}. Have your order number ready.`],
      },
    ],
  },
  {
    slug: "exchange",
    title: "Exchange Policy",
    description: "How EVOLVE size and colour exchanges work within the exchange window.",
    lede: `You may request one exchange within ${site.exchangeWindowDays} days of delivery.`,
    sections: [
      {
        heading: "Window",
        paragraphs: [
          `The exchange window is ${site.exchangeWindowDays} days from the day you receive the parcel. The request has to reach us inside that window. The piece itself can arrive back shortly after, as long as the request was on time.`,
        ],
      },
      {
        heading: "Conditions",
        paragraphs: [
          "The piece must be unworn, unwashed and unaltered, with tags attached and no scent, makeup or damage. We inspect every return. If it does not pass, we send it back to you and the exchange stops.",
        ],
      },
      {
        heading: "What can be exchanged",
        paragraphs: [
          "Size and colour, for the same style, subject to stock. If the size or colour you want is gone, we can refund by the method in the Return Policy or offer another piece of equal value.",
        ],
      },
      {
        heading: "Who pays shipping",
        paragraphs: [
          "If we sent the wrong size, colour or a faulty piece, we pay the shipping both ways. If you are changing your mind about size or colour, the return shipping is yours and we ship the replacement once the original is accepted.",
        ],
      },
      {
        heading: "How to request",
        paragraphs: [
          "Request an exchange from your account, from the Track Order page, or on WhatsApp with your order number. Do not ship a parcel back before we confirm the address and the booking.",
        ],
      },
      {
        heading: "Non-exchangeable",
        paragraphs: [
          "Worn or washed pieces, items without tags, and pieces altered after delivery cannot be exchanged. Final-sale items, if we ever mark them as such on the product page, are excluded.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Return & Refund Policy",
    description: "Eligibility, inspection and refund timelines for EVOLVE orders.",
    lede: "If a piece is faulty, incorrect, or still unworn inside the exchange window, we will make it right.",
    sections: [
      {
        heading: "Eligibility",
        paragraphs: [
          `Returns follow the same ${site.exchangeWindowDays}-day window and the same condition rules as exchanges. Change-of-mind returns are accepted only when the piece is unworn, with tags, and the request is inside the window.`,
        ],
      },
      {
        heading: "Defective or wrong items",
        paragraphs: [
          "If we sent the wrong piece, or it arrives damaged or with a making fault, tell us within 48 hours of delivery and include photographs. We repair, replace or refund, and we cover the courier.",
        ],
      },
      {
        heading: "Inspection",
        paragraphs: [
          "Returned pieces are inspected within two working days of reaching us. You will hear the outcome on WhatsApp or email. Pieces that fail inspection are sent back.",
        ],
      },
      {
        heading: "Refund method and timeline",
        paragraphs: [
          "Online payments are refunded to the original method. Cash on Delivery refunds are sent to a Pakistani bank account or JazzCash / Easypaisa wallet in your name. Refunds are initiated within 3 working days of a passed inspection and usually appear in 5–10 working days, depending on the bank or wallet.",
        ],
      },
      {
        heading: "Non-returnable",
        paragraphs: [
          "Worn, washed, damaged-by-use or tagless pieces are not returnable. Shipping fees are refunded only when the return is our error.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "What EVOLVE collects, why, and the rights you have over that data.",
    lede: "We collect only what we need to take an order, deliver it, and understand whether the shop is working.",
    sections: [
      {
        heading: "Data we collect",
        paragraphs: [
          "Name, mobile number, optional email, delivery address, order notes and order history. If you pay online, the payment provider processes the payment. We do not store card numbers. If you upload a transfer receipt, we store that file with the order.",
        ],
      },
      {
        heading: "Why we use it",
        paragraphs: [
          "To create and deliver orders, confirm Cash on Delivery, handle exchanges, and send the messages you asked for. Analytics and advertising pixels run only after you accept cookies, and they are used to measure visits and ads.",
        ],
      },
      {
        heading: "Cookies, analytics and pixels",
        paragraphs: [
          "Essential cookies remember your bag and your consent. Optional cookies cover Google Analytics 4, the Meta Pixel and the TikTok Pixel when those accounts are connected. You can refuse optional cookies and still shop. The choice is stored on this device.",
        ],
      },
      {
        heading: "Who we share it with",
        paragraphs: [
          "Couriers receive the delivery details. Payment providers receive what they need to take a payment. We do not sell personal data. Staff can see order records in the studio.",
        ],
      },
      {
        heading: "Retention and your rights",
        paragraphs: [
          "Order records are kept for tax and fraud-prevention needs, then deleted or reduced. You may ask for a copy of your data, a correction, or deletion of the account details we do not have to keep by law. Write to " +
            site.email +
            ".",
          reviewNote,
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    description: "The terms that apply when you shop with EVOLVE in Pakistan.",
    lede: "By placing an order you agree to these terms, the shipping policy, the exchange policy and the COD policy.",
    sections: [
      {
        heading: "Orders",
        paragraphs: [
          "An order is an offer to buy. We accept it when we confirm it, by packing it or by a confirmation message. We may decline an order that looks fraudulent, that we cannot deliver, or that we cannot fulfil because stock has gone.",
        ],
      },
      {
        heading: "Pricing and availability",
        paragraphs: [
          "Prices are in Pakistani rupees and include applicable tax unless a product says otherwise. We do our best to keep stock accurate. If a piece sells out after you order, we will tell you and refund any payment taken.",
        ],
      },
      {
        heading: "Payments",
        paragraphs: [
          "We accept Cash on Delivery, bank transfer, and card or wallet payments through a hosted payment page. We never ask you to send a card number on WhatsApp. Online payments are taken by the payment provider, not stored here.",
        ],
      },
      {
        heading: "Cash on Delivery",
        paragraphs: [
          "COD orders are subject to the COD Policy, including confirmation and order limits. Refusing a delivered COD parcel has a real cost, and we may decline COD on later orders.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "The EVOLVE name, the logo, the photographs and the site design belong to the brand or its licensors. You may not copy them for your own shop.",
        ],
      },
      {
        heading: "Liability and law",
        paragraphs: [
          "We are responsible for sending the piece you ordered, in the condition described. We are not liable for courier delays outside our control, or for how a piece wears if care instructions are ignored. These terms are governed by the laws of Pakistan.",
          reviewNote,
        ],
      },
    ],
  },
  {
    slug: "cod",
    title: "Cash on Delivery Policy",
    description: "Confirmation, limits and refused parcels for EVOLVE Cash on Delivery orders.",
    lede: "Cash on Delivery is the default way to pay. It depends on a confirmed address and someone being there to receive the parcel.",
    sections: [
      {
        heading: "Confirmation",
        paragraphs: [
          "We may confirm a COD order by phone or WhatsApp before it is packed. If we cannot reach you, the order stays on hold and may be cancelled. Please use a mobile number you answer.",
        ],
      },
      {
        heading: "Fee and limits",
        paragraphs: [
          `A COD fee of PKR ${site.codFee} is added on orders under the free-shipping threshold. It is waived at PKR ${site.freeShippingThreshold.toLocaleString("en-PK")} and above. COD is not offered on orders over PKR ${site.codMax.toLocaleString("en-PK")}. New customers may be asked to pay online for unusually large first orders.`,
        ],
      },
      {
        heading: "Refusal and RTO",
        paragraphs: [
          "If a parcel is refused, or it returns because no one was available, it is marked returned to origin. We may ask you to pay the courier cost before a replacement is sent, and we may turn COD off for that phone number.",
        ],
      },
      {
        heading: "Failed delivery",
        paragraphs: [
          "If the courier marks a delivery as failed, contact us with the order number. We can reattempt once. After that the parcel comes back, and a refund of any prepaid amount follows the Return Policy.",
        ],
      },
    ],
  },
];

export const infoPages: DocPage[] = [
  {
    slug: "about",
    title: "About",
    description: "EVOLVE is a premium unisex clothing house for women and men in Pakistan.",
    lede: "EVOLVE makes clothing for people who want to look considered without being costumed.",
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "We design co-ord sets, tracksuits, hoodies, sweatshirts and tops for women and men. The cloth is heavy enough to feel made, the colours stay in a warm neutral range, and the cuts are modest.",
        ],
      },
      {
        heading: "How we sell",
        paragraphs: [
          "Most of our customers are on a phone, and many prefer to pay when the parcel arrives. The shop is built for that: a fast checkout, Cash on Delivery, and a person on WhatsApp if you would rather ask than browse.",
        ],
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Reach EVOLVE on WhatsApp or by email for orders, sizing and exchanges.",
    lede: `We reply within about ${site.replyMinutes} minutes during ${site.supportHours}.`,
    sections: [
      {
        heading: "WhatsApp and email",
        paragraphs: [
          `WhatsApp: +${site.whatsapp}. Email: ${site.email}. Include your order number if you have one.`,
          "Replace the number and the email in the environment settings before launch. The values shipping with this build are placeholders.",
        ],
      },
    ],
  },
  {
    slug: "size-guide",
    title: "Size Guide",
    description: "Adult size charts for EVOLVE, in centimetres and inches.",
    lede: "Measure over light clothing, with the tape level. If you are between sizes, take the larger one.",
    sections: [
      {
        heading: "How to measure",
        paragraphs: [
          "Chest: around the fullest part, tape level. Waist: around the natural waist. Hip: around the fullest part.",
          "Unisex pieces follow the adult chart. Women who want a closer fit often take one size down. The chart is a guide, not a guarantee. Each product page notes the fit.",
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    description: "Answers on delivery, Cash on Delivery, exchanges and sizing.",
    lede: "Short answers to the questions we hear most. If yours is not here, send it on WhatsApp.",
    sections: [],
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "How long does delivery take?",
    answer:
      "We prepare orders in 1–2 working days. Metro cities then take about 2–4 days, major cities 3–5, and the rest of Pakistan 4–7.",
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer: `Yes. It is the default. A fee of PKR ${site.codFee} applies under the free-shipping threshold and is waived above PKR ${site.freeShippingThreshold.toLocaleString("en-PK")}. We may confirm the order on WhatsApp first.`,
  },
  {
    question: "Can I exchange a size?",
    answer: `Yes, within ${site.exchangeWindowDays} days, if the piece is unworn and the tags are on. Start the request from Track Order or WhatsApp.`,
  },
  {
    question: "Which payments can I use?",
    answer:
      "Cash on Delivery, bank transfer, and a card payment through a hosted page. The card page in this build is a sandbox until a gateway such as Safepay or PayFast is connected. We never store card numbers.",
  },
  {
    question: "How do I track an order?",
    answer: "Use Track Order with your order number and the mobile number on the order. You will also receive the tracking number once a courier is booked.",
  },
];

export function getPolicy(slug: string): DocPage | undefined {
  return policies.find((page) => page.slug === slug);
}

export function getInfoPage(slug: string): DocPage | undefined {
  return infoPages.find((page) => page.slug === slug);
}
