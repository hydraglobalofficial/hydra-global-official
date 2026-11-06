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
          "HYDRA delivers within Bangladesh. The estimate for your area is shared at checkout or by support. Courier delays can still happen.",
      },
      {
        question: "How much is shipping?",
        answer:
          "The delivery charge for your address is shown before you confirm the order. Any free-delivery offer states its own conditions.",
      },
      {
        question: "Which payment methods do you accept?",
        answer:
          "Cash on Delivery is available, and supported online payments are shown at checkout.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "Contact support with your order number before the order is dispatched. After dispatch, cancellation may no longer be possible.",
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
          "Contact us within 3 days of delivery if the product is damaged, defective, incorrect, incomplete, or different from its description. We do not accept returns only for a change of mind.",
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
