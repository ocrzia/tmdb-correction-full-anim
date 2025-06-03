// ==============================
// 🌱 Sélection des éléments
// ==============================
const title = document.querySelector('title');
const mainTitle = document.querySelector('h1');
const header = document.querySelector('header');
const tvDetail = document.querySelector('.tv-detail');
// ==============================
// 🧠 Variables globales
// ==============================
async function getTvDetails(tvid) {
  try {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${tvid}?api_key=6631e5f1dc96088e0d26b86da29b5b6a`);
  const data = await response.json();
  return data;
  } catch (error) {
  console.error('Erreur :', error);
  }
}
// ==============================
// 🎊 Fonctionnalités
// ==============================
function getBackId() {
  const tvId = localStorage.getItem("tvDetail");
  return parseInt(tvId); 
}
// ==============================
// 🧲 Événements
// ==============================
window.addEventListener('load', async () => {
    const tvDetails = await getTvDetails(getBackId());
    console.log(tvDetails);
    
    const {name, backdrop_path, overview, poster_path, number_of_seasons, number_of_episodes, tagline, first_air_date} = tvDetails; 
    title.textContent = `Details for ${name}`;
    mainTitle.textContent = name;
    header.style.backgroundImage=`url(https://image.tmdb.org/t/p/w500${backdrop_path})`;
    tvDetail.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${poster_path}">
      <div class="tv-text">
        <h2>${tagline}</h2>
        <p>${overview}</p>
        <p><strong>Date de sortie :</strong> ${first_air_date}</p>
        <p><strong>Nombre de saisons :</strong> ${number_of_seasons}</p>
        <p><strong>Nombre d'épisodes :</strong> ${number_of_episodes}</p>
      </div>
    `;

})