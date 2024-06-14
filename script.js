// -- GLOBAL --
const MAX_CHARACTER = 150;
const textareaEL = document.querySelector(".form__textarea");
const counterEL = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedBackListEL = document.querySelector(".feedbacks");
const submitBtnEL = document.querySelector(".submit-btn");
const spinnerEl = document.querySelector(".spinner");

// -- COUNTER COMPONENT --
const inputHandler = () => {
  // determine the maxium number of characters
  const maxNumOfCharacters = MAX_CHARACTER;
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
const showVisualIndicator = (textCheck) => {
  const className = textCheck === "valid" ? "form--valid" : "form--invalid";
  // show valid or invalid indicator
  formEl.classList.add(className);
  setTimeout(() => {
    formEl.classList.remove(className);
  }, 2000);
};
const submitHandler = (e) => {
  // to prevent the submit handler from firing and loading a new page
  e.preventDefault();
  // get text from the textarea
  const text = textareaEL.value;
  // Validate text ( check  # and text length)
  if (text.includes("#") && text.length >= 5) {
    showVisualIndicator("valid");
  } else {
    showVisualIndicator("invalid");
    textareaEL.focus();

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
  counterEL.textContent = MAX_CHARACTER;
  //blur submit button
  submitBtnEL.blur();
};

formEl.addEventListener("submit", submitHandler);

//  -- FEEDBACK LIST COMPONENT --

fetch("https://bytegrad.com/course-assets/js/1/api/feedbacks")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    // remove spinner
    spinnerEl.remove();
    // iterate through each element of the array feedbacks and render it
    data.feedbacks.forEach((feedbackItem) => {
      // new feedback item in HTML
      const feedbackHTML = `
      <li class="feedback">
        <button class="upvote">
            <i class="fa-solid fa-caret-up upvote__icon"></i>
            <span class="upvote__count">${feedbackItem.upvoteCount}</span>
        </button>
        <section class="feedback__badge">
            <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
        </section>
        <div class="feedback__content">
            <p class="feedback__company">${feedbackItem.company}</p>
            <p class="feedback__text">${feedbackItem.text}</p>
        </div>
        <p class="feedback__date">${
          feedbackItem.daysAgo === 0 ? "NEW" : `${feedbackItem.daysAgo}d`
        }</p>
    </li>`;
      // insert feedback HTML into the list
      feedBackListEL.insertAdjacentHTML("beforeend", feedbackHTML);
    });
  });
