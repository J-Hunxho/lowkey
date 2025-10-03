export const copy = {
  banner: {
    ribbon: "Lowkey • Private Admit",
    headline: "The Vault opens softly.",
    sub: "150 keys only. Entry begins at $1,000. Proceed if you belong.",
    ctaPrimary: "Request Access",
    ctaSecondary: "Not today"
  },
  tiers: {
    founder: {
      productName: "Vault Key — Founder",
      price: 1000,
      cap: 100
    },
    inner: {
      productName: "Vault Key — Inner Circle",
      price: 5000,
      cap: 30
    }
  },
  checkoutBlurb:
    "You are securing a permanent credential in the Lowkey ecosystem. Keys are non-transferable at this stage. Refunds are not offered. Your purchase grants private admit, early access to Objects, and keyholder communications.",
  postPurchase: (n: number) =>
    `Welcome, Keyholder. You hold Vault Key #${n}. Keep this quiet. Next steps and private channels arrive shortly.`
};
