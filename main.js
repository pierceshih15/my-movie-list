// Declare API 變數
const BASE_URL = 'https://movie-list.alphacamp.io/';
const INDEX_URL = BASE_URL + 'api/v1/movies/';
const POSTERS_URL = BASE_URL + '/posters/';
const data = [];
let searchData = [];

// Display Movie List
const dataPanel = document.getElementById('data-panel');

// Search Bar
const searchBtn = document.getElementById('submit-search');
const searchInput = document.getElementById('search');

// Paginaton 
const paginaton = document.querySelector('.pagination');
// 每頁呈現 12 筆資料
const ITEM_PER_PAGE = 12;
// 宣告 預設共用變數，可供無資料傳入時使用 
let paginationData = [];

// 宣告 變數 card and list
const card = document.getElementById('card');
const list = document.getElementById('list');

// 宣告共用變數 displayMethod，預設為 card，讓預設頁面可點擊分頁，讓其作為參數放入不同函式執行
let displayMethod = 'card';
// 宣告共用變數 targetPage，預設為 1，以便在同一頁面上切換卡片清單或是列表清單，讓其作為參數放入不同函式執行
let targetPage = 1;


// 初始化，取得APIData
CatchAPIData();

// 監聽事件，促發 POP-UP 內容
dataPanel.addEventListener('click', (e) => {
    // 當使用者點擊 card-footer 中的 button
    if (e.target.matches('.btn-show-movie')) {
        // dataset 抓出特定資料，以利後續操作
        console.log(e.target.dataset.id);
        let id = e.target.dataset.id;
        showMovie(id);
    } else if (e.target.matches('.btn-add-favorite')) {
        // console.log(e.target.dataset.id);
        let favoriteId = e.target.dataset.id;
        addFavoriteItem(favoriteId);
    }
})

// SearchBtn 監聽事件
searchBtn.addEventListener('click', event => {
    // 移除預設事件
    event.preventDefault();
    let results = [];

    const regex = new RegExp(searchInput.value, 'i');
    results = data.filter(movie => movie.title.match(regex));
    // console.log(results.length);

    // 新增搜尋結果的判斷式
    // 1. 若沒有符合的結果，則請使用者重新嘗試，並清空搜尋欄位
    if (results.length == 0) {
        searchInput.value = '';
        alert('目前沒有符合搜尋條件之結果，請重新嘗試！');
    } else if (searchInput.value == '') {
        // 2. 若搜尋欄位內容為空，則提醒使用者再次搜尋，並顯示為原始畫面
        alert('目前無任何搜尋條件優，請重新輸入搜尋資訊！');
        displayDataList(data, displayMethod);
    } else {
        // 3. 搜尋條件符合時，則正常運作
        // 將搜尋結果宣告為 預設共用變數 searchData
        searchData = results;
        console.log("搜尋後的資料", searchData);

        // 先判斷搜尋時的頁面，若不在第一頁，則將其預設為 1
        if (targetPage != 1) {
            targetPage = 1;
        }

        // 調用 getTotalPage()，傳入 searchData 參數，以利搜尋後分頁顯示
        getTotalPage(searchData);

        // 調用 getPageData()，傳入 targetPage, searchData 和 displayMethod 參數，以利搜尋後頁面顯示
        // console.log(targetPage, displayMethod);
        getPageData(targetPage, searchData, displayMethod);
    }
})

// paginaton 監聽事件
paginaton.addEventListener('click', e => {
    // 移除預設事件
    e.preventDefault();
    // 以 dataset 取出特定的 page 值
    targetPage = e.target.dataset.page;
    // console.log(targetPage)

    if (e.target.tagName === "A") {
        // console.log(paginationData);
        // 此時透過 getPageData 函式判斷，paginationData 為搜尋前資料或是搜尋後資料
        getPageData(targetPage, paginationData, displayMethod);
    }
})

// 監聽 card 事件
card.addEventListener('click', e => {
    // 移除預設事件
    e.preventDefault();

    // 點擊後，改變 displayMethod 值
    displayMethod = 'card';

    // 點擊後，移除和新增 hover-color-change，讓卡片和列表模式之間的切換更為明顯
    list.classList.remove('hover-color-change');
    card.classList.add('hover-color-change');

    // 判斷 searchData 內是否有資料
    if (searchData.length == 0) {
        // console.log(searchData.length);
        // 如果沒有，則使用預設的 data 資料（搜尋前）
        // 更新分頁資訊
        getTotalPage(data);
        // 透過 getPageData 可即時更新分頁內容 和 自由切換卡片清單或列表清單
        getPageData(targetPage, data, displayMethod);
    } else {
        // 如果有，則使用 searchData 資料（搜尋後）
        getTotalPage(searchData);
        // 透過 getPageData 可即時更新分頁內容 和 自由切換卡片清單或列表清單
        getPageData(targetPage, searchData, displayMethod);
    }

    // 點擊後，清空搜尋欄位值
    searchInput.value = '';
});

