// ==============================
// 🌱 Sélection des éléments
// ==============================
const boutons = document.querySelector('.buttons');
const wrapper = document.querySelector('.wrapper');

// ==============================
// 🧠 Variables globales
// ==============================
let isDisplaying = false;
let timeouts = []; // stocke tous les timeouts lancés
// ==============================
// 🎊 Fonctionnalités
// ==============================
async function getDatas(param) {
  try {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${param}?api_key=6631e5f1dc96088e0d26b86da29b5b6a`);
  const data = await response.json();
  return data;
  } catch (error) {
  console.error('Erreur :', error);
  }
}

async function displayList(category = "top_rated") {
  // Si une animation est déjà en cours, on l'annule
  if (isDisplaying) {
    timeouts.forEach(t => clearTimeout(t)); // annule les setTimeout en cours
    timeouts = []; // vide la liste
  }

  isDisplaying = true;
  wrapper.innerHTML = "";
  const datas = await getDatas(category);

  datas.results.forEach((result, index) => {
    const timeoutId = setTimeout(() => {
      const tvCard = document.createElement('a');
      tvCard.setAttribute("href", "detail.html");
      tvCard.className = "tv-show";
      tvCard.dataset.tvid = result.id;
      tvCard.innerHTML = `
        <h3>${result.name}</h3>
        <div class="tv-show__img">
          <img src="https://image.tmdb.org/t/p/w400${result.poster_path}">
          <div class="note">
            ${(result.vote_average * 10).toFixed(0)}%
          </div>
        </div>
      `;
      wrapper.appendChild(tvCard);

      if (index === datas.results.length - 1) {
        isDisplaying = false;
        timeouts = []; // nettoyage des timeouts terminés
      }
    }, index * 100);

    // On stocke le timeout lancé
    timeouts.push(timeoutId);
  });
}

displayList();
// ==============================
// 🧲 Événements
// ==============================
boutons.addEventListener('click', async (e) =>{
  e.preventDefault();
  const allButtons = document.querySelectorAll("button");
  allButtons.forEach(singlebutton => {
    singlebutton.classList.remove('active');
  })  
  if(e.target.matches('button')) {
    const category = e.target.dataset.tv;
    e.target.classList.add('active');
    displayList(category);
  }
})

wrapper.addEventListener('click',  (e) => {
  if (e.target.closest('.tv-show')) {
    const tvId = e.target.closest('.tv-show').dataset.tvid;
    localStorage.setItem("tvDetail", tvId);
  }
})