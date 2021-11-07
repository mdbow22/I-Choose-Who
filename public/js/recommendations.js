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
  

  const response = await fetch(
    `/api/recs/`,
    {
      method: 'POST',
      body: JSON.stringify({ pokemon: pokemonIds }),
      headers: {
        'Content-Type': 'application/json'
      },
    }
  );
  const recData = await response.json();
  
  // process and display response
  showResultsForPokemon(recData);
  
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

function showResultsForPokemon(recData) {
  // hide/unhide relevant sections
  $('#type-recommendation-results').addClass('is-hidden');
  $('#by-pokemon-recommendation-results').removeClass('is-hidden');

  populateEnemyPokemonSection('pk1', recData[0])
  if (recData.length > 1) {
    populateEnemyPokemonSection('pk2', recData[1]);
    $('#pk2-container').removeClass('is-hidden');
  } else {
    $('#pk2-container').addClass('is-hidden');
  }
  if (recData.length > 2) {
    populateEnemyPokemonSection('pk3', recData[2]);
    $('#pk3-container').removeClass('is-hidden');
  } else {
    $('#pk3-container').addClass('is-hidden');
  }
}

function populateEnemyPokemonSection(section, pokemonData) {
  // show information about the enemy pokemon
  $(`#enemy-${section}-container`).empty();
  $(`#enemy-${section}-container`).append(createEnemyCard(pokemonData));

  // populate recommendations for this pokemon
  populateRecommendationsSubsection(section + '-best', pokemonData.best);
  populateRecommendationsSubsection(section + '-better', pokemonData.better);
  populateRecommendationsSubsection(section + '-good', pokemonData.good);
}

function showResultsForType(recData, type) {
  // hide/unhide relevant sections and 
  $('#type-recommendation-results').removeClass('is-hidden');
  $('#by-pokemon-recommendation-results').addClass('is-hidden');

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
  populateRecommendationsSubsection('type-best', recData.best);
  populateRecommendationsSubsection('type-better', recData.better);
  populateRecommendationsSubsection('type-good', recData.good);
}

/**
 * Populates pokemon from pokemonList into section of DOM identified by section
 * @param {string} section - a concatenation of one of ['type', 'pk1', 'pk2', 'pk3'],
 *                           '-', and one of ['best', 'better', 'good']
 *                           eg. type-best 
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
  const name_plus_variant = pokemon.name +
                            (pokemon.variant ? ', ' + pokemon.variant : '' );
  return $.parseHTML(`<div class="column is-half is-one-third-desktop is-one-quarter-fullhd">
<div class="card">
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-96x96">
          <img src="${pokemon.imageURL ?? '/img/icw_hollow_square_96.png'}"
            alt="${name_plus_variant} sprite">
        </figure>
      </div>
      <div class="media-content">
        <p class="title is-4">
          <span class="pokemon-recommendation-name">${name_plus_variant}</span>
          ${pokemon.favorite ? '<span class="icon pokemon-recommendation-is-favorite"><i class="fas fa-star has-text-warning"></i></span>' : '' }
        </p>
        <p class="subtitle is-6 pokemon-recommendation-type">${typeListToString(pokemon.types)}</p>
      </div>
    </div>
  </div>
</div>
</div>`);
}

/**
 * Creates a DOM node for a card for the given pokemon 
 * @param {Object} pokemon 
 * @returns 
 */
function createEnemyCard(pokemon) {
  const name_plus_variant = pokemon.name +
                            (pokemon.variant ? ', ' + pokemon.variant : '' )
  return $.parseHTML(`<div class="card">
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-96x96">
          <img src="${pokemon.imageURL ?? '/img/icw_hollow_square_96.png'}"
            alt="${name_plus_variant} sprite">
        </figure>
      </div>
      <div class="media-content">
        <p class="title is-4">
          <span class="pokemon-enemy-name">${name_plus_variant}</span>
        </p>
        <p class="subtitle is-6 pokemon-recommendation-type">${typeListToString(pokemon.types)}</p>
      </div>
    </div>
    <div class="content">
      <ul>
        ` + //TODO: Uncomment when strong against is available <li class="strong-against-li">Strong against: <span class="strong-against-span">${typeListToString(pokemon.strong_against) || 'N/A'}</span></li>
        `<li class="weak-against-li">Weak against: <span class="weak-against-span">${typeListToString(pokemon.weak_to) || 'N/A'}</span></li>
        <li class="weak-against-li">Weak (4x) against: <span class="weak-4x-against-span">${typeListToString(pokemon.weak_to4x) || 'N/A'}</span></li>
        <li class="resists-li">Resists: <span class="resists-span">${typeListToString(pokemon.resists) || 'N/A'}</span></li>
        <li class="immune-li">Immune: <span class="immune-span">${typeListToString(pokemon.immune_to) || 'N/A'}</span></li>
      </ul>
    </div>
  </div>
</div>
`);
}

function typeListToString(typeList) {
  return typeList.map(capitalizeFirstLetter).join(', ')
}

function capitalizeFirstLetter(str) {
  str = str.toString();
  if (str.length === 0) return str;
  if (str.length === 1) return str.toUpperCase();
  return str[0].toUpperCase() + str.substring(1);
}