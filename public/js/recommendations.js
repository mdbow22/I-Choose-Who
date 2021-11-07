const pokemonListBox = $('#pokemon-picker');

const [{selectize: selectizedList}] = pokemonListBox.selectize({
  maxItems: 3,
});

$('#by-pokemon-form').on('submit', async (event) => {
  event.preventDefault();
  const pokemonIds = selectizedList.items.map(id => parseInt(id)); 
  if (!pokemonIds?.length) {
    // TODO show modal if no pokemon have been selected
    return;
  }
  
  $('#by-pokemon-submit-button').addClass('is-loading');
  // TODO: replace with proper event handler for form
  const response = await fetch(
    `/api/recs`,
    {
      method: 'POST',
      body: JSON.stringify({ pokemon: pokemonIds })
    }
  );
  const recData = await response.json();
  
  
  console.log(recData);
  
  $('#by-pokemon-submit-button').removeClass('is-loading');

});

$('#by-type-form').on('submit', async (event) => {
  event.preventDefault();
  const type = $('#type-picker').val();
  if (!type) {
    // TODO show modal if no type is selected
    return;
  }

  $('#by-type-submit-button').addClass('is-loading');

  const response = await fetch(`/api/recs/${type}`);
  const recData = await response.json();

  showResultsForType(recData, type);

  $('#by-type-submit-button').removeClass('is-loading');
});

function showResultsForType(recData, type) {
  // hide/unhide relevant sections and 
  $('#recommendation-results').removeClass('is-hidden');
  $('#enemy-type-info').removeClass('is-hidden');
  $('#enemy-pokemon-info').addClass('is-hidden');

  // show general info about type
  $('#enemy-type-span').text(capitalizeFirstLetter(type));
  $('#enemy-type-strong-against-list').text(
    recData.strong_against.map(capitalizeFirstLetter).join(', ') || 'N/A'
  );
  $('#enemy-type-weak-against-list').text(
    recData.weak_to.map(capitalizeFirstLetter).join(', ') || 'N/A'
  );
  $('#enemy-type-resists-list').text(
    recData.resists.map(capitalizeFirstLetter).join(', ') || 'N/A'
  );
  $('#enemy-type-immune-list').text(
    recData.immune_to.map(capitalizeFirstLetter).join(', ') || 'N/A'
  );

  // populate recommendations
  populateRecommendationsSubsection('best', recData.best);
  populateRecommendationsSubsection('better', recData.better);
  populateRecommendationsSubsection('good', recData.good);
}

/**
 * Populates pokemon from pokemonList into section of DOM identified by section
 * @param {string} section - either 'best', 'better', or 'good' 
 * @param {Array} pokemonList 
 */
function populateRecommendationsSubsection(section, pokemonList) {
  // if there are no pokemon for this section,
  // hide card subsection, show a message, and exit
  if (pokemonList.length === 0) {
    $(`#no-${section}-pokemon-div`).removeClass('is-hidden');
    $(`#${section}-pokemon-cards`).addClass('is-hidden');
    return;
  }

  // hide no-pokemon message, show cards section
  $(`#no-${section}-pokemon-div`).addClass('is-hidden');
  $(`#${section}-pokemon-cards`).removeClass('is-hidden');

  // detach any existing cards from DOM
  const cardsContainer = $(`#${section}-pokemon-cards`)
  cardsContainer.empty();
  
  // sort favorites first and append to DOM
  pokemonList.sort((p1, p2) => p1.favorite - p2.favorite);
  pokemonList.forEach(pokemon => cardsContainer.append(createCard(pokemon)));
}

/**
 * Creates a DOM node for a card for the given pokemon 
 * @param {Object} pokemon 
 * @returns 
 */
function createCard(pokemon) {
  return $.parseHTML(`<div class="column is-half is-one-third-desktop is-one-quarter-fullhd">
<div class="card">
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-96x96">
          <img src="${pokemon.imageURL ?? '/img/icw_hollow_square_96.png'}"
            alt="${pokemon.name} sprite">
        </figure>
      </div>
      <div class="media-content">
        <p class="title is-4">
          <span class="pokemon-recommendation-name">${pokemon.name}</span>
          ${pokemon.favorite ? '<span class="icon pokemon-recommendation-is-favorite"><i class="fas fa-star has-text-warning"></i></span>' : '' }
        </p>
        <p class="subtitle is-6 pokemon-recommendation-type">${pokemon.types.map(capitalizeFirstLetter).join(', ')}</p>
      </div>
    </div>
  </div>
</div>
</div>`);
}

function capitalizeFirstLetter(str) {
  str = str.toString();
  if (str.length === 0) return str;
  if (str.length === 1) return str.toUpperCase();
  return str[0].toUpperCase() + str.substring(1);
}