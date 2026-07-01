let allPokemon = [];
let selectedTypes = [];

const container = document.getElementById("pokemonContainer");
const searchBar = document.getElementById("searchBar");
const filterContainer = document.getElementById("typeFilters");

/* ---------------- FETCH DATA ---------------- */

fetch("pokemon.json")
  .then(res => res.json())
  .then(data => {
    allPokemon = data;

    createTypeButtons();
    renderPokemon(allPokemon);
  })
  .catch(err => console.error("Failed to load JSON:", err));

/* ---------------- TYPE COLORS ---------------- */

function getTypeColor(type) {
  const colors = {
    fire: "#ff4d4d",
    water: "#4da6ff",
    grass: "#4dff88",
    electric: "#ffd24d",
    poison: "#b266ff",
    ground: "#d2a679",
    rock: "#a3a3a3",
    psychic: "#ff66b2",
    ice: "#66ffff",
    dragon: "#6666ff",
    dark: "#333333",
    fairy: "#ff99cc",
    normal: "#cccccc",
    fighting: "#ff884d",
    bug: "#99ff66",
    ghost: "#7a4dff",
    flying: "#9ad0ff"
  };

  return colors[type] || "#ddd";
}

/* ---------------- RENDER TYPES ---------------- */

function renderTypes(typesString) {
  return typesString
    .split("/")
    .map(t =>
      `<span class="type-badge" style="background:${getTypeColor(t)}">
        ${t}
      </span>`
    )
    .join("");
}

/* ---------------- CARD CREATION ---------------- */

function createCard(p) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${p.IMG}" alt="${p.NAME}">
    <div class="pokemon-header">
      <span class="pokemon-id">#${p.ID}</span>
      <div class="pokemon-name">${p.NAME}</div>
    </div>

    <div class="types">
      ${renderTypes(p.TYPES)}
    </div>

    <button onclick="toggleCard(this)">Show Stats</button>

    <div class="stats">
      <div><span>HP</span><span>${p.HP}</span></div>
      <div><span>Attack</span><span>${p.ATTACK}</span></div>
      <div><span>Defense</span><span>${p.DEFENSE}</span></div>
      <div><span>Height (M)</span><span>${p.HEIGHT}</span></div>
      <div><span>Sp. Atk</span><span>${p.SPECIAL_ATTACK}</span></div>
      <div><span>Weight (KG)</span><span>${p.WEIGHT}</span></div>
      <div><span>Sp. Def</span><span>${p.SPECIAL_DEFENSE}</span></div>
      <div><span>Speed</span><span>${p.SPEED}</span></div>
    </div>
  `;

  const mainType = p.TYPES.split("/")[0];
  card.style.borderTop = `6px solid ${getTypeColor(mainType)}`;

  container.appendChild(card);
}

/* ---------------- RENDER LIST ---------------- */

function renderPokemon(list) {
  container.innerHTML = "";
  list.forEach(createCard);
}

/* ---------------- TOGGLE STATS ---------------- */

function toggleCard(btn) {
  const card = btn.parentElement;
  card.classList.toggle("expanded");

  btn.innerText = card.classList.contains("expanded")
    ? "Hide Stats"
    : "Show Stats";
}

/* ---------------- SEARCH + FILTER ---------------- */

searchBar.addEventListener("input", applyFilters);

/* ---------------- FILTER LOGIC ---------------- */

function applyFilters() {
    const searchValue = searchBar.value.trim().toLowerCase();

    let filtered = allPokemon.filter(p => {

        const nameMatch =
            p.NAME.toLowerCase().includes(searchValue);

        const idMatch =
        searchValue === "" ||
        Number(p.ID) === Number(searchValue);

        const searchMatch =
            searchValue === "" ||
            nameMatch ||
            idMatch;

        const pokemonTypes =
            p.TYPES.toLowerCase().split("/");

        const typeMatch =
            selectedTypes.length === 0 ||
            selectedTypes.every(t =>
                pokemonTypes.includes(t)
            );

        return searchMatch && typeMatch;
    });

    renderPokemon(filtered);
}

/* ---------------- TYPE FILTER BUTTONS ---------------- */

function createTypeButtons() {
  const typeList = [
    "fire","water","grass","electric","poison",
    "ground","rock","psychic","ice","dragon",
    "dark","fairy","normal","fighting","bug",
    "ghost","steel","flying"
  ];

  typeList.forEach(type => {
    const badge = document.createElement("span");

    badge.className = "type-badge filter";
    badge.textContent = type;
    badge.style.background = getTypeColor(type);

    badge.addEventListener("click", () => {
      badge.classList.toggle("active");

      if (selectedTypes.includes(type)) {
        selectedTypes = selectedTypes.filter(t => t !== type);
      } else {
        selectedTypes.push(type);
      }

      applyFilters();
    });

    filterContainer.appendChild(badge);
  });
}