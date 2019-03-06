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
        // 觸發 displayDataList 函式，第一次顯示
        // displayDataList(data);

        // Step1：觸發 getTotalPage 函式，顯示 Pagination UI
        getTotalPage(data);
        // 觸發 getPageData 函式，同時，調用 displayDataList 函式，將資料完整顯示
        // 從 參數 Page 1 開始執行
        getPageData(1, data)
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

    // 暫不使用 displayDataList 函式
    // displayDataList(results);

    // 調用 getTotalPage()，傳入 results 參數，以利搜尋後的頁面顯示
    getTotalPage(results)
    // 調用 getPageData()，傳入 預設第一頁 1 和 results 參數，以利搜尋後的頁面顯示
    getPageData(1, results)
})

// Paginaton 
const paginaton = document.querySelector('.pagination');
// 每頁呈現 12 筆資料
const ITEM_PER_PAGE = 12;

// getTotalPage 函式重新渲染 pagination，讓其在 Catch API 的立即函式中使用
function getTotalPage(data) {
    // 宣告 totalPage 為 data 資料量 / 每頁資料，預設為 1 頁
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = '';

    // for 迴圈跑 pagination 顯示內容
    for (let i = 0; i < totalPages; i++) {
        pageItemContent += `
            <li class="page-item">
                <a class="page-link" href="#" data-page="${i+1}">${i+1}</a>
            </li>
        `
    }
    paginaton.innerHTML = pageItemContent;
}

// paginaton 事件綁定
paginaton.addEventListener('click', e => {
    // 以 dataset 取出特定的 page 值
    e.preventDefault();
    console.log(e.target.dataset.page)
    if (e.target.tagName === "A") {
        getPageData(e.target.dataset.page);
    }
})


// 宣告 預設共用變數，可供無資料傳入時使用 
let paginationData = []

// getPageData 函式，傳入兩個參數 pageNum, data 顯示分頁後的資料
function getPageData(pageNum, data) {
    // 若 getPageData() 無參數傳入時，以 paginationData 作為資料來源
    // 若 有參數傳入，則以 data 作為資料來源
    paginationData = data || paginationData

    // 宣告 offset 為 每頁要顯示的內容 從 data index排序
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    // 以 slice()語法 從 data 中取出相符的資料，並賦予 pageData
    // 每次都從 offset 為起點開始取出，每次 12 筆資料
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)

    // 最後，再調用 displayDataList 函式，並傳入 pageData 參數
    displayDataList(pageData)
}