const setFavPoke = async (event) => {
    event.preventDefault();

    const pokeId = document.querySelector('#pokemon-id').value.trim();
    const favEl = document.getElementById('favorite-star');

    if (favEl.hasAttribute("favorite")) {

        const response = await fetch('/api/collection/favorite/:id', {
            method: 'PUT',
            body: JSON.stringify(pokeId),
            headers: { 'Content-Type': 'application/json' },
        });

    } else {

        const response = await fetch('/api/collection/unfavorite/:id', {
            method: 'PUT',
            body: JSON.stringify(pokeId),
            headers: { 'Content-Type': 'application/json' },
        });

    }

};
  
const deletePoke = async (event) => {
    event.preventDefault();

    const pokeId = document.querySelector('#pokemon-id').value.trim();

    // if (email && password) {
    //     const response = await fetch('/api/users', {
    //         method: 'POST',
    //         body: JSON.stringify({ email, password }),
    //         headers: { 'Content-Type': 'application/json' },
    //     });

    //     if (response.ok) {
    //         document.location.replace('/');
    //     } else {
    //         alert('Failed to sign up.');
    //     }
    // }
};

document.getElementById('favorite-btn').addEventListener('click', setFavPoke);
  
document.getElementById('delete-btn').addEventListener('click', deletePoke);