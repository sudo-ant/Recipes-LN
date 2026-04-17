async function loadRecipe() {
  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get("id");

  try {
    const response = await fetch("data/recipes.json");
    if (!response.ok) {
      throw new Error("Failed to load recipes");
    }

    const recipes = await response.json();
    const recipe = recipes.find(item => item.id === recipeId);

    if (!recipe) {
      document.getElementById("recipeNotFound").classList.remove("hidden");
      return;
    }

    renderRecipe(recipe);
  } catch (error) {
    console.error(error);
    document.getElementById("recipeNotFound").textContent =
      "Could not load recipe.";
    document.getElementById("recipeNotFound").classList.remove("hidden");
  }
}

function renderRecipe(recipe) {
  document.title = `${recipe.title} | Recipes LN`;
  document.getElementById("recipeTitle").textContent = recipe.title;
  document.getElementById("recipeSubtitle").textContent = recipe.subtitle || "";
  document.getElementById("recipeServes").textContent = recipe.serves;
  document.getElementById("recipeTime").textContent = recipe.time;
  document.getElementById("recipeCategory").textContent = recipe.category;

  fillList("recipeIngredients", recipe.ingredients);
  fillList("recipeMethod", recipe.method);
  fillList("recipeTips", recipe.tips);
  fillList("recipeNotes", recipe.notes, true);

  makeStepsClickable();

  toggleSection("tipsSection", recipe.tips);
  toggleSection("notesSection", recipe.notes);

  if ('wakeLock' in navigator) {
    try {
      navigator.wakeLock.request('screen');
    } catch (err) {
      console.log('Wake lock failed:', err);
    }
  }

  document.getElementById("recipeContent").classList.remove("hidden");
}

function fillList(elementId, items, allowHtml = false) {
  const list = document.getElementById(elementId);
  list.innerHTML = "";

  if (!items || items.length === 0) {
    return;
  }

  items.forEach(item => {
    const li = document.createElement("li");

    if (allowHtml) {
      li.innerHTML = item;
    } else {
      li.textContent = item;
    }

    list.appendChild(li);
  });
}

function toggleSection(sectionId, items) {
  const section = document.getElementById(sectionId);
  if (!items || items.length === 0) {
    section.classList.add("hidden");
  }
}

function makeStepsClickable() {
  const steps = document.querySelectorAll("#recipeMethod li");

  steps.forEach(step => {
    step.addEventListener("click", () => {
      step.classList.toggle("active-step");
    });
  });
}

loadRecipe();