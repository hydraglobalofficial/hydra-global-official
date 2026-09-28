export type FaqItem = { question: string; answer: string };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "orders",
    title: "Orders & Delivery",
    items: [
      { question: "How long does delivery take?", answer: "Inside Dhaka we deliver within 24–48 hours. Outside Dhaka, delivery takes 2–4 business days through our courier partners." },
      { question: "How much is shipping?", answer: "৳70 inside Dhaka and ৳130 outside Dhaka. Orders over ৳1,500 ship free anywhere in Bangladesh." },
      { question: "Which payment methods do you accept?", answer: "Cash on Delivery is available nationwide today. bKash, Nagad and card payments via SSLCommerz are being rolled out." },
      { question: "Can I change or cancel my order?", answer: "Yes — contact support with your order number before it ships and we'll update or cancel it at no cost." },
    ],
  },
  {
    id: "product",
    title: "Product & Compatibility",
    items: [
      { question: "Will it work with my case?", answer: "Yes. Every HYDRA protector is cut slightly inside the screen edge so it works with virtually all cases, including rugged ones." },
      { question: "Does it support the in-display fingerprint sensor?", answer: "Our Samsung protectors are certified with ultrasonic fingerprint readers. Register your fingerprint again after installation for best accuracy." },
      { question: "What's the difference between Clear, Privacy and Matte?", answer: "Clear offers maximum clarity. Privacy darkens the screen beyond a 30° viewing angle. Matte reduces glare and fingerprints with a paper-like feel." },
      { question: "Does it affect Face ID or the front camera?", answer: "No. Cut-outs and optical-grade glass keep sensors fully functional." },
    ],
  },
  {
    id: "authenticity",
    title: "Authenticity",
    items: [
      { question: "How do I know my HYDRA is genuine?", answer: "Buy only from hydra.com.bd or an authorised HYDRA retailer. Genuine products come in sealed packaging with a unique authenticity code on every box." },
      { question: "I think I received a counterfeit. What should I do?", answer: "Contact support with your order number and a photo of the packaging. We'll check it against our records and replace anything that isn't genuine." },
    ],
  },
  {
    id: "warranty",
    title: "Warranty & Returns",
    items: [
      { question: "What does the warranty cover?", answer: "12 months against manufacturing defects such as lifting edges, adhesive failure or dead zones. One free replacement is included for accidental cracks within 30 days." },
      { question: "What is your return policy?", answer: "Unopened products can be returned within 7 days for a full refund. Opened products are covered by warranty replacement." },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((g) => g.items);
