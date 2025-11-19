// ==========================================
//      CONFIGURACIÓN DEL PORTAFOLIO
// ==========================================

const username = 'franmabb'; // Tu usuario
const container = document.getElementById('github-projects');
const paginationContainer = document.getElementById('pagination-controls');
const itemsPerPage = 6; 
let currentPage = 1;
let allRepos = []; 

// Repositorios destacados
const reposDestacados = [
    'Portfolio',       
    'Web-sostenibilidad',     
    'Dynamic-DNS',
    'Python',   
]; 

// ==========================================
//      LÓGICA PRINCIPAL (GITHUB)
// ==========================================

async function initPortfolio() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const data = await response.json();

        const destacados = [];
        const otros = [];

        data.forEach(repo => {
            if (reposDestacados.includes(repo.name)) {
                destacados.push(repo);
            } else {
                otros.push(repo);
            }
        });

        destacados.sort((a, b) => reposDestacados.indexOf(a.name) - reposDestacados.indexOf(b.name));
        allRepos = [...destacados, ...otros];
        renderPage(1);

    } catch (error) {
        console.error('Error cargando GitHub:', error);
    }
}

function renderPage(page) {
    currentPage = page;
    container.innerHTML = ''; 
    
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const reposToShow = allRepos.slice(start, end);

    reposToShow.forEach(repo => {
        let topicsHtml = '';
        if (repo.topics && repo.topics.length > 0) {
            topicsHtml = repo.topics.slice(0, 4).map(topic => 
                `<span class="topic-tag">${topic}</span>`
            ).join('');
        }

        const licenseText = repo.license ? (repo.license.spdx_id || repo.license.name) : '';

        const cardHtml = `
            <a href="${repo.html_url}" target="_blank" class="card-link">
                <div class="github-card">
                    <div class="card-header">
                        <h3>${repo.name}</h3>
                        <div class="card-stats">
                            <span title="Forks"><i class='bx bx-git-repo-forked stat-fork'></i> ${repo.forks_count}</span>
                            <span title="Estrellas"><i class='bx bxs-star stat-star'></i> ${repo.stargazers_count}</span>
                        </div>
                    </div>
                    <p>${repo.description || 'Sin descripción disponible.'}</p>
                    <div class="card-footer">
                        <div class="card-topics">${topicsHtml}</div>
                        <span class="card-license">${licenseText}</span>
                    </div>
                </div>
            </a>
        `;
        container.innerHTML += cardHtml;
    });

    renderPaginationControls();
}

function renderPaginationControls() {
    const totalPages = Math.ceil(allRepos.length / itemsPerPage);
    paginationContainer.innerHTML = ''; 

    if (totalPages <= 1) return; 

    // Previous
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="bx bx-chevron-left"></i> Previous';
    prevBtn.className = `page-btn nav-btn ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.onclick = () => { if (currentPage > 1) changePage(currentPage - 1); };
    paginationContainer.appendChild(prevBtn);

    // Números
    for (let i = 1; i <= totalPages; i++) {
        const numBtn = document.createElement('button');
        numBtn.innerText = i;
        numBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        numBtn.onclick = () => changePage(i);
        paginationContainer.appendChild(numBtn);
    }

    // Next
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = 'Next <i class="bx bx-chevron-right"></i>';
    nextBtn.className = `page-btn nav-btn ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.onclick = () => { if (currentPage < totalPages) changePage(currentPage + 1); };
    paginationContainer.appendChild(nextBtn);
}

function changePage(newPage) {
    renderPage(newPage);
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
//      MENÚ RESPONSIVE (CORREGIDO)
// ==========================================
// Usamos const o let solo si no se han declarado antes, 
// pero para evitar conflictos, simplemente seleccionamos directamente.

const menuIconBtn = document.querySelector('#menu-icon');
const navbarMenu = document.querySelector('.navbar');

if(menuIconBtn && navbarMenu) {
    menuIconBtn.onclick = () => {
        menuIconBtn.classList.toggle("bx-x");
        navbarMenu.classList.toggle('active');
    };
}

// Arrancar todo
initPortfolio();
