const animalData = {
  gato: {
    name: "El gerente de la casa",
    caption: "Tiene tres reuniones hoy: una con la cortina, otra con una caja y otra para ignorarte.",
    image: "imagenes/gato.jpg",
    alt: "Gato con expresión muy seria y cómica"
  },
  perro: {
    name: "El señor de los lunes",
    caption: "Está agotado de perseguir su propia cola. La junta de las 3 queda cancelada.",
    image: "imagenes/perro.jpg",
    alt: "Perro con una expresión divertida"
  },
  capibara: {
    name: "La patata zen",
    caption: "No sabe qué está pasando, pero está completamente de acuerdo con quedarse flotando.",
    image: "imagenes/capibara.jpg",
    alt: "Capibara en una pose graciosa"
  }
};

window.clubApi = {
  getAnimals() {
    return Object.entries(animalData).map(([id, animal]) => ({ id, ...animal }));
  },

  submit({ name, animal, terms }) {
    const errors = {};
    const trimmedName = String(name ?? "").trim();

    if (trimmedName.length < 2) {
      errors.name = "Escribe al menos 2 caracteres para tu nombre.";
    }

    if (!animalData[animal]) {
      errors.animal = "Elige uno de los animalitos de la lista.";
    }

    if (terms !== true) {
      errors.terms = "Necesitamos tu permiso para compartir la fama.";
    }

    if (Object.keys(errors).length > 0) {
      return { ok: false, errors };
    }

    return {
      ok: true,
      name: trimmedName,
      animal: { id: animal, ...animalData[animal] }
    };
  }
};
