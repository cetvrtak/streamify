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

const heroSectionEl = document.querySelector(".hero");
const btnBecomePro = document.querySelector(".btn-become-pro");

const btnScrollToTop = document.querySelector(".btn-scroll");
const btnWidget = document.querySelector(".btn-widget");
const btnWidgetClose = document.querySelector(".widget-close");
const widgetEl = document.querySelector(".widget");
const widgetListEl = document.querySelector("#widget-list");

const btnGetDiscount = document.querySelector(".coupon-form-submit");
const couponEmailEl = document.querySelector("#email-coupon");

const commentsEl = document.querySelector(".comments-container");
const commentsLoadMoreEl = document.querySelector(".comments-load");

const streamersListEl = document.querySelector("#streamers-list");

const packagesEl = document.querySelector(".pricing-packages");
const orderDetailsEl = document.querySelector(".order-details");
const togglerEl = document.querySelector(".toggler");
let yearlyBilling = false;
let curPkg = packages.at(1);

let price, discount, total;
let discountRate = 0;

const orderFormSectionEl = document.querySelector(".order-form");
const firstnameEl = document.querySelector("#firstname");
const lastnameEl = document.querySelector("#lastname");
const addressEl = document.querySelector("#address");
const emailEl = document.querySelector("#email");
const cardEl = document.querySelector("#card");
const cvcEl = document.querySelector("#cvc");
const visibilityEl = document.querySelector(".visibility");
const expirationEl = document.querySelector("#expiration");
const couponEl = document.querySelector("#coupon");
const btnApply = document.querySelector(".btn-coupon-apply");
const btnSubmit = document.querySelector(".btn-submit");

/*** Validation regexes ***/
const emailValidationRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const modalEls = document.querySelectorAll(".modal");
const discountModalEl = document.querySelector("#discount-modal");
const welcomeModalEl = document.querySelector("#welcome-modal");
const btnGetCode = document.querySelector(".btn-get-code");
const overlayEl = document.querySelector(".overlay");
const modalCloseEls = document.querySelectorAll(".modal-close");

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
          1 month <span class="emphasize">free</span>
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
        <div class="order-title" id="order-title-mobile">
          Order summary
        </div>
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
          <div>$${discount.toFixed(2)}</div>
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
  orderDetailsEl.innerHTML = html;
}

function toggleBillingPeriod() {
  yearlyBilling = !yearlyBilling;
}

