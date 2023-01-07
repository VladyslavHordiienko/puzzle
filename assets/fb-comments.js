const buttonAddCommentText = "Publish";
const textareaPlaceholder = "Write a comment..";
const defaultAvatar = "unnamed-user.png";
const defaultUserName = "User";
const defaultTime = "1min";
const defaultButtonLike = "like";
const defaultButtonResponse = "respond";

function newCommentCreate(
  text,
  name = defaultUserName,
  avatar = defaultAvatar,
  time = defaultTime,
  img,
  human = true
) {
  return `
  <div class="comments__item__inner">

  <!-- User avatar -->
  <div class="comments__item__avatar">
      <img src="./assets/${avatar}" alt="">
  </div>
  <!-- end -->

  <div class="comments__item__content">

      <div class="comments__item__content__inner">

          <div class="comments__item__content__wrrap">
              <!-- User name -->
              <div class="comments__item__content-username">
                ${name}
              </div>
              <!-- end -->

              <!-- Comment text -->
              <div class="comments__item__content-text">
                ${text}
                ${img ? `<img src="./assets/${img}" alt="" />` : ""}
              </div>
              <!-- end -->
          </div>

          <!-- Like block -->
          <div class="comments__item__content__like">
              <span class="comments__item__content__like__icons">
                  <span class="comments__item__content__like-icon ">
                      <i class="fb-icon-1"></i>
                  </span>
             <!-- <span class="comments__item__content__like-icon ">
                      <i class="fb-icon-2"></i>
                  </span>
                  <span class="comments__item__content__like-icon ">
                      <i class="fb-icon-3"></i>
                  </span>-->

              </span>
              <span class="comments__item__content__like-count">1</span>
          </div>
          <!-- end -->



      </div>

      <!-- Comment buttons -->
      <ul class="comments__item__btns">
          <li class="comments__item__btn">
              ${time ? time : defaultTime}
          </li>
          <li class="comments__item__btn ${human ? '' : 'comments__item__btn-add-like'}">
              ${defaultButtonLike}
          </li>
          <li class="comments__item__btn ${human ? '' : 'comments__item__btn-add-comment'}">
              ${defaultButtonResponse}
          </li>
      </ul>
      <!-- end -->

      <!-- More comments -->
      <div class="comments__item__more">
        <ul class="comments__item__more_comments">
        </ul>
      </div>
      <!-- end -->
  </div>
</div>
`;
}

function createForm() {
  return `
    <div class="comments__header__wrrap">
      <div class="comments__header__avatar">
          <img src="./assets/${defaultAvatar}" alt="">
      </div>
      <div class="comments__header__text">
          <div class="comments__header__text__inner">
              <textarea name="textarea" placeholder="${textareaPlaceholder}"></textarea>
          </div>
      </div>
      <div class="comments__header__btn">
          <button name="btn" type="submit" disabled id="comments-header-btn">${buttonAddCommentText}</button>
      </div>
    </div>
    <div class="comments__icons">
      <div class="comments__icon">
          <div class="comments__icon__wrrap comments__icon__wrrap__smile">
              <i class="comments__icon__smile"></i>
          </div>
      </div>
      <div class="comments__icon">
          <div class="comments__icon__wrrap">
              <i class="comments__icon__photoaparat"></i>
          </div>
      </div>
    </div>
  `;
}

const headerButton = document.querySelector("#comments-header-btn");
const headerTextarea = document.querySelector("#comments-header-textarea");
const commentsBlock = document.querySelector(".comments__items");
let blocksComments = document.querySelector(".comments__items");
let btnsAddLike = document.querySelectorAll(".comments__item__btn-add-like");

const countAllComments = document.querySelectorAll(
  "li.comments__item[data-id]"
);
let lastCommentId = countAllComments.length;

headerTextarea.addEventListener("input", (e) => {
  e.target.value.length > 5
    ? (headerButton.disabled = false)
    : (headerButton.disabled = true);
});

headerButton.addEventListener("click", (e) => {
  const comment = newCommentCreate(headerTextarea.value);

  const li = document.createElement("li");
  li.classList.add("comments__item");
  li.setAttribute("data-id", lastCommentId++);
  li.innerHTML = comment;
  commentsBlock.appendChild(li);
  headerButton.disabled = true
  headerTextarea.value = ""
});

