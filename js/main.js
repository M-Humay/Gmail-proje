

import { categories, months } from "./constants.js";
import { renderCategories, renderMails, showModal } from "./ui.js";
const body = document.querySelector("body");
const btn = document.getElementById("toggle");
const createMailBtn = document.querySelector(".create");
const closeMailBtn = document.querySelector("#close-btn");
const modal = document.querySelector(".modal-wrapper");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navigation = document.querySelector("nav");
const form = document.querySelector("#create-mail-form");
const mailsArea = document.querySelector(".mails-area");
const searchButton = document.querySelector("#search-icon");
const searchInput = document.querySelector("#search-input");
const categoryArea = document.querySelector(".nav-middle");

const strMailData = localStorage.getItem("data");
const mailData = JSON.parse(strMailData) || [];
document.addEventListener("DOMContentLoaded", () => {
  renderMails(mailsArea, mailData);
});
searchButton.addEventListener("click", searchMails);

mailsArea.addEventListener("click", updateMail);

hamburgerMenu.addEventListener("click", hideMenu);

function hideMenu() {
  navigation.classList.toggle("hide");
}
function getDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const updateMonth = months[month - 1];

  return day + " " + updateMonth;
}


createMailBtn.addEventListener("click", () => showModal(modal, true));
closeMailBtn.addEventListener("click", () => showModal(modal, false));
form.addEventListener("submit", sendMail);


window.addEventListener("resize", (e) => {
  const width = e.target.innerWidth;
  if (width < 1100) {
    navigation.classList.add("hide");
  } else {
    navigation.classList.remove("hide");
  }
});
categoryArea.addEventListener("click", watchCategory);
btn.addEventListener("click", () => {
  btn.classList.toggle("active");
  body.classList.toggle("darkMode");
});

function sendMail(e) {
  e.preventDefault();
  const receiver = e.target[0].value;
  const title = e.target[1].value;
  const message = e.target[2].value;
  if (!receiver || !title || !message) {
    Toastify({
      text: "Formu doldurunuz !",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true, 
      style: {
        background: "#FDCC00",
        borderRadius: "10px",
      },
      onClick: function () {}, 
    }).showToast();
    return;
  }
  const nemMail = {
    id: new Date().getTime(),
    sender: "Yusuf",
    receiver, 
    title,
    message,
    stared: false,
    date: getDate(),
  };
  mailData.unshift(nemMail);
  const strData = JSON.stringify(mailData);
  localStorage.setItem("data", strData);
  renderMails(mailsArea, mailData);
  showModal(modal, false);
  e.target[0].value = "";
  e.target[1].value = "";
  e.target[2].value = "";
  Toastify({
    text: "Mail başarıyla gönderildi",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", 
    position: "right", 
    stopOnFocus: true, 
    style: {
      background: "#24BB33",
      borderRadius: "10px",
    },
    onClick: function () {}, 
  }).showToast();
}

function updateMail(e) {
  if (e.target.classList.contains("bi-trash")) {
    const mail = e.target.parentElement.parentElement.parentElement;
    const mailId = mail.dataset.id;
    const filtredData = mailData.filter((i) => i.id != mailId);
    const strData = JSON.stringify(filtredData);
    localStorage.removeItem("data");
    localStorage.setItem("data", strData);
    mail.remove();
  }
  if (e.target.classList.contains("bi-star")) {
    const mail = e.target.closest(".mail");
    const mailId = mail.dataset.id;
    const foundItem = mailData.find((i) => i.id == mailId);
    const updateItem = { ...foundItem, stared: !foundItem.stared };
    const index = mailData.findIndex((i) => i.id == mailId);
    mailData[index] = updateItem;

    localStorage.setItem("data", JSON.stringify(mailData));

    renderMails(mailsArea, mailData);
  }
  if (e.target.classList.contains("bi-star-fill")) {
    const mail = e.target.parentElement.parentElement;
    console.log(mail);
    const mailId = mail.dataset.id;
    const foundItem = mailData.find((i) => i.id == mailId);

    const updatedItem = { ...foundItem, stared: !foundItem.stared };
    const index = mailData.findIndex((i) => i.id == mailId);
    mailData[index] = updatedItem;
    localStorage.setItem("data", JSON.stringify(mailData));
    renderMails(mailsArea, mailData);
  }
}

// ! Kataegoriler kısımınında tıklam olunca çalışacak fonksiyon.
function watchCategory(e) {
  const leftNav = e.target.parentElement;
  const selectedCategory = leftNav.dataset.name;
  renderCategories(categoryArea, categories, selectedCategory);

  if (selectedCategory === "Yıldızlananlar") {
    const filtred = mailData.filter((i) => i.stared === true);
    renderMails(mailsArea, filtred);
    return;
  }
  renderMails(mailsArea, mailData);
}

// ! Arama Fonk.

function searchMails() {
  const filtredArray = mailData.filter((i) => {
    return i.message.toLowerCase().includes(searchInput.value.toLowerCase());
  });

  renderMails(mailsArea, filtredArray);
}