const rootDiv = document.getElementById('root')
const priceBtn = document.getElementById('price-btn')
const searchInput = document.getElementById('search-input')
const API_URL = 'http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline' 

let shouldSort = false
let shouldFilter = false 
let originalProducts = null
let keyword = ''


// 상품 정보로부터 엘레먼트 생성
function buildElement(product){
    const item = document.createElement('div') 
    item.className = 'product'

    item.innerHTML = `
                      <div class='product-img'><img src=${product.image_link} alt=${product.name}/></div>
                      <div class='product-name'>${product.name} ($${product.price})</div>
                      <div class='product-description'>${product.description}</div>
                      <div class='product-type'>${product.product_type}</div>
                  `
    return item
}

// 상품 배열을 이용하여 화면에 렌더링하기
function displayProducts(products){
    rootDiv.innerHTML = '' // 화면 초기화
    products.forEach(product => {
        rootDiv.appendChild(buildElement(product))
    })
}

function updateProducts(products, keyword){
    let newProducts = [...products] // 원본배열 복사하기
    if(shouldFilter){  // 조건 쿼리 (conditional query)
        newProducts = newProducts.filter(product => product.product_type.toLowerCase().includes(keyword.toLowerCase()))
    } 
    if(shouldSort){
        newProducts.sort( (p1, p2) => parseFloat(p1.price) - parseFloat(p2.price) ) 
    }
    return newProducts
}

// 상품유형 검색하기
function searchProducts(e){
    shouldFilter = e.target.value !== '' // 사용자 입력여부 검사하기
    keyword = e.target.value
    console.log(shouldFilter)

    const newProducts = updateProducts(originalProducts, keyword) // 검색 및 정렬하기
    displayProducts(newProducts) // 화면 업데이트

}

// 가격 낮은순으로 정렬하기
function sortByPrice(e){
    shouldSort = !shouldSort // 상태 토글하기
    console.log(shouldSort)

    const newProducts = updateProducts(originalProducts, keyword) // 검색 및 정렬하기
    displayProducts(newProducts) // 화면 업데이트 
}

// 서버에서 데이터 가져오기
fetch(API_URL)
.then(function(res){
    return res.json()
})
.then(function(products){
    originalProducts = products // 원본 데이터 저장
    displayProducts(products) // 초기 렌더링

    // 서버에서 데이터 가져오기가 완료되면 이벤트 연결하기 => 만약 then 메서드 밖에서 이벤트 연결하면 서버에서 데이터 가져오기도 전에 사용자가 클릭하거나 검색하므로 에러날 수도 있음
    priceBtn.addEventListener('click', sortByPrice)
    searchInput.addEventListener('input', searchProducts)
})
