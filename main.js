// Declare API 變數
const BASE_URL = 'https://movie-list.alphacamp.io/';
const INDEX_URL = BASE_URL + 'api/v1/movies/';
const POSTERS_URL = BASE_URL + '/posters/';
const data = [];

(function () {
    // Catch API Data
    axios.get(INDEX_URL).then((response) => {
        data.push(...response.data.results)
        console.log(data)
        // 觸發函式顯示
        displayDataList(data);
    }).catch((error) => console.log(error))

})()

// Display Movie List
const dataPanel = document.getElementById('data-panel')

// 監聽事件，促發 POP-UP 內容
dataPanel.addEventListener('click', (e) => {
    // 當使用者點擊 card-footer 中的 button
    if (e.target.matches('.btn-show-movie')) {
        // dataset 抓出特定資料，以利後續操作
        console.log(e.target.dataset.id);
        let id = e.target.dataset.id;
        showMovie(id);
    } else if (e.target.matches('.btn-add-favorite')) {
        console.log(e.target.dataset.id);
        let favoriteId = e.target.dataset.id
        addFavoriteItem(favoriteId);
    }
})

// showMovie 函式
function showMovie(id) {
    // get element
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url);

    // send request to show api
    axios.get(url).then((response) => {
        const data = response.data.results;
        console.log(data)

        // insert data to modal ui
        modalTitle.textContent = data.title;
        modalImage.innerHTML = `<img src="${POSTERS_URL}${data.image}" class="img-fluid" alt="Responsive image">`
        modalDate.textContent = `release at: ${data.release_date}`
        modalDescription.textContent = `${data.description}`
    })
}

// addFavoriteItem 函式
function addFavoriteItem(favoriteId) {
    // 若為 localStorage 為空時，先建立一個空陣列
    // 若不為空陣列時，透過 getItem，取出 favoriteMovies 屬性內的值（string），並轉為（number）
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    // 宣告 movie 變數為 data 透過 find 語法，找出 id 相同的值
    const movie = data.find(item => item.id === Number(favoriteId))

    // 判斷
    // 若 list 中已有 id 相同的值，則回覆 已存在
    if (list.some(item => item.id === Number(favoriteId))) {
        alert(`Oops ~~~ ${movie.title} is alreay in your favorite list.`)
    } else {
        // 反之，則將 特定 id 的 movie 加入 list 中
        list.push(movie)
        alert(`Added ${movie.title} to your favorite list!!!`)
    }

    // 最後，再將 list 資料轉為 string 存入 favoriteMovies 屬性中
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


function displayDataList(data) {
    let htmlContent = ''
    data.forEach((item, index) => {
        htmlContent += `
            <div class="col-sm-3">
                <div class="card mb-2">
                    <img class="card-img-top" src="${POSTERS_URL}${item.image}" alt="Card image cap">
                    <div class="card-body movie-item-body">
                        <h6 class="card-title">${item.title}</h6>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                    </div>
                </div>
            </div>
        `
    });
    dataPanel.innerHTML = htmlContent;
}

// Search Bar
const searchBtn = document.getElementById('submit-search');
const searchInput = document.getElementById('search')

// SearchBtn 事件綁定
searchBtn.addEventListener('click', event => {
    // 移除預設事件
    event.preventDefault();
    let results = [];

    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))
    // console.log(results);

    displayDataList(results);
})