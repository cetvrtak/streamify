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
const widgetListEl = document.querySelector(".streamers-list");

const btnGetDiscount = document.querySelector(".coupon-form-submit");
const couponEmailEl = document.querySelector("#email-coupon");

const commentsEl = document.querySelector(".comments-container");
const commentsLoadMoreEl = document.querySelector(".comments-load");

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
let users;
async function fetchUsers() {
  try {
    const response = await fetch(
      "https://mockend.com/Infomedia-bl/fake-api/users"
    );
    if (!response.ok) throw new Error("Failed to fetch users 👽");

    // users = await response.json();
    users = [
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=78358",
        email: "#jjnte@enwrx.ss",
        id: 1,
        name: "Matthew",
        statusMessage: "reading book",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=43188",
        email: "#ghlryc@vcnvt.it",
        id: 2,
        name: "Carl",
        statusMessage: "watching TV",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=50770",
        email: "#mydcvo@lvegf.wz",
        id: 3,
        name: "Larry",
        statusMessage: "watching TV",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=39257",
        email: "#smisxxw@kuhzj.yy",
        id: 4,
        name: "Jack",
        statusMessage: "watching TV",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=35771",
        email: "#odulxtg@bjpwc.oo",
        id: 5,
        name: "Ty",
        statusMessage: "reading book",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=38274",
        email: "#alimxip@ktsdy.xw",
        id: 6,
        name: "Ben",
        statusMessage: "watching TV",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=62422",
        email: "#nddfwwd@ywmva.sg",
        id: 7,
        name: "Paul",
        statusMessage: "playing games",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=09382",
        email: "#ecuzcvaw@tlgto.ud",
        id: 8,
        name: "George",
        statusMessage: "working from home",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=22807",
        email: "#aouqhg@ayxna.oe",
        id: 9,
        name: "Monte",
        statusMessage: "playing games",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=52271",
        email: "#phnvxd@qrufl.wd",
        id: 10,
        name: "Tim",
        statusMessage: "playing games",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=53599",
        email: "#tzevegax@dgjet.sa",
        id: 11,
        name: "Victor",
        statusMessage: "playing games",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=02365",
        email: "#pzyyhd@wxwop.vk",
        id: 12,
        name: "Thomas",
        statusMessage: "teaching programming",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=76396",
        email: "#qixtwvg@emaow.av",
        id: 13,
        name: "Adam",
        statusMessage: "working from home",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=40542",
        email: "#mophr@qkjqq.yr",
        id: 14,
        name: "Peter",
        statusMessage: "playing games",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=80674",
        email: "#ocvwfgu@rnfyp.dm",
        id: 15,
        name: "Tim",
        statusMessage: "watching TV",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=78995",
        email: "#ferrnk@yateg.go",
        id: 16,
        name: "Thomas",
        statusMessage: "reading book",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=69457",
        email: "#nhvvab@fkvyj.pj",
        id: 17,
        name: "Paul",
        statusMessage: "working from home",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=85458",
        email: "#pjzwav@mcvgq.xi",
        id: 18,
        name: "Monte",
        statusMessage: "reading book",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=94550",
        email: "#yyspqhsa@sklyc.jd",
        id: 19,
        name: "Monte",
        statusMessage: "watching TV",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=73535",
        email: "#ydnfhpf@txyrd.wc",
        id: 20,
        name: "Paul",
        statusMessage: "exercising",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=97502",
        email: "#gtohjs@rdgex.qh",
        id: 21,
        name: "Hank",
        statusMessage: "working from home",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=60773",
        email: "#bxcfubr@ntwgw.ah",
        id: 22,
        name: "Nathan",
        statusMessage: "reading book",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=20159",
        email: "#gzvcokn@fyzze.vu",
        id: 23,
        name: "Ike",
        statusMessage: "playing games",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=91943",
        email: "#ysqombr@prhkp.yj",
        id: 24,
        name: "Walter",
        statusMessage: "working from home",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=31065",
        email: "#cjusjolk@eijxl.rm",
        id: 25,
        name: "Adam",
        statusMessage: "exercising",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=33457",
        email: "#sslkf@gtfkn.lr",
        id: 26,
        name: "Matthew",
        statusMessage: "exercising",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=56358",
        email: "#bthuul@mtsqe.yv",
        id: 27,
        name: "Thomas",
        statusMessage: "working from home",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=82670",
        email: "#qiwjkk@tuaww.ef",
        id: 28,
        name: "Dan",
        statusMessage: "watching TV",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=39024",
        email: "#idehlvp@gtjhl.wh",
        id: 29,
        name: "Edward",
        statusMessage: "reading book",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=40690",
        email: "#kqnytxbij@pqnyd.ew",
        id: 30,
        name: "Fred",
        statusMessage: "playing games",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=87882",
        email: "#tgajrh@xszpt.mi",
        id: 31,
        name: "Thomas",
        statusMessage: "exercising",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=95521",
        email: "#cqhbaft@gcgdm.uv",
        id: 32,
        name: "Nathan",
        statusMessage: "exercising",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=83499",
        email: "#ebcsd@emxhp.kn",
        id: 33,
        name: "John",
        statusMessage: "teaching programming",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=97489",
        email: "#zhphemi@mhrcs.gu",
        id: 34,
        name: "Larry",
        statusMessage: "teaching programming",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=80343",
        email: "#lpytif@zovmv.nd",
        id: 35,
        name: "Hank",
        statusMessage: "reading book",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=83949",
        email: "#oxsphhd@pairs.je",
        id: 36,
        name: "Frank",
        statusMessage: "exercising",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=60468",
        email: "#xgmgov@ydgeq.kb",
        id: 37,
        name: "Nathan",
        statusMessage: "working from home",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=50378",
        email: "#gdiip@pwjfu.ox",
        id: 38,
        name: "John",
        statusMessage: "playing games",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=93513",
        email: "#zptwwhak@vkltg.mf",
        id: 39,
        name: "Matthew",
        statusMessage: "exercising",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=48831",
        email: "#kyypp@dcvjz.tu",
        id: 40,
        name: "David",
        statusMessage: "watching TV",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=13589",
        email: "#nlrfxc@dopvi.pk",
        id: 41,
        name: "Alex",
        statusMessage: "watching TV",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=97448",
        email: "#wscmg@vcvth.lh",
        id: 42,
        name: "Frank",
        statusMessage: "working from home",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=52532",
        email: "#yzbzxo@qnlrf.st",
        id: 43,
        name: "Monte",
        statusMessage: "watching TV",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=76470",
        email: "#kvslkd@gfdbr.de",
        id: 44,
        name: "Joe",
        statusMessage: "reading book",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=80171",
        email: "#uckgpr@xllsk.rf",
        id: 45,
        name: "Joe",
        statusMessage: "teaching programming",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=84991",
        email: "#rwyhf@nfwql.ko",
        id: 46,
        name: "Aaron",
        statusMessage: "exercising",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=40995",
        email: "#pxjpqpy@yuqfd.ks",
        id: 47,
        name: "Edward",
        statusMessage: "reading book",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=25899",
        email: "#rfgcgfc@skotz.jj",
        id: 48,
        name: "Peter",
        statusMessage: "playing games",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=82246",
        email: "#leozw@dtshp.pk",
        id: 49,
        name: "Thomas",
        statusMessage: "watching TV",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=41672",
        email: "#xawireq@nqzdz.he",
        id: 50,
        name: "David",
        statusMessage: "watching TV",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=35494",
        email: "#cjjduh@juwvv.xt",
        id: 51,
        name: "Monte",
        statusMessage: "playing games",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=60787",
        email: "#dbyeapa@gbjka.vq",
        id: 52,
        name: "John",
        statusMessage: "working from home",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=49294",
        email: "#wpttzv@ozxft.te",
        id: 53,
        name: "Thomas",
        statusMessage: "teaching programming",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=69630",
        email: "#dzxys@vjkjv.vz",
        id: 54,
        name: "Tim",
        statusMessage: "teaching programming",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=17447",
        email: "#qftvt@ceqac.fp",
        id: 55,
        name: "Joe",
        statusMessage: "working from home",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=27434",
        email: "#fyzkbettq@qxtii.nq",
        id: 56,
        name: "Peter",
        statusMessage: "playing games",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=81090",
        email: "#hbpohz@degjm.ek",
        id: 57,
        name: "Roger",
        statusMessage: "exercising",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=94237",
        email: "#dwjejc@dbiij.ry",
        id: 58,
        name: "Ike",
        statusMessage: "exercising",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=68755",
        email: "#aebwio@txoay.pi",
        id: 59,
        name: "Otto",
        statusMessage: "watching TV",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=44355",
        email: "#zlrjan@rwuqb.fo",
        id: 60,
        name: "Ben",
        statusMessage: "reading book",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=00771",
        email: "#oijkhmm@tssnr.va",
        id: 61,
        name: "Aaron",
        statusMessage: "reading book",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=91735",
        email: "#vghio@bbghj.td",
        id: 62,
        name: "Thomas",
        statusMessage: "watching TV",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=63511",
        email: "#rlitfvt@hiotj.fh",
        id: 63,
        name: "Otto",
        statusMessage: "working from home",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=51539",
        email: "#cveia@sfmos.fz",
        id: 64,
        name: "Paul",
        statusMessage: "teaching programming",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=53887",
        email: "#fbgbky@pxudb.dv",
        id: 65,
        name: "Nathan",
        statusMessage: "reading book",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=61049",
        email: "#qqxxe@hkbcl.xk",
        id: 66,
        name: "Hal",
        statusMessage: "working from home",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=43132",
        email: "#vlovcph@ootnb.ey",
        id: 67,
        name: "Otto",
        statusMessage: "exercising",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=05795",
        email: "#vuovmnx@cmexj.lv",
        id: 68,
        name: "Hank",
        statusMessage: "teaching programming",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=13992",
        email: "#wirzq@merzz.hv",
        id: 69,
        name: "Peter",
        statusMessage: "exercising",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=30071",
        email: "#kxtdykq@shitw.dg",
        id: 70,
        name: "Carl",
        statusMessage: "playing games",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=19711",
        email: "#farqkztr@yeijt.la",
        id: 71,
        name: "Tim",
        statusMessage: "exercising",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=12630",
        email: "#khmoes@evmly.sf",
        id: 72,
        name: "Edward",
        statusMessage: "exercising",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=57666",
        email: "#sedqz@uatgo.cw",
        id: 73,
        name: "Paul",
        statusMessage: "exercising",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=25790",
        email: "#ryrtpelq@iwiiq.sf",
        id: 74,
        name: "Tim",
        statusMessage: "teaching programming",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=94475",
        email: "#tixwhtf@bbzqi.bz",
        id: 75,
        name: "Peter",
        statusMessage: "watching TV",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=29185",
        email: "#rgbmomk@jyyxi.vb",
        id: 76,
        name: "Mark",
        statusMessage: "working from home",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=03852",
        email: "#iwffypwv@kzali.wh",
        id: 77,
        name: "Frank",
        statusMessage: "working from home",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=45649",
        email: "#jvsrwhq@xirhk.if",
        id: 78,
        name: "Steve",
        statusMessage: "playing games",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=81207",
        email: "#spmvgcu@dhmfb.db",
        id: 79,
        name: "Peter",
        statusMessage: "working from home",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=39791",
        email: "#emwoo@pzmxn.tl",
        id: 80,
        name: "David",
        statusMessage: "playing games",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=27697",
        email: "#axystuz@egxvx.an",
        id: 81,
        name: "Hank",
        statusMessage: "reading book",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=35570",
        email: "#qdzqmodh@krxuu.ly",
        id: 82,
        name: "Edward",
        statusMessage: "exercising",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=95717",
        email: "#duwzbwk@zzesl.jp",
        id: 83,
        name: "Otto",
        statusMessage: "exercising",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=35422",
        email: "#aahgyf@hgsdc.ma",
        id: 84,
        name: "Jack",
        statusMessage: "playing games",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=53606",
        email: "#dxkkau@ggevb.gx",
        id: 85,
        name: "Adam",
        statusMessage: "working from home",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=54270",
        email: "#hxuad@bmhwh.uu",
        id: 86,
        name: "Nathan",
        statusMessage: "watching TV",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=48454",
        email: "#xlmohl@oskvw.dp",
        id: 87,
        name: "David",
        statusMessage: "watching TV",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=96733",
        email: "#kydhgdl@gxabs.xl",
        id: 88,
        name: "Thomas",
        statusMessage: "playing games",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=02357",
        email: "#poxyyjr@whbbb.lf",
        id: 89,
        name: "Roger",
        statusMessage: "teaching programming",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=87434",
        email: "#kdpgciex@ikrbs.nb",
        id: 90,
        name: "Dan",
        statusMessage: "exercising",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=07035",
        email: "#aoysylla@smrxw.ju",
        id: 91,
        name: "Mark",
        statusMessage: "reading book",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=20003",
        email: "#rmthls@bztdp.mr",
        id: 92,
        name: "Dan",
        statusMessage: "watching TV",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=26833",
        email: "#cusuns@ynpjt.jt",
        id: 93,
        name: "Fred",
        statusMessage: "reading book",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=76797",
        email: "#hepjehi@pxwsk.wb",
        id: 94,
        name: "Aaron",
        statusMessage: "teaching programming",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=06272",
        email: "#ztxdu@jqkyz.uz",
        id: 95,
        name: "Carl",
        statusMessage: "teaching programming",
      },
      {
        activity: "offline",
        avatarUrl: "https://i.pravatar.cc/150?u=02745",
        email: "#peppj@jibew.zp",
        id: 96,
        name: "Larry",
        statusMessage: "watching TV",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=30258",
        email: "#dwibtn@tlfag.ln",
        id: 97,
        name: "Victor",
        statusMessage: "teaching programming",
      },
      {
        activity: "online",
        avatarUrl: "https://i.pravatar.cc/150?u=59085",
        email: "#knjqja@ccyah.gy",
        id: 98,
        name: "Roger",
        statusMessage: "playing games",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=20859",
        email: "#mgqnffj@guxua.vn",
        id: 99,
        name: "David",
        statusMessage: "exercising",
      },
      {
        activity: "streaming",
        avatarUrl: "https://i.pravatar.cc/150?u=00735",
        email: "#hdkmkhws@myato.ln",
        id: 100,
        name: "George",
        statusMessage: "reading book",
      },
    ];

    renderStreamersList();
  } catch (err) {
    console.error(err, err.message);
  }
}

