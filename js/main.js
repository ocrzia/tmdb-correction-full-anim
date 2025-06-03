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
async function getDatas(param, page = 1) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${param}?api_key=6631e5f1dc96088e0d26b86da29b5b6a&page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur :', error);
  }
}

async function displayList(category = "top_rated", page = 1) {
  if (isDisplaying) {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
  }

  isDisplaying = true;
  wrapper.innerHTML = "";
  const datas = await getDatas(category, page);

  datas.results.forEach((result, index) => {
    const timeoutId = setTimeout(() => {
      const tvCard = document.createElement('a');
      tvCard.setAttribute("href", "detail.html");
      tvCard.className = "tv-show";
      tvCard.dataset.tvid = result.id;
      tvCard.innerHTML = `
        <h2>${result.name}</h2>
        <div class="tv-show__img">
          <img src="https://image.tmdb.org/t/p/w400${result.poster_path}">
          <div class="note">${(result.vote_average * 10).toFixed(0)}%</div>
        </div>
      `;
      wrapper.appendChild(tvCard);

      if (index === datas.results.length - 1) {
        isDisplaying = false;
        timeouts = [];
        createPaginationButtons(datas.page, datas.total_pages, category);
      }
    }, index * 100);
    timeouts.push(timeoutId);
  });
}

function createPaginationButtons(currentPage, totalPages, category) {
  const paginationZone = document.querySelector('.pagination-zone');
  paginationZone.innerHTML = ""; // nettoyage à chaque appel

  const pagination = document.createElement('div');
  pagination.className = 'pagination';

  // Prev
  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Prev';
    prevBtn.addEventListener('click', () => {
      displayList(category, currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    pagination.appendChild(prevBtn);
  }

  // Page x of y
  const pageInfo = document.createElement('span');
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  pageInfo.className = 'page-info';
  pagination.appendChild(pageInfo);

  // Next
  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.addEventListener('click', () => {
      displayList(category, currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    pagination.appendChild(nextBtn);
  }

  paginationZone.appendChild(pagination);
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