// 監聽 list 事件
list.addEventListener('click', e => {
    // 移除預設事件
    e.preventDefault();

    // 點擊後，改變 displayMethod 值
    displayMethod = 'list';

    // 點擊後，移除和新增 hover-color-change，讓卡片和列表模式之間的切換更為明顯
    card.classList.remove('hover-color-change');
    list.classList.add('hover-color-change');

    // 判斷 searchData 內是否有資料
    if (searchData.length == 0) {
        // 如果沒有，則使用預設的 data 資料（搜尋前）
        // 更新分頁資訊
        getTotalPage(data);
        // 透過 getPageData 可即時更新分頁內容 和 切換卡片清單或列表清單
        getPageData(targetPage, data, displayMethod);
    } else {
        // 如果有，則使用 searchData 資料（搜尋後）
        getTotalPage(searchData);
        // 透過 getPageData 可即時更新分頁內容 和 切換卡片清單或列表清單
        getPageData(targetPage, searchData, displayMethod);
    }

    // 點擊後，清空搜尋欄位值
    searchInput.value = '';
});

// 取得API資料
function CatchAPIData() {
    // Catch API Data
    axios.get(INDEX_URL).then((response) => {
        data.push(...response.data.results);
        console.log(data);
        // 觸發 displayDataList 函式，第一次顯示
        // displayDataList(data);

        // Step1：觸發 getTotalPage 函式，顯示 Pagination UI
        getTotalPage(data);
        // 觸發 getPageData 函式，同時，調用 displayDataList 函式，將資料完整顯示
        // 從 參數 Page 1 開始執行
        getPageData(1, data);
    }).catch((error) => console.log(error));
}

// 取得電影的詳細資料
function showMovie(id) {
    // get element
    const modalTitle = document.getElementById('show-movie-title');
    const modalImage = document.getElementById('show-movie-image');
    const modalDate = document.getElementById('show-movie-date');
    const modalDescription = document.getElementById('show-movie-description');

    // set request url
    const url = INDEX_URL + id;
    // console.log(url);

    // send request to show api
    axios.get(url).then((response) => {
        const data = response.data.results;
        console.log(data);

        // insert data to modal ui
        modalTitle.textContent = data.title;
        modalImage.innerHTML = `<img src="${POSTERS_URL}${data.image}" class="img-fluid" alt="Responsive image">`;
        modalDate.textContent = `release at: ${data.release_date}`;
        modalDescription.textContent = `${data.description}`;
    })
}

// 將電影加入我的最愛
function addFavoriteItem(favoriteId) {
    // 若為 localStorage 為空時，先建立一個空陣列
    // 若不為空陣列時，透過 getItem，取出 favoriteMovies 屬性內的值（string），並轉為（number）
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    // 宣告 movie 變數為 data 透過 find 語法，找出 id 相同的值
    const movie = data.find(item => item.id === Number(favoriteId));

    // 判斷
    // 若 list 中已有 id 相同的值，則回覆 已存在
    if (list.some(item => item.id === Number(favoriteId))) {
        alert(`Oops ~~~ ${movie.title} is alreay in your favorite list.`);
    } else {
        // 反之，則將 特定 id 的 movie 加入 list 中
        list.push(movie);
        alert(`Added ${movie.title} to your favorite list!!!`);
    }

    // 最後，再將 list 資料轉為 string 存入 favoriteMovies 屬性中
    localStorage.setItem('favoriteMovies', JSON.stringify(list));
}

function displayDataList(data, displayMethod) {
    // 透過displayMethod 判斷決定呈現哪種方式
    if (displayMethod === undefined || displayMethod === 'card') {
        let htmlContent = '';
        data.forEach((item) => {
            htmlContent += `
            <div class="col-sm-3">
                <div class="card mb-3 scaleEffect">
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
        `;
        });
        // console.log(`我是 card !!! 目前在第 ${targetPage} 頁`);
        dataPanel.innerHTML = htmlContent;
    } else if (displayMethod === 'list') {
        let htmlContent = '';
        data.forEach((item) => {
            htmlContent += `
            <div class="col-12 border-top border-bottom py-2 mb-3 d-block scaleEffect">
                <h6 class="col-7 d-inline-block">${item.title}</h6>
                <div class="col-3 d-inline-block"">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                </div>
            </div>
        `;
        });
        dataPanel.innerHTML = htmlContent;
        // console.log(`我是 list !!! 目前在第 ${targetPage} 頁`);
    }
}

// getTotalPage 函式重新渲染 pagination，讓其在 Catch API 的函式中使用
function getTotalPage(data) {
    // 宣告 totalPage 為 data 資料量 / 每頁資料，預設為 1 頁
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1;
    let pageItemContent = '';

    // for 迴圈跑 pagination 顯示內容
    for (let i = 0; i < totalPages; i++) {
        pageItemContent += `
            <li class="page-item">
                <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
            </li>
        `;
    }
    paginaton.innerHTML = pageItemContent;
}

// getPageData 函式，傳入兩個參數 pageNum, data 顯示分頁後的資料
// 新增 displayMethod 參數
function getPageData(pageNum, data, displayMethod) {
    // 若 getPageData() 無參數傳入時，以 paginationData 作為資料來源
    // 若 有參數傳入，則有下列兩種情況
    // 1. 若無搜尋結果，則使用預設的 data 資料（搜尋前）
    // 2. 若有搜尋結果，則使用 searchData = data 資料（搜尋後）
    paginationData = data || paginationData;

    // 宣告 offset 為 每頁要顯示的內容 從 data index排序
    let offset = (pageNum - 1) * ITEM_PER_PAGE;
    // 以 slice()語法 從 data 中取出相符的資料，並賦予 pageData
    // 每次都從 offset 為起點開始取出，每次 12 筆資料
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE);

    // 最後，再調用 displayDataList 函式，並傳入 pageData 參數  
    // 新增 displayMethod 參數
    displayDataList(pageData, displayMethod);
}