function renderStreamersList() {
  widgetListEl.innerHTML = "";
  const activeUsers = users
    .filter((user) => user.activity != "offline")
    .sort((a, b) => (a.activity < b.activity ? -1 : 1));

  activeUsers.forEach((user) => {
    let html = `
      <div class="widget-user">
        <div class="widget-user-image">
          <img
            src="${user.avatarUrl}"
            alt="${user.name}'s Avatar"
            class="widget-user-avatar ${user.activity}-avatar"
          />
          <div class="widget-user-status-icon ${user.activity}-icon"></div>
        </div>
        <div class="widget-user-info">
          <div class="widget-user-details">
            <span class="widget-user-name">${user.name}</span>
            <span class="widget-user-email"
              >${user.email}</span
            >
          </div>
          <div class="widget-user-status ${
            user.activity
          }-status">${user.activity[0].toUpperCase()}${user.activity.slice(
      1
    )}</div>
        </div>
      </div>
    `;
    widgetListEl.insertAdjacentHTML("beforeend", html);
  });
}

/*** Comments ***/
let comments;
async function fetchComments() {
  try {
    const response = await fetch(
      "https://mockend.com/Infomedia-bl/fake-api/comments"
    );
    if (!response.ok) throw new Error("Failed to fetch comments 🍕");

    // comments = await response.json();
    comments = [
      {
        avatarUrl: "https://i.pravatar.cc/150?u=24452",
        comment:
          "Ea voluptatibus, praesentium tempore, voluptatibus distinctio, reprehenderit unde nam earum. Consequuntur ea voluptate, explicabo a a perspiciatis blanditiis a placeat excepturi.",
        email: "#qsgemwc@hoitj.jf",
        id: 1,
        name: "Monte",
        postedAt: "2013-10-14T11:37:56Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=65543",
        comment:
          "Nemo obcaecati sint adipisci quo, similique esse nesciunt porro a a aspernatur ut. Reprehenderit reiciendis a, consequuntur repellat, molestias molestias voluptatem.",
        email: "#hpiios@jhtob.nx",
        id: 2,
        name: "Carl",
        postedAt: "2017-07-19T17:09:07Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=64836",
        comment:
          "Aliquid quisquam officia dignissimos rerum, a consequuntur ea dicta id a, ad voluptatem a, quaerat consectetur voluptatibus voluptates, aperiam ducimus.",
        email: "#gtiqvh@bqovq.da",
        id: 3,
        name: "Ike",
        postedAt: "2011-12-10T01:10:09Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=87819",
        comment:
          "Soluta pariatur rerum, reprehenderit nihil a dignissimos ab, sit numquam mollitia. Expedita id vitae blanditiis a, beatae aliquam aliquam, consequuntur a perspiciatis eos.",
        email: "#yrzqzwk@pbowz.jo",
        id: 4,
        name: "Otto",
        postedAt: "2020-02-24T01:57:35Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=89042",
        comment:
          "Voluptatibus blanditiis corrupti deserunt quas, distinctio laboriosam fugiat. Libero reiciendis, reprehenderit quam vero a, accusantium corporis, at enim laboriosam perspiciatis nesciunt.",
        email: "#mqnolrk@dvatq.ln",
        id: 5,
        name: "Ben",
        postedAt: "2018-03-01T03:25:39Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=69731",
        comment:
          "Consectetur reprehenderit distinctio, ipsam a a accusantium a mollitia a dolorem, repudiandae id a, excepturi et fuga quam ad adipisci a.",
        email: "#bmotdor@hvrwd.uc",
        id: 6,
        name: "George",
        postedAt: "2015-08-10T12:55:51Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=17368",
        comment:
          "Dolorem reprehenderit perspiciatis quidem alias, neque non nulla, cupiditate repellendus rem architecto dolores.",
        email: "#poljoa@zmygx.jz",
        id: 7,
        name: "Monte",
        postedAt: "2017-05-23T19:51:11Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=08185",
        comment:
          "Voluptatibus reprehenderit veritatis ipsa, quo dolorum placeat quidem voluptatum non quis. Suscipit a alias modi dolore, possimus ea consequuntur eos, rem praesentium a, id a consequuntur.",
        email: "#dgxpjd@zfied.fe",
        id: 8,
        name: "Ike",
        postedAt: "2015-12-25T07:19:25Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=43292",
        comment:
          "Incidunt consequatur a reprehenderit est, consectetur numquam a, ducimus quam voluptatibus a, beatae nulla explicabo.",
        email: "#dctov@dpmcu.ld",
        id: 9,
        name: "Adam",
        postedAt: "2012-12-06T22:02:00Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=06613",
        comment:
          "Reprehenderit ab, veritatis deserunt at voluptatibus reprehenderit, hic iure voluptatem. Quia magnam libero, libero a a officiis doloribus eveniet, saepe a repellat ea deleniti.",
        email: "#gsnefdck@edsqe.ky",
        id: 10,
        name: "David",
        postedAt: "2020-12-09T00:00:05Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=96466",
        comment:
          "Aperiam cum recusandae rem, dignissimos quidem, id dignissimos suscipit quae quo in excepturi eius. Repudiandae perferendis officiis incidunt modi, reprehenderit a dolore consequuntur est.",
        email: "#kpsdi@tlcfg.ny",
        id: 11,
        name: "Ike",
        postedAt: "2019-05-08T02:20:45Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=01985",
        comment:
          "Excepturi reprehenderit error, adipisci fugiat pariatur itaque, aliquam perspiciatis. Ut corrupti reprehenderit, a perferendis aliquid odit quo a in mollitia, voluptatibus ab quis et a vel quos.",
        email: "#caabcc@baifv.xl",
        id: 12,
        name: "Jack",
        postedAt: "2018-10-24T11:44:42Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=86883",
        comment:
          "Assumenda et dignissimos laborum a, animi enim repudiandae consequuntur a a, nihil a explicabo reprehenderit a enim modi in in at.",
        email: "#nhtqz@ovpho.vq",
        id: 13,
        name: "Carl",
        postedAt: "2010-09-19T11:06:23Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=69012",
        comment:
          "Eum praesentium deleniti fugit, qui quo rem sint a soluta numquam, molestias a accusamus nam, a voluptates a quo modi molestias illum, cumque error deleniti a.",
        email: "#actsbrb@wybli.zv",
        id: 14,
        name: "Mark",
        postedAt: "2020-01-08T11:51:10Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=89546",
        comment:
          "Perferendis consequatur libero reprehenderit in, reprehenderit veritatis id, rem a id facilis perferendis voluptatibus ad libero.",
        email: "#fwknau@nojqt.cs",
        id: 15,
        name: "Roger",
        postedAt: "2013-12-09T01:46:08Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=46889",
        comment:
          "Neque a consequuntur earum a officiis, voluptatibus vero explicabo, quod in maxime. A a suscipit ad a reiciendis a consectetur a, veniam similique laboriosam ab dignissimos, cumque magni qui.",
        email: "#vmoboyc@itrqd.wf",
        id: 16,
        name: "Carl",
        postedAt: "2010-12-21T08:06:47Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=69819",
        comment:
          "Repellendus eligendi a reprehenderit in, ut soluta cumque, inventore recusandae a, temporibus natus sit a obcaecati, enim a molestiae molestias nemo ad facere.",
        email: "#xvseda@wyhuh.nx",
        id: 17,
        name: "Peter",
        postedAt: "2013-07-24T22:18:16Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=15850",
        comment:
          "Reprehenderit reiciendis, a odit temporibus numquam, voluptate ratione a, ab ex reprehenderit a labore, reprehenderit eum excepturi.",
        email: "#lddxvbxe@bdrbu.dx",
        id: 18,
        name: "Fred",
        postedAt: "2017-01-18T09:19:37Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=21912",
        comment:
          "Dignissimos enim, itaque vero maiores, cum assumenda fuga eveniet quidem, voluptatum nihil ut cumque, cupiditate quae consectetur fugiat illo.",
        email: "#vpzcve@nyeki.sv",
        id: 19,
        name: "Carl",
        postedAt: "2022-06-21T23:53:22Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=75769",
        comment:
          "Ipsam quo voluptate quidem ab a, ea voluptatibus dolore adipisci fugiat magnam. Reprehenderit eum adipisci soluta, eius reprehenderit reiciendis, repudiandae modi amet laborum, ab a dicta excepturi.",
        email: "#mryiw@huftx.yn",
        id: 20,
        name: "Thomas",
        postedAt: "2022-01-24T19:56:47Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=11845",
        comment:
          "Sed qui molestias voluptatem perspiciatis, ut iste quis reprehenderit incidunt facere eum, accusamus incidunt.",
        email: "#pyazcig@qqjiz.qf",
        id: 21,
        name: "Roger",
        postedAt: "2016-12-01T09:33:27Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=47693",
        comment:
          "Nobis obcaecati aperiam molestiae accusantium, quidem nostrum eum, porro saepe ex possimus a, dolor voluptate eum sit.",
        email: "#prnalmad@srajy.qs",
        id: 22,
        name: "Roger",
        postedAt: "2014-11-07T11:23:33Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=47587",
        comment:
          "Id libero aspernatur dolore, perspiciatis repudiandae nam, possimus dignissimos quo, voluptatibus hic consequuntur sequi, maxime accusamus corporis.",
        email: "#luedrwv@tjcfn.su",
        id: 23,
        name: "Victor",
        postedAt: "2010-05-22T02:40:52Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=47768",
        comment:
          "Perferendis veritatis quo a, amet omnis deleniti a distinctio, voluptatibus facere consequuntur. Atque doloremque inventore voluptates a, ullam a consequuntur dignissimos soluta.",
        email: "#uanrc@koguh.md",
        id: 24,
        name: "Thomas",
        postedAt: "2014-11-23T17:24:34Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=60682",
        comment:
          "Magnam a ratione ab ratione, corrupti numquam aut fugiat corrupti dolorum qui a. Itaque debitis ipsa perferendis quaerat, ducimus rerum cupiditate numquam perspiciatis libero.",
        email: "#nqdqzc@viegv.jp",
        id: 25,
        name: "Matthew",
        postedAt: "2022-08-16T01:37:12Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=43609",
        comment:
          "Quasi quisquam impedit, porro sint molestias, a animi explicabo officia harum modi sunt in, laborum expedita.",
        email: "#uffrvr@aqqjv.if",
        id: 26,
        name: "Victor",
        postedAt: "2021-09-19T01:22:02Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=52732",
        comment:
          "Sapiente atque a perspiciatis iste officiis a, facilis consequuntur libero. Provident a id facere, quisquam quas dicta officia natus, consequuntur reprehenderit in, rem labore facilis eum.",
        email: "#rwwyvez@rjbem.sq",
        id: 27,
        name: "David",
        postedAt: "2019-06-22T18:54:38Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=88042",
        comment:
          "Consequuntur nam at sapiente ea rem, reprehenderit iste consequuntur, a veritatis reprehenderit cumque impedit a, sit ipsam dolore nulla, excepturi et hic.",
        email: "#azlcn@jfehv.wo",
        id: 28,
        name: "Adam",
        postedAt: "2020-10-23T09:48:19Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=66800",
        comment:
          "Possimus eligendi dicta a sint possimus sit, nisi dicta molestiae consequuntur ad ad assumenda. Vitae accusantium beatae ipsum a, ducimus corporis animi ad, sapiente hic aperiam.",
        email: "#gjkwiehq@ufocn.kq",
        id: 29,
        name: "Adam",
        postedAt: "2010-06-12T23:31:29Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=25483",
        comment:
          "Laudantium provident voluptatem ipsum nostrum, hic expedita dolores, beatae sit sapiente quibusdam sint.",
        email: "#zvfxvvir@lsgra.yb",
        id: 30,
        name: "George",
        postedAt: "2022-02-07T22:54:23Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=25313",
        comment:
          "Dolore et reprehenderit voluptas, a reiciendis nemo delectus in quos debitis a, voluptate in consequuntur ratione veniam cum ad, consequuntur a ab a cum excepturi at.",
        email: "#xmeokhc@habvs.rm",
        id: 31,
        name: "Larry",
        postedAt: "2016-07-29T00:15:10Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=26671",
        comment:
          "Vero eveniet tempore, vero dolores molestias consequuntur a ea, excepturi veritatis consequatur. Enim provident consectetur dolorum, voluptatem laudantium in, reprehenderit voluptatem sequi veniam.",
        email: "#wdmpvvb@gqhft.zi",
        id: 32,
        name: "Thomas",
        postedAt: "2011-04-14T18:21:47Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=47950",
        comment:
          "Reprehenderit reprehenderit reprehenderit sit et, voluptatem minima, necessitatibus. Voluptatibus quas dolorum vero error doloribus, autem hic accusamus praesentium reiciendis a dolorem iure.",
        email: "#rsrswved@fexpk.og",
        id: 33,
        name: "Carl",
        postedAt: "2017-12-06T16:24:22Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=27211",
        comment:
          "Beatae deleniti a quidem omnis vel unde minus, quasi vitae iste, perspiciatis ipsam rerum cupiditate.",
        email: "#nynfz@mrutd.pz",
        id: 34,
        name: "Aaron",
        postedAt: "2015-12-12T16:37:13Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=80285",
        comment:
          "Aperiam aliquam a a at perferendis, quos obcaecati reprehenderit et, sint blanditiis, ad dicta tempore incidunt.",
        email: "#mnjtqf@efuux.iv",
        id: 35,
        name: "Alex",
        postedAt: "2016-02-02T05:28:34Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=66955",
        comment:
          "Ex minima a praesentium a, sapiente ullam delectus sed in perspiciatis voluptatibus. Maiores dolore sit eaque quo reprehenderit, a accusantium quibusdam, ducimus blanditiis reprehenderit placeat ea.",
        email: "#syzsdk@oamxc.ig",
        id: 36,
        name: "Nathan",
        postedAt: "2016-09-30T11:26:21Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=21958",
        comment:
          "A doloribus hic, placeat suscipit consectetur a ad quo, laboriosam incidunt, dolore molestias. Fugiat molestias ea reprehenderit repudiandae, repellendus quia recusandae nostrum ad reprehenderit in.",
        email: "#ltmxguj@lcywd.py",
        id: 37,
        name: "Thomas",
        postedAt: "2010-04-25T13:14:34Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=93912",
        comment:
          "A iste illum consequuntur, ea officiis perspiciatis a ex illum, provident eligendi a reprehenderit harum, possimus doloribus.",
        email: "#esyzov@bvaoy.sv",
        id: 38,
        name: "Frank",
        postedAt: "2011-12-14T20:08:52Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=94529",
        comment:
          "Voluptatibus voluptates, assumenda consequuntur reiciendis, eligendi repellendus, excepturi est obcaecati reprehenderit fuga.",
        email: "#zxorum@jttlq.de",
        id: 39,
        name: "Roger",
        postedAt: "2012-06-09T08:07:02Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=33800",
        comment:
          "Enim reprehenderit reprehenderit reprehenderit, vel labore maiores omnis nemo. Laudantium quia a, libero at velit sed, obcaecati in tempora ut, voluptate reprehenderit facere.",
        email: "#rkxskbee@ycsna.ow",
        id: 40,
        name: "Otto",
        postedAt: "2021-07-16T09:06:27Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=48339",
        comment:
          "Sapiente quidem rerum, alias perferendis accusamus expedita, rem at ipsam voluptate ab. Reprehenderit assumenda id, hic eligendi voluptatibus adipisci, sit quae voluptatum quis.",
        email: "#txqme@msljr.jm",
        id: 41,
        name: "Alex",
        postedAt: "2013-11-16T03:00:05Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=33470",
        comment:
          "Sed praesentium, expedita in animi a cum, accusantium provident dolore necessitatibus, deleniti vero dicta.",
        email: "#qiyiawd@ophrp.wh",
        id: 42,
        name: "John",
        postedAt: "2012-04-29T19:56:28Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=14789",
        comment:
          "A quaerat ea a eligendi, laudantium accusantium omnis iste eum velit a et, rem veniam omnis, pariatur pariatur repudiandae.",
        email: "#trfndy@gtktf.la",
        id: 43,
        name: "Fred",
        postedAt: "2016-08-02T18:44:30Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=63260",
        comment:
          "Voluptatibus voluptatum id, expedita ex deserunt veritatis ab officia, tempora eos a vitae voluptatum.",
        email: "#wnjwkm@hfsad.jj",
        id: 44,
        name: "Victor",
        postedAt: "2021-05-01T22:23:35Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=85881",
        comment:
          "Reprehenderit distinctio, id quis voluptatem ea, voluptatibus quisquam, non consequuntur sapiente itaque fugiat praesentium a.",
        email: "#gxdog@rnwsf.qi",
        id: 45,
        name: "Paul",
        postedAt: "2019-03-15T08:12:27Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=43106",
        comment:
          "Quae veniam tempora architecto omnis, obcaecati illum vero vitae eaque maxime hic, id reprehenderit a obcaecati, magnam a vel adipisci at a.",
        email: "#zsjchkz@pmttx.xw",
        id: 46,
        name: "Ben",
        postedAt: "2012-11-17T02:45:05Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=99060",
        comment:
          "Nulla illum molestiae officiis assumenda et, quae reprehenderit a eius minima, sint voluptatibus sed ex eum aut eos.",
        email: "#yvags@pztpb.sy",
        id: 47,
        name: "Edward",
        postedAt: "2021-08-30T14:49:20Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=16981",
        comment:
          "Repudiandae a non, illo omnis magnam consectetur eligendi, qui sapiente rem, maxime a officia fugiat, consequuntur maxime qui.",
        email: "#aqopbow@tokdp.cg",
        id: 48,
        name: "Steve",
        postedAt: "2011-07-29T12:12:59Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=35220",
        comment:
          "Eos repudiandae quisquam nisi, autem a reprehenderit iusto minus temporibus. Officiis a laboriosam provident a quos iure a, deleniti a quis obcaecati reprehenderit deserunt ex.",
        email: "#zwkrfn@yarhh.sk",
        id: 49,
        name: "Steve",
        postedAt: "2015-02-15T02:57:07Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=82763",
        comment:
          "At commodi ad voluptatem hic, aliquam perspiciatis facere, aperiam fugiat reprehenderit a consequuntur repudiandae.",
        email: "#mfuktuw@hhepc.rl",
        id: 50,
        name: "Steve",
        postedAt: "2014-03-18T06:32:48Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=69851",
        comment:
          "Similique rem sed quisquam aut qui a deserunt, reprehenderit a aperiam a provident, a officia cupiditate voluptate, consequuntur reiciendis nostrum.",
        email: "#ydysjz@ggbzy.fk",
        id: 51,
        name: "Jack",
        postedAt: "2010-11-12T11:11:02Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=96810",
        comment:
          "Enim reprehenderit odio, omnis odit minus at, a eum dignissimos quasi sed laudantium rem, perspiciatis magni, ducimus praesentium quo deserunt excepturi.",
        email: "#okaywh@abajx.ph",
        id: 52,
        name: "Alex",
        postedAt: "2010-04-14T17:59:59Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=57431",
        comment:
          "Reprehenderit est nemo, reprehenderit in, aspernatur a explicabo, a reprehenderit a nemo, asperiores quod ea.",
        email: "#upeydiam@lseza.kv",
        id: 53,
        name: "Edward",
        postedAt: "2017-06-21T20:58:06Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=04328",
        comment:
          "Animi saepe veritatis molestiae a quod, ullam reprehenderit odio a officia, ipsam est alias eius, modi optio magni a veniam, reprehenderit nisi illum in consequuntur illo.",
        email: "#puczc@wcgmk.zy",
        id: 54,
        name: "Hank",
        postedAt: "2017-08-27T11:27:41Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=20615",
        comment:
          "Assumenda maxime, eum quidem ab consectetur sunt adipisci, velit qui hic id, excepturi a rerum, quisquam voluptatibus fugit eum a, illo veniam ratione.",
        email: "#asteqst@cgkkr.zw",
        id: 55,
        name: "Ben",
        postedAt: "2018-06-07T20:00:42Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=05532",
        comment:
          "A consequuntur quidem reprehenderit minima nulla, reprehenderit enim voluptate, reprehenderit corporis sit sunt a, nam reprehenderit, qui odio eaque.",
        email: "#ndlzr@caipu.zn",
        id: 56,
        name: "Roger",
        postedAt: "2021-09-19T14:56:41Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=76105",
        comment:
          "Id labore exercitationem, a reprehenderit non a, aspernatur praesentium dolores, dignissimos quo possimus quos, esse repellendus assumenda accusantium sed.",
        email: "#vsyweak@npxkv.sn",
        id: 57,
        name: "Dan",
        postedAt: "2013-06-08T13:02:39Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=41607",
        comment:
          "Veniam explicabo quidem debitis, ratione id inventore esse est, incidunt velit accusamus consequuntur.",
        email: "#pkypkp@fcibw.cs",
        id: 58,
        name: "Ben",
        postedAt: "2020-12-21T10:49:50Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=51399",
        comment:
          "Blanditiis quis a ratione dignissimos natus at, explicabo a in a, dolor consectetur, nam reprehenderit quos at a unde, consequuntur qui repellat voluptatum nam.",
        email: "#zlctkj@cuqoz.vy",
        id: 59,
        name: "Tim",
        postedAt: "2021-09-28T00:46:15Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=44208",
        comment:
          "Officia esse reprehenderit consectetur, iusto ea nam qui sed vitae unde, recusandae reprehenderit voluptates incidunt a, obcaecati aut rem.",
        email: "#cenlhndpi@hwwum.wh",
        id: 60,
        name: "Tim",
        postedAt: "2022-06-03T02:08:49Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=03416",
        comment:
          "At quidem reprehenderit soluta quibusdam, sint beatae sunt commodi corporis. Voluptatibus sapiente minus, reprehenderit similique a culpa, ab suscipit non consequuntur id ipsam delectus.",
        email: "#kwbocpe@irwcy.xy",
        id: 61,
        name: "Joe",
        postedAt: "2010-03-26T14:00:47Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=90545",
        comment:
          "Voluptatem ut quibusdam commodi quaerat nulla, quidem accusantium doloremque. Ex adipisci illo voluptate consectetur, accusantium velit, eos quam dolorem a.",
        email: "#dcjtsq@xogyw.vi",
        id: 62,
        name: "Peter",
        postedAt: "2019-11-03T16:47:53Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=16978",
        comment:
          "Placeat reprehenderit tempora ea, tenetur officiis, dolorum dignissimos reiciendis ea, cupiditate illo, eum consequuntur in.",
        email: "#qaeah@sszva.wb",
        id: 63,
        name: "Thomas",
        postedAt: "2011-11-28T03:08:39Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=38832",
        comment:
          "Labore a reprehenderit illo quae, accusantium vel, itaque asperiores reprehenderit ad, quisquam voluptate ea id, impedit illum id.",
        email: "#usyefj@wtudj.fi",
        id: 64,
        name: "Dan",
        postedAt: "2010-09-26T11:47:31Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=16662",
        comment:
          "Ad inventore exercitationem, dignissimos omnis a aliquam, laboriosam reprehenderit quisquam, cumque illum repudiandae a, repellat accusantium.",
        email: "#kwqbfs@ymchr.ew",
        id: 65,
        name: "Nathan",
        postedAt: "2012-11-17T21:23:05Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=22364",
        comment:
          "Reprehenderit voluptatum, atque aperiam ipsa a reprehenderit qui magni, mollitia a adipisci accusamus sed quos.",
        email: "#ebexyzir@foonm.zd",
        id: 66,
        name: "Joe",
        postedAt: "2014-07-28T07:25:47Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=62748",
        comment:
          "Eligendi ut reprehenderit maxime ut, minima consequuntur repellendus sit aspernatur a, distinctio pariatur fugiat perferendis at, a officiis vitae.",
        email: "#iqsazb@fvekh.vd",
        id: 67,
        name: "Alex",
        postedAt: "2014-11-03T19:51:12Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=32210",
        comment:
          "Similique voluptatibus soluta ut a, quisquam a a cum harum, quidem odit aliquid ut. Consequuntur expedita ipsa reprehenderit a, quam reprehenderit consequuntur sit, perferendis corporis.",
        email: "#vhmjkkwi@ggmsf.zx",
        id: 68,
        name: "Larry",
        postedAt: "2010-02-22T18:29:56Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=98762",
        comment:
          "Debitis quae repudiandae non a, voluptatibus veniam ad, id voluptatibus illum reprehenderit at. Culpa molestias eius, repellendus adipisci, enim architecto dolore fugiat cum quod fugit.",
        email: "#oxomnlhh@tjjtl.ib",
        id: 69,
        name: "Dan",
        postedAt: "2019-02-04T14:19:18Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=59732",
        comment:
          "Accusamus in perspiciatis illo quam a, maxime praesentium, doloremque ea adipisci. Qui pariatur a sed sed, reprehenderit aut quaerat, praesentium inventore voluptate.",
        email: "#ekkfc@jayzf.it",
        id: 70,
        name: "Roger",
        postedAt: "2011-06-15T01:35:56Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=33952",
        comment:
          "Rerum accusamus nostrum optio, accusantium consequuntur reprehenderit optio dicta a. Voluptatibus ea voluptate, reprehenderit esse illum, perspiciatis ut, officia accusamus ut a magnam a.",
        email: "#lvuybem@rlfgb.sh",
        id: 71,
        name: "Alex",
        postedAt: "2010-11-09T21:11:04Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=20738",
        comment:
          "A consequuntur illum ab dolore, fugiat asperiores atque a ea soluta, voluptates ex ex ea. Consequuntur quis sunt quo qui quis amet, delectus consequuntur praesentium temporibus.",
        email: "#cdmjknq@apeej.xo",
        id: 72,
        name: "Adam",
        postedAt: "2018-06-07T07:45:05Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=47136",
        comment:
          "Voluptatibus sapiente cum corrupti sapiente, nostrum id ex assumenda a, nisi exercitationem, architecto possimus, quidem nam corporis architecto.",
        email: "#xiukxtlh@wjkhn.wb",
        id: 73,
        name: "Frank",
        postedAt: "2013-03-16T11:41:57Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=04798",
        comment:
          "Ad voluptatibus, quo eligendi molestias voluptate, libero ipsum quas, porro distinctio praesentium a incidunt.",
        email: "#wqtkdk@owgna.eh",
        id: 74,
        name: "George",
        postedAt: "2012-10-26T22:27:30Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=65371",
        comment:
          "Quo perferendis ipsa rem fuga non, odit perspiciatis magni quae reprehenderit ut in odio. Quos distinctio vero et facilis quisquam, accusamus voluptatibus ex consequuntur deserunt.",
        email: "#aexfsdb@uitlk.uv",
        id: 75,
        name: "Peter",
        postedAt: "2010-02-14T16:09:56Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=00879",
        comment:
          "Consequuntur a enim perspiciatis cupiditate, quibusdam et quo, perspiciatis a quisquam autem voluptatem ipsa, ea facilis aliquid.",
        email: "#ebjaf@ysgtf.mi",
        id: 76,
        name: "Roger",
        postedAt: "2014-09-30T19:21:51Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=25983",
        comment:
          "Quasi accusamus eius, quam eos labore asperiores ad, laborum in deleniti, a quibusdam voluptatibus possimus a totam, accusantium maxime.",
        email: "#exrxl@iskul.eh",
        id: 77,
        name: "Fred",
        postedAt: "2013-08-10T01:04:13Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=61830",
        comment:
          "Laudantium doloribus dolorum, quo reprehenderit non minus labore libero non facere. Consequuntur consequuntur ut asperiores, reprehenderit a, quidem a eveniet, maiores veritatis consequatur.",
        email: "#ppcqv@uphnx.ln",
        id: 78,
        name: "Thomas",
        postedAt: "2021-07-12T00:15:06Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=79800",
        comment:
          "A tempore totam ad voluptatibus voluptates in, reprehenderit a pariatur ad dolore, voluptatem voluptate maxime a, dolorem tenetur.",
        email: "#apdik@rysni.vm",
        id: 79,
        name: "Nathan",
        postedAt: "2013-01-17T09:06:46Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=74077",
        comment:
          "A accusamus similique porro quod a accusantium ab, odio culpa quidem perspiciatis quas a. Soluta incidunt reprehenderit expedita magnam a, voluptatibus hic perferendis a consequuntur incidunt.",
        email: "#frbute@mdtjy.zn",
        id: 80,
        name: "Roger",
        postedAt: "2021-02-07T07:19:35Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=40556",
        comment:
          "Accusantium deserunt a, dolores quibusdam voluptas ex ex, sit a cupiditate id a. Modi mollitia tempora adipisci suscipit a, numquam distinctio libero, eveniet suscipit.",
        email: "#xrrwpxl@qmdck.kl",
        id: 81,
        name: "Victor",
        postedAt: "2016-02-26T03:05:38Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=93072",
        comment:
          "Reprehenderit reprehenderit eaque, corrupti saepe vel a, ab doloribus sint ut repellendus aliquam. Et eveniet dolorum nam perspiciatis autem hic a, animi magnam perspiciatis debitis esse tempore.",
        email: "#hojcnwwm@jgoan.rk",
        id: 82,
        name: "Joe",
        postedAt: "2017-01-13T14:43:58Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=45419",
        comment:
          "Qui perspiciatis nam, a facilis distinctio a dolores ratione a, reprehenderit a. Fugiat repudiandae maxime iusto excepturi ex iure, corrupti modi voluptatibus a asperiores id, iusto consequatur cum.",
        email: "#ewjcndw@vfxmd.tm",
        id: 83,
        name: "John",
        postedAt: "2012-04-26T08:37:46Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=73898",
        comment:
          "Itaque quasi saepe alias alias labore a, amet ratione dolor a a voluptatibus, accusantium est consectetur reiciendis.",
        email: "#ttwbdyz@luuve.lp",
        id: 84,
        name: "Fred",
        postedAt: "2010-03-13T05:51:30Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=92342",
        comment:
          "Eos nostrum distinctio minima vel, officia qui non, accusantium odio a a enim cum ducimus a. Maxime reprehenderit voluptatibus optio rem aut, rem consectetur laborum sunt.",
        email: "#qnoce@xzldk.sg",
        id: 85,
        name: "Aaron",
        postedAt: "2011-08-27T21:40:01Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=86857",
        comment:
          "Itaque eos eos blanditiis consequuntur ex, qui corporis a in repellat illum fugiat, id magnam nesciunt, iusto quibusdam exercitationem, debitis dolorum.",
        email: "#iqnbk@bcvee.jz",
        id: 86,
        name: "Aaron",
        postedAt: "2013-05-16T20:12:29Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=37304",
        comment:
          "Error quis eos voluptas magnam a, perspiciatis aut, hic a quasi a distinctio. A molestias magnam a, quis obcaecati sit facilis, doloremque nulla, at dolore natus minima, reprehenderit eius.",
        email: "#cbznxy@jvaco.ua",
        id: 87,
        name: "Fred",
        postedAt: "2022-06-12T00:22:35Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=22060",
        comment:
          "Impedit expedita nesciunt dolor laborum, aut ut sapiente quia expedita, nisi eos ullam a dolorem. Maxime eveniet adipisci, maxime reprehenderit a, voluptatum id eligendi soluta.",
        email: "#itykfj@lhqeq.yi",
        id: 88,
        name: "Mark",
        postedAt: "2012-10-19T01:47:04Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=16560",
        comment:
          "Ullam praesentium a dolore quas, non repudiandae a dolorum reprehenderit a, in mollitia temporibus maxime, maiores amet sint et.",
        email: "#usbea@ctyxm.dx",
        id: 89,
        name: "Dan",
        postedAt: "2018-06-09T23:44:27Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=29486",
        comment:
          "Alias voluptatem quidem minima, id cum dignissimos minima iste magnam, veniam veniam veniam, eligendi magnam, dolorem enim a.",
        email: "#ypalcqd@skmdy.vz",
        id: 90,
        name: "Ike",
        postedAt: "2011-10-19T11:59:36Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=83853",
        comment:
          "Accusantium consequuntur reprehenderit, provident distinctio ut repellat vitae in. Asperiores recusandae et inventore quibusdam, a reprehenderit, fugit sapiente doloremque ullam quo cum.",
        email: "#wbazv@ivdef.ct",
        id: 91,
        name: "Frank",
        postedAt: "2016-10-04T08:27:54Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=75809",
        comment:
          "Voluptatibus iste assumenda hic a, laudantium voluptatum nemo velit placeat aut, quibusdam quaerat, voluptates nam.",
        email: "#tymwmxl@rubsa.xs",
        id: 92,
        name: "Paul",
        postedAt: "2016-12-11T08:23:15Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=26427",
        comment:
          "Fugiat voluptatibus vel a dolore doloremque a at, praesentium ratione dolorem, a consequuntur deleniti fuga, excepturi ea consequatur a, aut dolores ea.",
        email: "#fsjwxc@mvzid.tv",
        id: 93,
        name: "Nathan",
        postedAt: "2015-09-11T13:10:22Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=55461",
        comment:
          "Reprehenderit a, eum amet dolorum, dignissimos repudiandae libero provident a, cupiditate illum, minima optio fugiat ex enim voluptatibus id.",
        email: "#dmpqpdo@ikxhr.co",
        id: 94,
        name: "Dan",
        postedAt: "2013-10-03T16:38:31Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=10019",
        comment:
          "Quasi provident quia doloribus sit exercitationem, voluptatum totam, natus accusantium laborum voluptatem officiis, unde accusamus voluptate debitis ipsa.",
        email: "#jujrej@wexyf.bo",
        id: 95,
        name: "Otto",
        postedAt: "2010-03-19T06:34:40Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=90152",
        comment:
          "Quidem similique, sed aliquam quam reprehenderit a porro, perspiciatis sit. Repudiandae accusantium, commodi ex quo consectetur officiis, saepe quo sit necessitatibus.",
        email: "#ndorniwh@rbaka.sz",
        id: 96,
        name: "Matthew",
        postedAt: "2013-02-04T20:44:33Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=19440",
        comment:
          "Repudiandae iusto aspernatur a sequi placeat, quos facere sint unde, libero consequuntur, saepe expedita numquam itaque.",
        email: "#cuiuz@yhdiq.sp",
        id: 97,
        name: "Mark",
        postedAt: "2015-01-19T06:45:28Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=09740",
        comment:
          "Voluptatibus consectetur ex, atque quam quasi id cumque, id quos tenetur ex a deserunt. Reprehenderit consequuntur nulla ea provident, consequatur repellat, ad a quasi officiis.",
        email: "#dvsgwjw@ufnko.uv",
        id: 98,
        name: "Victor",
        postedAt: "2017-10-10T07:30:56Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=55051",
        comment:
          "Similique ex reprehenderit, reprehenderit quis in quo incidunt, aspernatur consectetur aliquam placeat id, aliquam veniam reprehenderit incidunt.",
        email: "#ffynnczi@hvaum.fw",
        id: 99,
        name: "Ben",
        postedAt: "2017-11-01T23:57:55Z",
      },
      {
        avatarUrl: "https://i.pravatar.cc/150?u=62042",
        comment:
          "Laborum provident magni suscipit aut ut, a illo voluptatibus a ipsum, officia vitae itaque a. Doloremque ab perspiciatis necessitatibus, a nostrum blanditiis repudiandae soluta, assumenda quae.",
        email: "#dplxge@nxdys.za",
        id: 100,
        name: "Ty",
        postedAt: "2018-01-18T13:24:34Z",
      },
    ];
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
  fetchUsers();
  widgetEl.classList.remove("hidden");
  bodyEl.classList.add("no-scroll");
});

btnWidgetClose.addEventListener("click", function () {
  widgetEl.classList.add("hidden");
  bodyEl.classList.remove("no-scroll");
});
btnScrollToTop.addEventListener("click", scrollToSection.bind(heroSectionEl));
