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



//   const target = el.dataset.target;
//   const $target = document.getElementById(target);

//   el.classList.toggle('is-active');
//   $target.classList.toggle('is-active');

// if (response.ok) {
//     document.location.replace('/');
// } else {
//     alert('Failed to log in.');
// }

// if (el.classList.contains('is-not-favorite')){
//     el.classList.add('is-hidden');
//     el.nextElementSibling.classList.remove('is-hidden');
// } else {
//     el.classList.add('is-hidden');
//     el.previousElementSibling.classList.remove('is-hidden');
// }



// const setFavPoke = async (event) => {
//     event.preventDefault();

//     console.log('hit favorite')

//     const pokeId = document.querySelector('#pokemon-id').value.trim();
//     const favEl = document.getElementById('favorite-star');

//     console.log(pokeId, favEl)

//     if (favEl.hasAttribute("favorite")) {

//         const response = await fetch('/api/collection/favorite/:id', {
//             method: 'PUT',
//             body: JSON.stringify(pokeId),
//             headers: { 'Content-Type': 'application/json' },
//         });

//     } else {

//         const response = await fetch('/api/collection/unfavorite/:id', {
//             method: 'PUT',
//             body: JSON.stringify(pokeId),
//             headers: { 'Content-Type': 'application/json' },
//         });

//     }

// };
  
// const deletePoke = async (event) => {
//     event.preventDefault();

//     console.log('hit delete')

    // const pokeId = document.querySelector('#pokemon-id').value.trim();

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
// };

// document.getElementById(`fav-btn-${id}`).addEventListener('click', setFavPoke);
  
// document.querySelector('.del-btn').addEventListener('click', deletePoke);