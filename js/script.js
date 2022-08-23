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

const packageEl = document.querySelector(".order-details-package");
const pricingEl = document.querySelector(".order-details-pricing");
const featuresEl = document.querySelector(".order-details-features");
const priceEl = document.querySelector(".order-details-price");
const discountEl = document.querySelector(".order-details-discount");

// FUNCTIONS
function renderPackages() {
  packages.forEach((pkg) => {
    let html = `
      <div class="pricing-package" data-id="${packages.indexOf(pkg)}">
        <div class="pricing-package-title">${pkg.title}</div>
        <div class="pricing-package-desc">
          1 month <span class="green">free</span>
        </div>
        <div class="pricing-package-pricing">
          <span>$${pkg.price}</span>
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

function updateOrderSummary(pkg) {
  let html = `
    <div class="package-info">
      <div class="package-name">${pkg.title} Package</div>
      <div class="package-pricing">
        <span>$${pkg.price}</span> /month after offer period
      </div>
    </div>
    <ul class="package-features">
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
  `;
  packageDetailsEl.innerHTML = "";
  packageDetailsEl.insertAdjacentHTML("afterbegin", html);
}

// EVENT LISTENERS
packagesEl.addEventListener("click", function (e) {
  const selectedPackageEl = e.target.closest(".pricing-package");
  if (!selectedPackageEl) return;

  const selectedPackage = packages.at(selectedPackageEl.dataset.id);
  updateOrderSummary(selectedPackage);
});
