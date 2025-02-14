const API_KEY = '996df8e23a361f055a648ff10f033606';  
const BASE_URL = 'https://api.themoviedb.org/3';
var idFilmes = []
armazenamento = localStorage
var filmn = []

async function randomPopularMovie() {

    const randomPage = Math.floor(Math.random() * 10+1);

    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${randomPage}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }
        
        const data = await response.json();
        const movies = data.results;

        const randomIndex = Math.floor(Math.random() * movies.length);
        const pMovie = movies[randomIndex]; 
    
        if (idFilmes.includes(pMovie.id) || pMovie.adult != false) {
            randomPopularMovie()
        } else {
            idFilmes.push(pMovie.id)

            const moviesContainer = document.getElementById('menuFilmes')
            const movieElement = document.createElement('div');

            movieElement.classList.add('cardInicial')
            movieElement.onclick = infosMovies
            movieElement.attributes.id = pMovie.id
       
            movieElement.innerHTML = `
            <img class="imagemFilme" src="https://image.tmdb.org/t/p/w200${pMovie.poster_path}" alt="${pMovie.title} poster"">
            <div class="card-body">
            <h4 class="card-title">${pMovie.title}</h4>
            </div>
            `;  
            moviesContainer.appendChild(movieElement); 
        }   
    } catch (error) {
        console.error("Erro ao buscar filmes populares:", error);
    }
}

async function searchMovie(mode,id) {
    if(mode == 1){
        const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=pt-BR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            movieDescripition(data);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
        mode = 0

    }else if(mode == 2){

        const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=pt-BR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            movieFav(data);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
        mode = 0

    }else{

    const query = document.getElementById('movie-query').value;

    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }
}

function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies-container'); 

    if(document.getElementsByClassName('card')){
        const movieRemoves = document.getElementsByClassName('card')

        for(var x = movieRemoves.length - 1; x >= 0;x--){
         movieRemoves[x].outerHTML = ''
        }
    }

    movies.forEach(movie => {
        const movieElement = document.createElement('div');

        movieElement.classList.add('card');
        movieElement.onclick = infosMovies
        movieElement.attributes.id = movie.id
        
        movieElement.innerHTML = `   
        <img class="imagemFilme" src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} poster"">
        <div class="card-body" id="Favoritar">
        <h4 class="card-title">${movie.title}</h4>
        </div>   
        `;  
        moviesContainer.appendChild(movieElement);
    });
}

function limpar(){
    const query = document.getElementById('movie-query')
    var xLimpar = document.getElementById('xLimpar')

    xLimpar.style.display = 'none'
    query.value = ''
    
    if(document.getElementsByClassName('card')){
        const movieRemoves = document.getElementsByClassName('card')

        for(var x = movieRemoves.length - 1; x >= 0;x--){
         movieRemoves[x].outerHTML = ''
        }
    }
}
function infosMovies(){
    var nmFile = this.attributes.id
    searchMovie(1,nmFile)
}

function movieDescripition(movie){
    const menuInicial = document.getElementById('menuInicial')
    const menuPesquisa = document.getElementById('menuPesquisa')
    const movieCont = document.getElementById('infoMovie')
    const labFav = document.getElementById('labFav')

    menuInicial.style.display = 'none'
    menuPesquisa.style.display = 'none'
    movieCont.style.display = 'block'

    const movieElement = document.createElement('div');
    
    movieElement.classList.add('inMovie');
    movieElement.id = movie.id

    movieElement.innerHTML = `
        <img class="imagemFilmef" src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} poster"">
        <div class="card-body">
        <p class="titleDescription">${movie.title}</p>
        <p class="dateDescreption">Data de lançamento ${movie.release_date}</p>
        <p class="overviewDescreption">${movie.overview}</p>
        </div>
    `;  

    movieCont.appendChild(movieElement); 
    
    if(document.getElementsByClassName('cardFav')){
        const movieFav = document.getElementsByClassName('cardFav')

         for(let x = 0; x < movieFav.length;x++){

            if(movieFav[x].attributes.id == movie.id){
                labFav.innerText = 'Desfavoritar'
                labFav.style.right = '20%'

                break
            }else{
                labFav.innerText = 'Favoritar'
                labFav.style.right = '23%'
            }
        }
    }
        
}

function sairInfo(){
    var contId = document.getElementsByClassName('inMovie')
  
    contId[0].outerHTML = ""

    const movieCont = document.getElementById('infoMovie')
    const btnSearch = document.getElementById('btnPesquisa')
    const menuInicial = document.getElementById('menuInicial')
    
    movieCont.style.display = 'none'
    btnSearch.style.display = 'none'
    menuInicial.style.display = 'block'
}

