const pokemonListBox = $('#pokemon-to-add');

const [{selectize: selectizedList}] = pokemonListBox.selectize();

$('#add-pokemon-form').on('submit', event => {
  event.preventDefault();

  const pokemonIds = selectizedList.items;
  
  // check to make sure that a pokemon was actually selected
  if (pokemonIds.length < 1) {
    // TODO: show warning message that the user has to pick a pokemon
    return;
  }
  
  // turn on loading symbol before making the request
  $('#submit-button').addClass('is-loading');
  
  // send list of pokemon to server and go back to pokollection if successful
  window.fetch('/api/collection/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({pokemonIds}),
  }).then(response => {
    if (response.ok) {
      window.location = '/collection';
    } else {
      // TODO: write handler for failed response
      console.log(response);
      $('#submit-button').removeClass('is-loading');
    }
  }).catch((reason) => {
    // TODO: write handler for error
    console.log(reason);
    $('#submit-button').removeClass('is-loading');
  });
});