document.addEventListener('DOMContentLoaded', () => {

    const $delBtn = Array.prototype.slice.call(document.querySelectorAll('.del-btn'), 0);

    if ($delBtn.length > 0) {
  
      $delBtn.forEach( el => {
        el.addEventListener('click', () => {

            const pokeId = el.parentNode.parentNode.parentNode.id;
            const parentEl = el.parentNode.parentNode.parentNode;

            parentEl.classList.add('is-hidden')

            deletePoke(pokeId);

        });
      });
    }
});

document.addEventListener('DOMContentLoaded', () => {

    const $favBtn = Array.prototype.slice.call(document.querySelectorAll('.fav-btn'), 0);

    if ($favBtn.length > 0) {
  
      $favBtn.forEach( el => {
        el.addEventListener('click', () => {

            const pokeId = el.parentNode.parentNode.parentNode.id;
            const iconEl = el.children[0].childNodes[1];
            
            if (iconEl.classList.contains('fas')){
                iconEl.classList.remove('fas');
                iconEl.classList.add('far');
                setUnfavPoke(pokeId);
            } else {
                iconEl.classList.remove('far');
                iconEl.classList.add('fas');
                setFavPoke(pokeId);
            }

        });
      });
    }
});

const setFavPoke = async (pokeId) => {

    const response = await fetch(`/api/collection/favorite/${pokeId}`, {
        method: 'PUT',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
    });

};

const setUnfavPoke = async (pokeId) => {

    const response = await fetch(`/api/collection/unfavorite/${pokeId}`, {
        method: 'PUT',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
    });

};

const deletePoke = async (pokeId) => {

    const response = await fetch(`/api/collection/delete/${pokeId}`, {
        method: 'DELETE',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
    });

}
