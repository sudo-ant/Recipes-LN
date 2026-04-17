let allRecipes = [];
let selectedCategory = "All";

async function loadRecipes() {
  try {
    const response = await fetch("data/recipes.json");
    if (!response.ok) {
      throw new Error("Failed to load recipes");
    }

    allRecipes = await response.json();
    renderCategoryFilters(allRecipes);
    renderRecipes();
    setupSearch();
  } catch (error) {
    console.error(error);
    document.getElementById("recipeList").innerHTML =
      "<p>Could not load recipes.</p>";
  }
}

function renderCategoryFilters(recipes) {
  const categoryFilters = document.getElementById("categoryFilters");
  const categories = ["All", ...new Set(recipes.map(recipe => recipe.category))];

  categoryFilters.innerHTML = "";

  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category;
    button.className = "category-button";
    if (category === selectedCategory) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      selectedCategory = category;
      renderCategoryFilters(allRecipes);
      renderRecipes();
    });

    categoryFilters.appendChild(button);
  });
}

function renderRecipes() {
  const recipeList = document.getElementById("recipeList");
  const noResultsMessage = document.getElementById("noResultsMessage");
  const searchValue = document.getElementById("searchInput").value.toLowerCase();

  const filteredRecipes = allRecipes.filter(recipe => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchValue) ||
      recipe.subtitle.toLowerCase().includes(searchValue) ||
      recipe.category.toLowerCase().includes(searchValue);

    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  recipeList.innerHTML = "";

  if (filteredRecipes.length === 0) {
    noResultsMessage.classList.remove("hidden");
    return;
  }

  noResultsMessage.classList.add("hidden");

  filteredRecipes.forEach(recipe => {
    const card = document.createElement("a");
    card.className = "recipe-card";
    card.href = `recipe.html?id=${recipe.id}`;

    card.innerHTML = `
      <h2>${recipe.title}</h2>
      <p>${recipe.subtitle}</p>
      <p><strong>Serves:</strong> ${recipe.serves}</p>
      <p><strong>Time:</strong> ${recipe.time}</p>
      <p><strong>Category:</strong> ${recipe.category}</p>
    `;

    recipeList.appendChild(card);
  });
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", renderRecipes);
}

loadRecipes();