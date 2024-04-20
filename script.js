// -- GLOBAL --
const textareaEL = document.querySelector(".form__textarea");
const counterEL = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedBackListEL = document.querySelector(".feedbacks");
const submitBtnEL = document.querySelector(".submit-btn");

// -- COUNTER COMPONENT --
const inputHandler = () => {
  // determine the maxium number of characters
  const maxNumOfCharacters = 150;
  // determine the number of characters in the textarea
  const numOfCharactersInTextarea = textareaEL.value.length;
  // caluclate the number of characters left
  const charactersLeft = maxNumOfCharacters - numOfCharactersInTextarea;
  // show number of character left
  counterEL.textContent = charactersLeft;
  console.log(charactersLeft);
};
textareaEL.addEventListener("input", inputHandler);

// -- FORM COMPONENT --
const submitHandler = (e) => {
  // to prevent the submit handler from firing and loading a new page

  e.preventDefault();
  // get text from the textarea

  const text = textareaEL.value;
  // Validate text ( check  # and text length)

  if (text.includes("#") && text.length >= 5) {
    // show valid indicator

    formEl.classList.add("form--valid");
    setTimeout(() => {
      formEl.classList.remove("form--valid");
    }, 2000);
  } else {
    // show invalid indicator

    formEl.classList.add("form--invalid");
    setTimeout(() => {
      formEl.classList.remove("form--invalid");
    }, 2000);

    textareaEL.focus();

    // alert("Missing # or text length need to be at least 5");
    // stop the function execution
    return;
  }
  // add text to the list and extract other infos from text
  const hastag = text.split(" ").find((word) => word.includes("#"));
  const compagnyName = hastag.substring(1);
  const badgeLetter = compagnyName.substring(0, 1).toUpperCase();
  const upVoteCount = 0;
  const daysAgo = 0;
  // new feedback HTML element
  const feedbackHTML = `
  <li class="feedback">
    <button class="upvote">
        <i class="fa-solid fa-caret-up upvote__icon"></i>
        <span class="upvote__count">${upVoteCount}</span>
    </button>
    <section class="feedback__badge">
        <p class="feedback__letter">${badgeLetter}</p>
    </section>
    <div class="feedback__content">
        <p class="feedback__company">${compagnyName}</p>
        <p class="feedback__text">${text}</p>
    </div>
    <p class="feedback__date">${daysAgo === 0 ? "NEW" : `${daysAgo}d`}</p>
</li>`;
  // insert feedback HTML into the list
  feedBackListEL.insertAdjacentHTML("beforeend", feedbackHTML);

  //clear text area
  textareaEL.value = "";
  //reset counter
  counterEL.textContent = 150;
  //blur submit button
  submitBtnEL.blur();
};

formEl.addEventListener("submit", submitHandler);
