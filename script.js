let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle("bx-x")
    navbar.classList.toggle('active');
};

const username = 'franmabb';
const container = document.getElementById('github-projects');

const reposDestacados = [
    'Web-sostenibilidad',       // favorito #1
    'Dynamic-DNS ',     // favorito #2
    'Python'     // favorito #3
]; 

// Función principal
async function getRepos() {
    try {
        
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
        let data = await response.json();

        container.innerHTML = ''; 

        const destacados = [];
        const otros = [];

        data.forEach(repo => {
            if (reposDestacados.includes(repo.name)) {
                destacados.push(repo);
            } else {
                otros.push(repo);
            }
        });

    
        destacados.sort((a, b) => {
            return reposDestacados.indexOf(a.name) - reposDestacados.indexOf(b.name);
        });

     
        const reposFinales = [...destacados, ...otros].slice(0, 6);


      
        reposFinales.forEach(repo => {
            
          
            let topicsHtml = '';
            if (repo.topics && repo.topics.length > 0) {
                topicsHtml = repo.topics.slice(0, 4).map(topic => 
                    `<span class="topic-tag">${topic}</span>`
                ).join('');
            }

            // Licencia
            const licenseText = repo.license ? (repo.license.spdx_id || repo.license.name) : '';

            // HTML
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
                            <div class="card-topics">
                                ${topicsHtml}
                            </div>
                            <span class="card-license">${licenseText}</span>
                        </div>
                    </div>
                </a>
            `;
            container.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error('Error cargando repositorios:', error);
    }
}

getRepos();
