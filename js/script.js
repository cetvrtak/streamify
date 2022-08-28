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

const bodyEl = document.querySelector("body");

const btnGetDiscount = document.querySelector(".coupon-form-submit");
const couponEmailEl = document.querySelector("#email-coupon");

const commentsEl = document.querySelector(".comments-container");
const commentsLoadMoreEl = document.querySelector(".comments-load");

const packagesEl = document.querySelector(".pricing-packages");
const orderDetailsEl = document.querySelector(".order-details");
const togglerEl = document.querySelector(".toggler");
let yearlyBilling = false;
let curPkg = packages.at(1);

let price = yearlyBilling ? 12 * 0.8 * curPkg.price : curPkg.price;
let discount = 0;
let total = (1 - discount) * price;

const firstnameEl = document.querySelector("#firstname");
const lastnameEl = document.querySelector("#lastname");
const addressEl = document.querySelector("#address");
const emailEl = document.querySelector("#email");
const cardEl = document.querySelector("#card");
const cvcEl = document.querySelector("#cvc");
const visibilityEl = document.querySelector(".visibility");
const expirationEl = document.querySelector("#expiration");
const couponEl = document.querySelector("#coupon");
const btnSubmit = document.querySelector(".btn-submit");

/*** Validation regexes ***/
const emailValidationRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const modalEl = document.querySelector(".modal");
const overlayEl = document.querySelector(".overlay");
const modalCloseEl = document.querySelector(".modal-close");

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
    <div class="package-details">
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
    </div>
    <div class="order-details-tab">
      <div class="order-details-cost">
        <div class="order-details-price listing">
          <span>Price:</span>
          <div>$${price.toFixed(2)}</div>
        </div>
        <div class="order-details-discount listing">
          <span>Discount:</span>
          <div>$${(discount * price).toFixed(2)}</div>
        </div>
      </div>
      <hr class="separator" />
      <div class="order-details-total listing">
        <span>Total:</span>
        <div>$${total.toFixed(2)}</div>
      </div>
    </div>
  </div>
  `;
  orderDetailsEl.innerHTML = "";
  orderDetailsEl.insertAdjacentHTML("afterbegin", html);
}

function toggleBillingPeriod() {
  yearlyBilling = !yearlyBilling;
}

function updateBill() {
  price = yearlyBilling ? 12 * 0.8 * curPkg.price : curPkg.price;
  total = (1 - discount) * price;
}

/*** Validation ***/
function validateForm() {
  const firstnameValid = validate(firstnameEl, /^[a-zA-Z]{3,20}$/);
  const lastnameValid = validate(lastnameEl, /^[a-zA-Z]{3,20}$/);
  const addressValid = validate(
    addressEl,
    /^[a-zA-Z0-9\s\.]+ (\d|b{2})+([\,\s\w]+)?$/
  );
  const emailValid = validate(emailEl, emailValidationRegex);
  const cardValid = validate(cardEl, /^((\d{4})[''\s-]?){4}$/);
  const cvcValid = validate(cvcEl, /^\d{3,4}$/);
  const expirationValid = validate(expirationEl, /^\d{2}[/]\d{2}$/);
  const couponValid = validate(couponEl, /^\w+$/);

  return (
    firstnameValid &&
    lastnameValid &&
    addressValid &&
    emailValid &&
    cardValid &&
    cvcValid &&
    expirationValid &&
    couponValid
  );
}

function validate(el, regex) {
  const isTestPassed = regex.test(el.value);
  // If test not passed - display error message
  if (!isTestPassed) {
    el.closest(".input-container")
      .querySelector(".validation-box")
      .classList.remove("invisible");
  } else {
    el.closest(".input-container")
      .querySelector(".validation-box")
      .classList.add("invisible");
  }
  return isTestPassed;
}

/*** Modal ***/
function closeModal() {
  modalEl.classList.add("hidden");
  overlayEl.classList.add("hidden");
  bodyEl.style.overflow = "auto";
}

/*** Comments ***/
let comments;
async function fetchComments() {
  try {
    const response = await fetch(
      "https://mockend.com/Infomedia-bl/fake-api/comments"
    );
    if (!response.ok) throw new Error("Failed to fetch comments 🍕");

    comments = await response.json();
    renderFiveComments();
  } catch (err) {
    console.error(err, err.message);
  }
}
fetchComments();

let commCounter = 0;
function renderFiveComments() {
  if (commCounter > comments.length) return;

  const nextFiveComments = comments.slice(commCounter, commCounter + 5);

  const locale = navigator.language;
  nextFiveComments.forEach((comment) => {
    const date = new Date(comment.postedAt);
    const dateFormatted = new Intl.DateTimeFormat(locale).format(date);
    const html = `
      <figure class="comment-box">
        <img
          src="${comment.avatarUrl}"
          alt="${comment.name}'s Avatar"
          class="comment-author-avatar"
        />
        <div class="comment-author-details">
          <span class="comment-author-name">${comment.name}</span>
          <span class="comment-author-email">${comment.email}</span>
        </div>
        <div class="comment-date-container">
          <div class="comment-date-box">
            <span class="material-symbols-outlined comment-calendar-icon">
              calendar_today
            </span>
            <span class="comment-date">${dateFormatted}</span>
          </div>
        </div>
        <p class="comment-author-text">${comment.comment}</p>
      </figure>
    `;
    commentsEl.insertAdjacentHTML("beforeend", html);
    commCounter++;
  });
}

/*** Coupon ***/
function getCouponCode(email) {
  return "asD$j7";
}

// EVENT LISTENERS
packagesEl.addEventListener("click", function (e) {
  const chooseNowEl = e.target.closest(".choose-now");
  if (!chooseNowEl) return;

  const curPkgEl = e.target.closest(".pricing-package");

  curPkg = packages.at(curPkgEl.dataset.id);
  updateBill();
  updateOrderSummary();
});

togglerEl.addEventListener("click", function () {
  this.querySelectorAll("img").forEach((img) => img.classList.toggle("hidden"));

  toggleBillingPeriod();
  updateBill();
  renderPackages();
  updateOrderSummary();
});

cvcEl.addEventListener("click", function () {
  visibilityEl.classList.remove("hidden");
});

visibilityEl.addEventListener("click", function () {
  this.querySelectorAll("span").forEach((el) => el.classList.toggle("hidden"));

  cvcEl.type == "password" ? (cvcEl.type = "text") : (cvcEl.type = "password");
});

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  console.log(firstnameEl.value);
  console.log(lastnameEl.value);
  console.log(addressEl.value);
  console.log(emailEl.value);
  console.log(cardEl.value);
  console.log(cvcEl.value);
  console.log(expirationEl.value);
  console.log(couponEl.value);
});

overlayEl.addEventListener("click", closeModal);
modalCloseEl.addEventListener("click", closeModal);

/*** Comments  ***/
commentsLoadMoreEl.addEventListener("click", renderFiveComments);

/*** Coupon ***/
btnGetDiscount.addEventListener("click", function (e) {
  e.preventDefault();
  const isEmailValid = validate(couponEmailEl, emailValidationRegex);
  if (!isEmailValid) return;

  emailEl.value = localStorage.user = couponEmailEl.value;
  closeModal();

  const couponCode = getCouponCode(localStorage.user);
  if (couponCode) couponEl.value = couponCode;
});
