const pokemonListBox = $('#pokemon-to-add');

const [{selectize: selectizedList}] = pokemonListBox.selectize();

$('#submit-button').on('click', event => {
  // TODO: replace with proper event handler for form
  console.log(selectizedList.items);
});