/* Web Glowup — change prices here only.
   The site builds: "From $199 up to $1,500. Price by quote."
   {from} and {max} already include the dollar sign.
   If the range moves a lot, check the round steps ($500, $1,000). */
window.WEB_GLOWUP = {
  priceFrom: 199,
  priceMax: 1500,
  currency: "USD",
  demoUrl: "./demo/",
  formEndpoint: "https://formspree.io/f/xxxxxxxx",
  email: "hello@web-glowup.com",
  budgetChoices: [
    { value: "entry", label: "Up to $500" },
    { value: "mid", label: "$500 to $1,000" },
    { value: "high", label: "$1,000 up to {max}" },
    { value: "open", label: "Not sure yet" },
  ],
};
