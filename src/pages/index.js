import "./index.css";
import Api from "../utils/Api.js";

import { validationConfig } from "../utils/constants.js";
import FormValidator from "../components/FormValidator.js";

function openModal(modal) {
  modal.classList.add("modal_is_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is_opened");
}

const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = document.querySelector("#profile-name-input");
const editProfileDescriptionInput = document.querySelector(
  "#profile-description-input",
);

const newPostImageInput = document.querySelector("#card-image-input");
const newPostCaptionInput = document.querySelector("#card-caption-input");
const newPostAddBtn = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

const closeButtons = document.querySelectorAll(".modal__close");
const allModals = document.querySelectorAll(".modal");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "9ac9e460-7317-4f34-9018-10614fb697d1",
    "Content-Type": "application/json",
  },
});

function setUserInfo(data) {
  profileNameEl.textContent = data.name;
  profileDescriptionEl.textContent = data.about;
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButtonEl = cardElement.querySelector(".card__like-button");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  if (data.isLiked) {
    cardLikeButtonEl.classList.add("card__like-button_active");
  }

  cardLikeButtonEl.addEventListener("click", () => {
    const isLiked = cardLikeButtonEl.classList.contains(
      "card__like-button_active",
    );

    const likeRequest = isLiked
      ? api.removeLike(data._id)
      : api.addLike(data._id);

    likeRequest
      .then((updatedCard) => {
        if (updatedCard.isLiked) {
          cardLikeButtonEl.classList.add("card__like-button_active");
        } else {
          cardLikeButtonEl.classList.remove("card__like-button_active");
        }
      })
      .catch(console.error);
  });

  cardDeleteBtnEl.addEventListener("click", () => {
    api
      .removeCard(data._id)
      .then(() => {
        cardElement.remove();
      })
      .catch(console.error);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function renderCard(data, position = "append") {
  const cardElement = getCardElement(data);

  if (position === "prepend") {
    cardsList.prepend(cardElement);
  } else {
    cardsList.append(cardElement);
  }
}

api
  .getAppInfo()
  .then(([cards, userData]) => {
    setUserInfo(userData);
    cards.forEach((item) => {
      renderCard(item);
    });
  })
  .catch(console.error);

newPostAddBtn.addEventListener("click", () => {
  newPostValidator.resetValidation();
  openModal(newPostModal);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  api
    .addCard({
      name: newPostCaptionInput.value,
      link: newPostImageInput.value,
    })
    .then((card) => {
      renderCard(card, "prepend");
      evt.target.reset();
      newPostValidator.resetValidation();
      closeModal(newPostModal);
    })
    .catch(console.error);
});

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;

  editProfileValidator.resetValidation();
  openModal(editProfileModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((userData) => {
      setUserInfo(userData);
      closeModal(editProfileModal);
    })
    .catch(console.error);
});

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

allModals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
});

const editProfileValidator = new FormValidator(
  validationConfig,
  editProfileForm,
);
editProfileValidator.enableValidation();

const newPostValidator = new FormValidator(validationConfig, newPostForm);
newPostValidator.enableValidation();
