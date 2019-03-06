(function () {
    const BASE_URL = 'https://movie-list.alphacamp.io'
    const INDEX_URL = BASE_URL + '/api/v1/movies/'
    const POSTER_URL = BASE_URL + '/posters/'
    const dataPanel = document.getElementById('data-panel')
    // 從 main.js 的 localStorage而來
    const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []

    displayDataList(data)

    function displayDataList(data) {
        let htmlContent = ''
        data.forEach(function (item, index) {
            htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      `
        })
        dataPanel.innerHTML = htmlContent
    }

    // 監聽事件，促發 POP-UP 內容
    dataPanel.addEventListener('click', (e) => {
        // 當使用者點擊 card-footer 中的 button
        if (e.target.matches('.btn-show-movie')) {
            // dataset 抓出特定資料，以利後續操作
            console.log(e.target.dataset.id);
            let id = e.target.dataset.id;
            showMovie(id);
        } else if (e.target.matches('.btn-remove-favorite')) {
            console.log(e.target.dataset.id);
            let removeId = e.target.dataset.id
            removeFavoriteItem(removeId);
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
            modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
            modalDate.textContent = `release at: ${data.release_date}`
            modalDescription.textContent = `${data.description}`
        })
    }

    function removeFavoriteItem(removeId) {
        // 宣告 index 為 透過 findIndex 語法找出特定 id 的 movie
        const index = data.findIndex(item => item.id === Number(removeId))
        // 若 array 都沒有符合的物件，則 index 回傳 -1 並終止執行
        if (index === -1) return

        // 移除 index 本身的值
        data.splice(index, 1)
        // 更新 localStorage 的 data 值
        localStorage.setItem('favoriteMovies', JSON.stringify(data))

        // 再將新的 localStorage 內的 data 放入displayDataList 函式
        displayDataList(data)
    }
})()