const img = document.querySelector(".faq-btn");

const faq = document.querySelector(".faq");
const faqClose = document.querySelector(".faq-close");
const faqItems = document.querySelectorAll(".faq-item");

img.addEventListener("click", (e) => {
  const { target } = e;
  faq.classList.toggle("faq-active");
});
faqClose.addEventListener("click", (e) => {
  faq.classList.remove("faq-active");
})
let prevItem;
Array.from(faqItems).forEach((el) => {
  el.addEventListener("click", (e) => {
    const {
      currentTarget,
      currentTarget: { lastElementChild },
    } = e;
    currentTarget.classList.toggle("faq-item-active");
    if (lastElementChild.style.maxHeight) {
      lastElementChild.style.maxHeight = null;
      currentTarget.classList.remove("faq-item-active");

    } else {
      lastElementChild.style.maxHeight = lastElementChild.scrollHeight + "px";
      currentTarget.classList.add("faq-item-active");
    }
    if (prevItem && prevItem != currentTarget && prevItem.lastElementChild.style.maxHeight) {
      prevItem.lastElementChild.style.maxHeight = null;
      prevItem.classList.remove("faq-item-active");

    }
    prevItem = currentTarget;
  });
});