function hadlerAddForm(e) {
  const { currentTarget, target } = e;

  const blockMoreComment = currentTarget.querySelector(".comments__item__more");

  const className = target.getAttribute("class");
  if (className && className.indexOf("comments__item__btn-add-comment") > -1) {
    if (blockMoreComment.children.length == 2) return;

    const form = createForm();
    const formWrrap = document.createElement("form");
    formWrrap.classList.add("comments__item__form");
    formWrrap.innerHTML = form;
    blockMoreComment.appendChild(formWrrap);
    formWrrap.addEventListener("input", handleFormResponse, false);

    window.scrollBy({
      top:
        blockMoreComment.getBoundingClientRect().top +
        blockMoreComment.scrollHeight -
        window.innerHeight,
      behavior: "smooth",
    });
    function handleFormResponse(event) {
      const {
        target: { form },
      } = event;

      form.textarea.value.length > 5
        ? (form.btn.disabled = false)
        : (form.btn.disabled = true);

      form.btn.onclick = (eve) => {
        eve.preventDefault()
        const comment = newCommentCreate(form.textarea.value);
        const li = document.createElement("li");
        li.classList.add("comments__item");
        li.setAttribute("data-id", lastCommentId++);
        li.innerHTML = comment;

        //<ul class="comments__item__more_comments">
        console.log(target.parentElement, "target.parentElement.nextElementSibling.");
        target.parentElement.nextElementSibling.firstElementChild.appendChild(li);
        formWrrap.remove();
      };
    }
  }
}


const arrElems = [];
function handlerLike(listBtnsAndLike) {
  
  function handleAddLike(e) {
    let span = e.currentTarget.parentElement.parentElement.querySelector(
      ".comments__item__content__like-count"
    );
    const checkLike = arrElems.findIndex((el) => el == span);
    if (checkLike > -1) return;
    span.textContent = +span.textContent + 1;
    arrElems.push(span);
  }

  Array.from(listBtnsAndLike).forEach((element) => {
    element.addEventListener("click", handleAddLike);
  });
}
handlerLike(btnsAddLike)


function handlerForm() {
  Array.from(blocksComments.children).forEach((element) => {
    const blocksContent = element.querySelector(".comments__item__content");
    blocksContent.addEventListener("click", hadlerAddForm);
  });
}
handlerForm()


// ----------------------------------- EXAMPLE --------------------------------
// {
//   commentDataID: 1, // data-id коментария на который надо ответить, если 0 то коментарий будет на самом верхнем уровне в иерархии
//   name: "Lidl support", // имя автора
//   text: "merci pour vos commentaires, c'est très important pour nous", // техт комента
//   avatar: "Lidl.jpg", // автарка  автора
//   imgInText: null,  // без картинки или imgInText: "Lidl.jpg" с картинкой
// },
const comments = [
  {
    commentDataID: 1, // data-id коментария на который надо ответить, если 0 то коментарий будет на самом верхнем уровне в иерархии
    name: "Amazon support", // имя автора
    text: "Thank you for your comments, it is very important for us", // техт комента
    avatar: "amazon-support.png", // автарка  автора
    imgInText: null,  // без картинки или imgInText: "img.jpg" с картинкой
  },

];

let index = 0;
const interval = setInterval(function () {
  if (index >= comments.length - 1) {
    clearInterval(interval);
  }
  const { commentDataID, text, name, avatar, imgInText } = comments[index];
  const commentNode = newCommentCreate(text, name, avatar, null, imgInText, false);
  const li = document.createElement("li");
  li.classList.add("comments__item");
  li.setAttribute("data-id", lastCommentId++);
  li.innerHTML = commentNode;

  let parentBlockComment;
  if (!commentDataID) {
    parentBlockComment = document.querySelector(".comments__items");
  } else {
    const parent = document.querySelector(
      `li.comments__item[data-id="${commentDataID}"]`
    );
    parentBlockComment = parent.querySelector(
      `.comments__item__more_comments`
    );
  }

  parentBlockComment.appendChild(li);

  btnsAddLike = document.querySelectorAll(".comments__item__btn-add-like");
  blocksComments = document.querySelector(".comments__items");
  handlerLike(btnsAddLike)
  handlerForm()

  index++;
}, 7000);
