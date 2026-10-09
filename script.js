const form = document.querySelector("#club-form");
const result = document.querySelector("#result");
const animalImage = document.querySelector("#animal-image");
const resultTitle = document.querySelector("#result-title");
const resultCaption = document.querySelector("#result-caption");

const animals = window.clubApi.getAnimals();
const validAnimals = new Set(animals.map(({ id }) => id));

animals.forEach(({ id, name }) => {
  const option = document.createElement("option");
  option.value = id;
  option.textContent = name;
  form.elements.animal.append(option);
});

function showError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);
  if (!error) return;

  error.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
}

function validateForm() {
  const name = form.elements.name;
  const animal = form.elements.animal;
  const terms = form.elements.terms;
  const trimmedName = name.value.trim();
  let isValid = true;

  showError(name, "");
  showError(animal, "");
  showError(terms, "");

  if (trimmedName.length < 2) {
    showError(name, "Escribe al menos 2 caracteres para tu nombre.");
    isValid = false;
  }

  if (!validAnimals.has(animal.value)) {
    showError(animal, "Elige uno de los animalitos de la lista.");
    isValid = false;
  }

  if (!terms.checked) {
    showError(terms, "Necesitamos tu permiso para compartir la fama.");
    isValid = false;
  }

  return isValid;
}

function displayResult({ name, animal }) {
  resultTitle.textContent = animal.name;
  resultCaption.textContent = `${name}, tu compañero ya te está juzgando con cariño. ${animal.caption}`;
  setAnimalImage(animal.id, animal.image);
  animalImage.alt = animal.alt;
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function setAnimalImage(animalId, imagePath) {
  const localImage = new URL(`imagenes/${animalId}.jpg`, document.baseURI).href;
  animalImage.onerror = () => {
    animalImage.onerror = null;
    animalImage.src = localImage;
  };
  animalImage.src = imagePath;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) {
      firstInvalid.focus();
    }
    result.hidden = true;
    return;
  }

  const submission = window.clubApi.submit({
    name: form.elements.name.value,
    animal: form.elements.animal.value,
    terms: form.elements.terms.checked
  });

  if (!submission.ok) {
    Object.entries(submission.errors).forEach(([field, message]) => {
      const input = form.elements[field];
      if (input) {
        showError(input, message);
      }
    });
    result.hidden = true;
    return;
  }

  displayResult(submission);
});

document.querySelector("#again").addEventListener("click", () => {
  form.reset();
  showError(form.elements.name, "");
  showError(form.elements.animal, "");
  showError(form.elements.terms, "");
  form.elements.animal.focus();
  result.hidden = true;
});
