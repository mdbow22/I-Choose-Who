const pokemonListBox = $('#pokemon-picker');

const [{selectize: selectizedList}] = pokemonListBox.selectize({
  maxItems: 3,
});

$('#recommendation-form').on('submit', event => {
  event.preventDefault();
  // TODO: replace with proper event handler for form
  console.log(selectizedList.items);
});