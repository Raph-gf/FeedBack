// -- COUNTER COMPONENT --

const textareaEL = document.querySelector(".form__textarea");
const counterEL = document.querySelector(".counter");
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

const formEl = document.querySelector(".form");
const submitHandler = (e) => {
  e.preventDefault();
  console.log(2);
};

formEl.addEventListener("submit", submitHandler);