function filmesRecomendados(){
    var tam 
    if(localStorage.getItem('filmn') !== null && localStorage.getItem('filmn') !== 0){
        tam = parseInt(localStorage.getItem('filmn'))
    }else{
        tam = 0
    }
    
    const movieFavContainer = document.getElementById('menuFimesFav')
    const subTituloMenu = document.getElementById('subTituloMenuFav')
    
    for(let x = 1;x <= tam;x++){

     if(localStorage.getItem('filmn') !== null && localStorage.getItem('filmn') !== 0){
        movieFavContainer.style.display = 'block'
        subTituloMenu.style.display = 'block'

        let idfilmn = localStorage.getItem(x)

        searchMovie(2,idfilmn)
        }
    }

    for(let x = 0; x < 8;x++ ){
        randomPopularMovie()
    }
}

function menuPesquisarInfo(){
    sairInfo()
    const menuInicial = document.getElementById('menuInicial')
    const menuPesquisa = document.getElementById('menuPesquisa')
    const btnSearch = document.getElementById('btnPesquisa')

    menuInicial.style.display = 'none'
    menuPesquisa.style.display = 'block'
    btnSearch.style.display = 'block'
}

function menuPesquisar(){
    const menuInicial = document.getElementById('menuInicial')
    const menuPesquisa = document.getElementById('menuPesquisa')
    const btnSearch = document.getElementById('btnPesquisa')

    menuInicial.style.display = 'none'
    menuPesquisa.style.display = 'block'
    btnSearch.style.display = 'block'
}

function menuInicial(){
    const menuInicial = document.getElementById('menuInicial')
    const menuPesquisa = document.getElementById('menuPesquisa')
    const btnSearch = document.getElementById('btnPesquisa')

    menuInicial.style.display = 'block'
    menuPesquisa.style.display = 'none'
    btnSearch.style.display = 'none'
}

function favoritarFilme(){
    var filmId = document.getElementsByClassName('inMovie')
    const tam = localStorage.getItem('filmn')
    const labFav = document.getElementById('labFav')
    labFav.innerText = 'Desfavoritar'
    labFav.style.right = '20%'

   
    if(localStorage.getItem('filmn') !== null && localStorage.getItem('filmn') !== 0){
        var filmExist

        for(let x = 0;x <= tam;x++){
            let filmnExist = localStorage.getItem(x)

            if(filmId[0].id == filmnExist){
                const labFav = document.getElementById('labFav')

                filmExist = 'Sim'
    
                labFav.innerText = 'Favoritar'
                labFav.style.right = '23%'

                localStorage.removeItem(x)

                    for(let z = x;z <= tam;z++){
                        if(tam <= 1){
                            let menuFimesFav = document.getElementById('menuFimesFav')

                            menuFimesFav.style.display = 'none'

                            localStorage.setItem('filmn',0)

                        }else if(x == tam){
                            localStorage.removeItem(tam)
                            localStorage.setItem('filmn',tam-1)    

                        }else{
                            if(z == tam){
                                localStorage.removeItem(z)
                            }
                            var filmF = localStorage.getItem(z+1)

                            localStorage.setItem(z,filmF)
                            localStorage.setItem('filmn',tam-1)
                        }
                    }
                    const movieRemoves = document.getElementsByClassName('cardFav')

                    for(let p = movieRemoves.length - 1; p >= 0;p--){
                        movieRemoves[p].outerHTML = ''
                    }

                    const movieInicialRemoves = document.getElementsByClassName('cardInicial')

                    for(let p = movieInicialRemoves.length - 1; p >= 0;p--){
                    movieInicialRemoves[p].outerHTML = ''
                    }
                    filmesRecomendados()
                    break
                
            }else{
                filmExist = 'Nao'
            }
    }
    }else{
        filmExist = 'Nao'
    }
   
    if(filmExist == 'Nao'){
    const movieFavContainer = document.getElementById('menuFimesFav')
    const subTituloMenu = document.getElementById('subTituloMenuFav')

    movieFavContainer.style.display = 'block'
    subTituloMenu.style.display = 'block'

    filmn.push(filmId[0].id)

    if(localStorage.getItem('filmn') !== null && localStorage.getItem('filmn') !== 0){
        let tamanhoLocal = parseInt(localStorage.getItem('filmn')) 
        var tamanhoFav = tamanhoLocal + 1

        localStorage.setItem('filmn',tamanhoFav)
        localStorage.setItem(tamanhoFav,filmId[0].id)

    }else{
        localStorage.setItem(1,filmId[0].id)
        localStorage.setItem('filmn',1)
    }
    searchMovie(2,filmId[0].id)
    }
}

 function movieFav(movie){
    const movieFavContainer = document.getElementById('filmesFavoritos')
    const movieElement = document.createElement('div');

    movieElement.classList.add('cardFav');
    movieElement.onclick = infosMovies
    movieElement.attributes.id = movie.id
       
    movieElement.innerHTML = `
        <img class="imagemFilme" src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} poster"">
        <div class="card-body">
        <h4 class="card-title">${movie.title}</h4>
        </div>
    `;  
    movieFavContainer.appendChild(movieElement);
}

function  xLimpar(){
    const query = document.getElementById('movie-query')
    var xLimpar = document.getElementById('xLimpar')

    if(query.value !=  ''){
        xLimpar.style.display = 'block'

    }else{
        xLimpar.style.display = 'none'
    }
}