function updateBill() {
  price = yearlyBilling ? 12 * 0.8 * curPkg.price : curPkg.price;
  discount = Math.floor(100 * discountRate * price) / 100;
  total = price - discount;
}
updateBill();
updateOrderSummary();

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

  return (
    firstnameValid &&
    lastnameValid &&
    addressValid &&
    emailValid &&
    cardValid &&
    cvcValid &&
    expirationValid
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
function openModal(modal) {
  modal.classList.remove("hidden");
  overlayEl.classList.remove("hidden");
  bodyEl.style.overflow = "hidden";
}

function closeModals() {
  modalEls.forEach((modal) => modal.classList.add("hidden"));
  overlayEl.classList.add("hidden");
  bodyEl.style.overflow = "auto";
}

/*** Streamers ***/
import { users as staticUsers } from "./users.js";
let users;
async function fetchUsers() {
  try {
    // const response = await fetch(
    //   "https://mockend.com/Infomedia-bl/fake-api/users"
    // );
    // if (!response.ok) throw new Error("Failed to fetch users 👽");

    // return await response.json();
    return staticUsers;
  } catch (err) {
    console.error(err, err.message);
  }
}

async function renderStreamersList(listEl, streamers) {
  if (!streamers) {
    // Fetch streamers and store into the "users" array
    users = streamers = await fetchUsers();
  }

  listEl.innerHTML = "";

  streamers.forEach((user) => {
    let html = `
      <div class="streamer">
        <div class="streamer-image">
          <img
            src="${user.avatarUrl}"
            alt="${user.name}'s Avatar"
            class="streamer-avatar ${user.activity}-avatar"
          />
          <div class="streamer-status-icon ${user.activity}-icon"></div>
        </div>
        <div class="streamer-info">
          <div class="streamer-details">
            <span class="streamer-name">${user.name}</span>
            <span class="streamer-email"
              >${user.email}</span
            >
          </div>
          <div class="streamer-status ${
            user.activity
          }-status">${user.activity[0].toUpperCase()}${user.activity.slice(
      1
    )}</div>
        </div>
      </div>
    `;
    listEl.insertAdjacentHTML("beforeend", html);
  });
}
// Not passing the "users" argument to force fetchUsers()
renderStreamersList(streamersListEl);

/*** Comments ***/
// let comments;
import { comments } from "./comments.js";
let commCounter = 0;
async function fetchComments() {
  try {
    // const response = await fetch(
    //   "https://mockend.com/Infomedia-bl/fake-api/comments"
    // );
    // if (!response.ok) throw new Error("Failed to fetch comments 🍕");

    // comments = await response.json();
    renderFiveComments();
  } catch (err) {
    console.error(err, err.message);
  }
}
fetchComments();

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
async function getCoupon() {
  try {
    const body = {
      email: localStorage.user,
      couponType: 1,
      couponSubtype: 1,
      value: 50,
    };
    const response = await fetch(
      "https://ossam.info/darkog/public/api/v1/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) throw new Error("Failed to get coupon code 💲");

    const data = await response.json();
    const coupon = data.data;
    if (coupon.status) console.log(coupon.code);

    return coupon;
  } catch (err) {
    console.error(err, err.message);
  }
}

function displayCouponSuccessMsg() {
  const title = document.querySelector(".modal-title");
  const desc = document.querySelector(".modal-desc");

  title.textContent = "Congratulations!";
  desc.textContent = "Your coupon has been delivered to your email adress.";
  couponEmailEl.closest(".input-container").classList.add("invisible");
  btnGetDiscount.value = "Done";
}

async function validateCoupon() {
  try {
    // 1. Get email and code
    const email = emailEl.value;
    const code = couponEl.value;

    // 2. Check if current email matches localStorage user mail (for potential subsequent changes)
    if (!validate(emailEl, emailValidationRegex)) return;

    // 3. Validate code (on Backend)
    const body = { email, code };
    const response = await fetch(
      "https://ossam.info/darkog/public/api/v1/use",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) throw new Error("Unable to validate coupon code 🙉");

    const data = await response.json();
    // const data = { status: true, message: "Success" };

    if (data.status) {
      //    I. Apply discount
      discountRate = 0.5;
      updateBill();
      updateOrderSummary();
      //    II. Give user feedback (optional)
      //    III. Clear warning
      validate(couponEl, /\w+/);
    } else {
      //    I. Update warning message
      const couponContainerEl = couponEl.closest(".input-container");
      const validationEl = couponContainerEl.querySelector(".validation-text");
      validationEl.textContent = data.message;
      //    II. Activate warning field
      // using ^\b$ regex that always fails
      validate(couponEl, /^\b$/);
    }
  } catch (err) {
    console.error(err.message);
  }
}

function scrollToSection() {
  this.scrollIntoView({ behavior: "smooth" });
}

// EVENT LISTENERS
window.addEventListener("load", function () {
  localStorage.user
    ? (emailEl.value = localStorage.user)
    : openModal(discountModalEl);
});

btnBecomePro.addEventListener(
  "click",
  scrollToSection.bind(orderFormSectionEl)
);

packagesEl.addEventListener("click", function (e) {
  const chooseNowEl = e.target.closest(".choose-now");
  if (!chooseNowEl) return;

  const curPkgEl = e.target.closest(".pricing-package");

  curPkg = packages.at(curPkgEl.dataset.id);
  updateBill();
  updateOrderSummary();

  scrollToSection.call(orderFormSectionEl);
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

  console.log([
    firstnameEl.value,
    lastnameEl.value,
    addressEl.value,
    emailEl.value,
    cardEl.value,
    cvcEl.value,
    expirationEl.value,
    couponEl.value,
  ]);

  openModal(welcomeModalEl);
});

overlayEl.addEventListener("click", closeModals);
modalCloseEls.forEach((modal) => modal.addEventListener("click", closeModals));
btnGetCode.addEventListener("click", function () {
  // Generate another coupon for this user (email address) don’t forget about that part also.
  getCoupon();
  closeModals();
});

/*** Comments  ***/
commentsLoadMoreEl.addEventListener("click", renderFiveComments);

/*** Coupon ***/
btnGetDiscount.addEventListener("click", async function (e) {
  e.preventDefault();

  // Button value is alrady set to Done, so we're done here!
  if (localStorage.user) {
    closeModals();
    return;
  }

  const isEmailValid = validate(couponEmailEl, emailValidationRegex);
  if (!isEmailValid) return;

  emailEl.value = localStorage.user = couponEmailEl.value;

  const coupon = await getCoupon();

  displayCouponSuccessMsg();
});

btnApply.addEventListener("click", validateCoupon);

/*** Widget ***/
btnWidget.addEventListener("click", function () {
  const activeUsers = users
    .filter((user) => user.activity != "offline")
    .sort((a, b) => (a.activity < b.activity ? -1 : 1));
  renderStreamersList(widgetListEl, activeUsers);
  widgetEl.classList.remove("hidden");
  bodyEl.classList.add("no-scroll");
});

btnWidgetClose.addEventListener("click", function () {
  widgetEl.classList.add("hidden");
  bodyEl.classList.remove("no-scroll");
});
btnScrollToTop.addEventListener("click", scrollToSection.bind(heroSectionEl));
