export type FaqItem = { question: string; answer: string };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "orders",
    title: "Orders & Delivery",
    items: [
      {
        question: "How long does delivery take?",
        answer:
          "Express hub cities usually arrive in 2–4 business days. Standard shipping elsewhere typically takes 4–8 business days through our courier partners.",
      },
      {
        question: "How much is shipping?",
        answer:
          "Express hubs ship from $8 and standard shipping from $14. Orders over $80 ship free worldwide.",
      },
      {
        question: "Which payment methods do you accept?",
        answer:
          "Pay on delivery is available in selected markets today. Card and online wallet payments are rolling out next.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "Yes — contact support with your order number before it ships and we'll update or cancel it at no cost.",
      },
    ],
  },
  {
    id: "product",
    title: "Product & Compatibility",
    items: [
      {
        question: "Will it work with my case?",
        answer:
          "Yes. Every HYDRA protector is cut slightly inside the screen edge so it works with virtually all cases, including rugged ones.",
      },
      {
        question: "Does it support the in-display fingerprint sensor?",
        answer:
          "Our Samsung protectors are certified with ultrasonic fingerprint readers. Register your fingerprint again after installation for best accuracy.",
      },
      {
        question: "What's the difference between Clear, Privacy and Matte?",
        answer:
          "Clear offers maximum clarity. Privacy darkens the screen beyond a 30° viewing angle. Matte reduces glare and fingerprints with a paper-like feel.",
      },
      {
        question: "Does it affect Face ID or the front camera?",
        answer: "No. Cut-outs and optical-grade glass keep sensors fully functional.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & replacements",
    items: [
      {
        question: "What is your return policy?",
        answer:
          "Unopened products can be returned within 7 days of delivery for a full refund. Contact support if a product arrives damaged or defective.",
      },
      {
        question: "How do I request a replacement?",
        answer:
          "Message support with your order number and a clear photo of the issue. Approved replacements are shipped as soon as we confirm.",
      },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((g) => g.items);
