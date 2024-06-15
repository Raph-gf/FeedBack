// -- GLOBAL --
const BASE_URL_API = "https://bytegrad.com/course-assets/js/1/api";
const MAX_CHARACTER = 150;
const textareaEL = document.querySelector(".form__textarea");
const counterEL = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedBackListEL = document.querySelector(".feedbacks");
const hashTagsListEL = document.querySelector(".hashtags");
const submitBtnEL = document.querySelector(".submit-btn");
const spinnerEl = document.querySelector(".spinner");

const renderFeddbackItem = (feedbackItem) => {
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
};

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
  const company = hastag.substring(1);
  const badgeLetter = company.substring(0, 1).toUpperCase();
  const upVoteCount = 0;
  const daysAgo = 0;

  // create a new feedback HTML element and render it in list
  const feddbackItem = {
    upvoteCount: upVoteCount,
    company: company,
    badgeLetter: badgeLetter,
    daysAgo: daysAgo,
    hastag: hastag,
    text: text,
  };
  renderFeddbackItem(feddbackItem);

  // send a feedback in HTML into the server

  fetch(`${BASE_URL_API}/feedbacks`, {
    method: "POST",
    body: JSON.stringify(feddbackItem),
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })
    .then((response) => {
      if (!response.ok) {
        console.log("Something went wrong");
        return;
      }
      console.log("Successfully submited");
    })
    .catch((err) => console.log(err));

  //clear text area
  textareaEL.value = "";
  //reset counter
  counterEL.textContent = MAX_CHARACTER;
  //blur submit button
  submitBtnEL.blur();
};

formEl.addEventListener("submit", submitHandler);

//  -- FEEDBACK LIST COMPONENT --

const clickHandler = (event) => {
  // get the HTML element that will be clicked
  const clickedEl = event.target;
  console.log(clickedEl);
  // determine if user intended to upvote or expland text area
  const upvoteIntention = clickedEl.className.includes("upvote");
  // run logic for each option
  if (upvoteIntention) {
    // get the closest upvote button
    const upvoteBtnElement = clickedEl.closest(".upvote");
    // disabel the upvote button to prevent double click or spamming the
    upvoteBtnElement.disabled = true;
    // select the upvote count element within the upvote button
    const upvoteCountEl = upvoteBtnElement.querySelector(".upvote__count");

    //get currently displayed upvote count( the + is for converting the string into a number)
    let upvoteCount = +upvoteCountEl.textContent;
    console.log(typeof upvoteCount);

    // increment by 1 and send the upvote count to HTML
    upvoteCountEl.textContent = ++upvoteCount;
  } else {
    // expand feedback clicked
    clickedEl.closest(".feedback").classList.toggle("feedback--expand");
  }
};

feedBackListEL.addEventListener("click", clickHandler);

fetch(`${BASE_URL_API}/feedbacks`)
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
      renderFeddbackItem(feedbackItem);
    });
  })
  .catch((error) => {
    feedBackListEL.textContent = `Failed to fetch feedbacks. Error: ${error.message}`;
  });

// -- HASHTAG LIST COMPONENT --

const clickHashtagHandler = (event) => {
  const clickedHashtag = event.target;
  // stop function if user clicked outside the button
  if (!clickedHashtag.className === "hashtag") return;
  // extract company name from hashtag
  const companyName = clickedHashtag.textContent
    .substring(1)
    .toLowerCase()
    .trim();
  // iterate over each feedback item in the list
  feedBackListEL.childNodes.forEach((childNode) => {
    // stop this itération if it's a text note
    if (childNode.nodeType === 3) return;
    //extract company name
    const companyNameFromFeedBackItem = childNode
      .querySelector(".feedback__company")
      .textContent.toLowerCase()
      .trim();
    // remove all feedback items if not equal to company name from the feedback item
    if (companyName !== companyNameFromFeedBackItem) {
      childNode.remove();
    }
  });
  console.log(clickedHashtag);
};

hashTagsListEL.addEventListener("click", clickHashtagHandler);
