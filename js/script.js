"use strict";

const packages = [
  {
    title: "Individual",
    price: 4.99,
    features: ["1 account", "Stream any content", "Unlimited streams"],
  },
  {
    title: "Family",
    price: 9.99,
    features: [
      "7 Premium accounts for family members living under one roof",
      "Block explicit content (Kids mode)",
      "Stream any content",
      "Unlimited streams",
    ],
  },
  {
    title: "Couple",
    price: 6.99,
    features: [
      "2 Premium accounts for a couple under one roof",
      "Stream any content",
      "Unlimited streams",
    ],
  },
];

const packagesEl = document.querySelector(".pricing-packages");
const packageDetailsEl = document.querySelector(".package-details");
const togglerEl = document.querySelector(".toggler");
let yearlyBilling = false;
let curPkg = packages.at(1);

const packageEl = document.querySelector(".order-details-package");
const pricingEl = document.querySelector(".order-details-pricing");
const featuresEl = document.querySelector(".order-details-features");
const priceEl = document.querySelector(".order-details-price");
const discountEl = document.querySelector(".order-details-discount");

// FUNCTIONS
function renderPackages() {
  packagesEl.innerHTML = "";
  packages.forEach((pkg) => {
    let html = `
      <div class="pricing-package" data-id="${packages.indexOf(pkg)}">
        <div class="pricing-package-title">${pkg.title}</div>
        <div class="pricing-package-desc">
          1 month <span class="free">free</span>
        </div>
        <div class="pricing-package-pricing">
          <span>$${
            yearlyBilling ? (0.8 * pkg.price).toFixed(2) : pkg.price
          }</span>
          <div>/month after offer period</div>
        </div>
        <ul class="pricing-package-features">
    `;
    pkg.features.forEach((feat) => {
      html += `
          <li class="package-feature">
            <span class="material-symbols-outlined"> check_circle </span>
            <div>${feat}</div>
          </li>
      `;
    });
    html += `
        </ul>
        <button class="btn choose-now">Choose Now</button>
        <div class="pricing-package-terms">
          Terms and conditions apply. 1 month free not available for users
          who have already tried Premium.
        </div>
      </div>
    `;
    packagesEl.insertAdjacentHTML("beforeend", html);
  });
}
renderPackages();

function updateOrderSummary() {
  let html = `
    <div class="package-info">
      <div class="package-name">${curPkg.title} Package</div>
      <div class="package-pricing">
        <span>$${
          yearlyBilling ? (0.8 * curPkg.price).toFixed(2) : curPkg.price
        }</span> /month after offer period
      </div>
    </div>
    <ul class="package-features">
    `;
  curPkg.features.forEach((feat) => {
    html += `
      <li class="package-feature">
        <span class="material-symbols-outlined"> check_circle </span>
        <div>${feat}</div>
      </li>
    `;
  });
  html += `
    </ul>
  `;
  packageDetailsEl.innerHTML = "";
  packageDetailsEl.insertAdjacentHTML("afterbegin", html);
}

function toggleBillingPeriod() {
  yearlyBilling = !yearlyBilling;
}

// EVENT LISTENERS
packagesEl.addEventListener("click", function (e) {
  const curPkgEl = e.target.closest(".pricing-package");
  if (!curPkgEl) return;

  curPkg = packages.at(curPkgEl.dataset.id);
  updateOrderSummary();
});

togglerEl.addEventListener("click", function () {
  this.querySelectorAll("img").forEach((img) => img.classList.toggle("hidden"));

  toggleBillingPeriod();
  renderPackages();
  updateOrderSummary();
});
