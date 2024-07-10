const validateProjectName = (value) => {
  if (!value) {
    return [false, "Please enter project name."];
  }
  return [true, ""];
};

const validateItemLetter = (value) => {
  if (!value) {
    return [false, "Please enter item letter."];
  }

  if (!(value.length === 1 && value.match(/[a-z]/i))) {
    return [false, "Please enter only one letter for item letter."];
  }

  const letters = $("#act-table tbody tr:last-child > td:first-child");
  let lastLetter = "";
  if (letters.length > 0) {
    lastLetter = $("#act-table tbody tr:last-child > td:first-child")[0]
      .textContent;
  }

  if (
    lastLetter &&
    value.trim().toUpperCase() !==
      String.fromCharCode(lastLetter.charCodeAt(0) + 1)
        .trim()
        .toUpperCase()
  ) {
    return [
      false,
      `The last item letter is ${lastLetter}, please input the next letter.`,
    ];
  }
  return [true, ""];
};

const validateActivity = (value) => {
  if (!value) {
    return [false, "Please enter activity name."];
  }
  return [true, ""];
};

const validatePredecessor = (value) => {
  if (value && !value.match(/[a-z]/i)) {
    return [
      false,
      "Please enter only an alphabet letter for immediate predecessor.",
    ];
  }
  if ($("#impre").val().indexOf(" ") >= 0) {
    return [false, "Please remove spaces in Immediate predecessor."];
  }
  if (value.trim() === $("#itemL").val().trim()) {
    return [
      false,
      "Immediate predecessor must not be the same as item letter.",
    ];
  }
  if (value && !getCurrentItemLetters().includes(value.toUpperCase())) {
    return [
      false,
      "Immediate predecessor not found in the current item letters.",
    ];
  }

  return [true, ""];
};

const getCurrentItemLetters = () => {
  const inputs = $("#act-table tbody tr > td:first-child")
    .toArray()
    .map((el) => el.textContent.toUpperCase());

  return inputs;
};

const isDecimal = (value, name) => {
  if (!value) {
    return [false, "Please enter " + name + "."];
  }

  const isDecimal = value.match(/^-?\d*\.?\d+$/);
  if (isDecimal === null) {
    return [false, `Invalid input for ${name}.`];
  }

  return [true, ""];
};

const validateDate = (value) => {
  const pattern = /\d{1,2}\-\d{1,2}\-\d{4}/;
  if (!value) {
    return [false, "Please enter starting date."];
  }

  if (!pattern.test(value)) {
    return [false, "Incorrect starting date format."];
  }

  return [true, ""];
};

export const projectValidation = (inputId, inputValue) => {
  inputValue = inputValue.trim();
  if (inputId === "pname") {
    return validateProjectName(inputValue);
  }

  if (inputId === "startDate") {
    return validateDate(inputValue);
  }

  if (inputId === "itemL") {
    return validateItemLetter(inputValue);
  }

  if (inputId === "aname") {
    return validateActivity(inputValue);
  }

  if (inputId === "impre") {
    return validatePredecessor(inputValue);
  }

  if (inputId === "timeA") {
    return isDecimal(inputValue, "Time Estimates (A)");
  }

  if (inputId === "timeM") {
    return isDecimal(inputValue, "Time Estimates (M)");
  }

  if (inputId === "timeB") {
    return isDecimal(inputValue, "Time Estimates (B)");
  }

  return true;
};
