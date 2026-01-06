// كائن الترجمات
const translations = {
    en: {
        pms: "PRODUCT MANAGEMENT SYSTEM",
        id: "id",
        title: "Title",
        price: "Price",
        taxes: "Taxes",
        ads: "Ads",
        discount: "Discount",
        total: "total",
        totalLabel: "Total",
        create: "Create",
        search: "Search",
        SearchTitle: "Search By Title",
        SearchCategory: "Search By Category",
        count: "Count",
        category: "Category",
        update: "update",
        delete: "delete",
    },
    ar: {
        pms: "نظام إدارة المنتجات",
        id: "رقم",
        title: "اسم المنتج",
        price: "السعر",
        taxes: "الضرائب",
        ads: "الإعلانات",
        discount: "الخصم",
        total: "الإجمالي",
        totalLabel: "الإجمالي",
        create: "إنشاء",
        search: "بحث",
        SearchTitle: "بحث بالاسم",
        SearchCategory: "بحث بالفئة",
        count: "العدد",
        category: "الفئة",
        update: "تحديث",
        delete: "حذف",
    }
};

// داله تغير اللغه 

function setLanguage(lang) {
    currentLang = lang;

document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");

    if ((el.tagName === "INPUT" || el.tagName === "TEXTAREA") && el.placeholder !== undefined) {
        // للـ input و textarea
        el.placeholder = translations[lang][key] || el.placeholder;
    } else if (el.tagName === "BUTTON") {
        // للـ buttons
        el.textContent = translations[lang][key] || el.textContent;
    } else {
        // أي عنصر تاني عادي
        el.textContent = translations[lang][key] || el.textContent;
    }
});

    // تحديث زرار Create
    submit.textContent = translations[lang]["create"];

    // إزالة active من كل زرار أولاً
    document.querySelectorAll(".lang-switch button").forEach(btn => btn.classList.remove("active"));

    // إضافة active للزرار اللي اضغطت عليه
    if(lang === "en") {
        document.querySelector(".lang-switch button:first-child").classList.add("active");
    } else {
        document.querySelector(".lang-switch button:last-child").classList.add("active");
    }
}







let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');

let mood = 'create';
let tmp;

// get total
function getTotal()
{
    if(price.value != ''){
        let result = (+price.value + +taxes.value + +ads.value)
        - +discount.value;
        total.innerHTML = result;
        total.style.background = '#36694b85';
    }else{
        total.innerHTML = '';
        total.style.background = '#a00d02';
    }
}

// create product

let datapro;
if(localStorage.product != null){
    datapro = JSON.parse(localStorage.product);
}else{
    datapro =[];
}
showData()


submit.onclick = function(){
    let newpro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    }


    if(title.value != '' && price.value != '' && category.value != '' && newpro.count <= 1000) {
    if(mood === 'create'){
        if(newpro.count > 1){
            for(let i = 0; i < newpro.count; i++){
                datapro.push(newpro);
            }
        } else {
            datapro.push(newpro);
        }
    } else {
        datapro[tmp] = newpro;
        mood = 'create';
        submit.innerHTML = 'create';
        count.style.display = 'block';
    }
    clearData();
    datapro = datapro.filter(item => item != null);
    showData();
}

    // save localstorage
    localStorage.setItem('product', JSON.stringify(datapro));
    showData();
    
}

// clear inputs

function clearData(){
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

//read
function showData()
{
    getTotal()
    let table = '';
    for(let i = 0; i < datapro.length; i++){
        table += `
        <tr>
            <td>${i+1}</td>
            <td>${datapro[i].title}</td>
            <td>${datapro[i].price}</td>
            <td>${datapro[i].taxes}</td>
            <td>${datapro[i].ads}</td>
            <td>${datapro[i].discount}</td>
            <td>${datapro[i].total}</td>
            <td>${datapro[i].category}</td>
            <td>
            <button onclick="updateData(${i})" 
            id="update${i}">update</button>
            </td>
            <td>
            <button onclick="deleteData( ${i} )"
            id="delete${i}">delete</button>
            </td>
        </tr>
        `;


    }

    document.getElementById('tbody').innerHTML = table;
    let btnDelete = document.getElementById('deleteAll');
    if(datapro.length > 0){
        btnDelete.innerHTML = `
        <button onclick="deleteAll()">delete All (${datapro.length})
        </button>
        `
    }else{
        btnDelete.innerHTML = '';
    }

}

// delete 
function deleteData(i)
{
    datapro.splice(i, 1);
    localStorage.product = JSON.stringify(datapro);
    showData();
}
function deleteAll(){
    if(confirm('Are you sure you want to delete all products?')) {
        localStorage.clear();
        datapro.splice(0);
        showData();
    }
}

// count
// update
function updateData(i){
    title.value = datapro[i].title;
    price.value = datapro[i].price;
    taxes.value = datapro[i].taxes;
    ads.value = datapro[i].ads;
    discount.value = datapro[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = datapro[i].category;
    submit.innerHTML = 'Update';
    mood = 'update';
    tmp = i;
    scroll({
        top:0,
        behavior:'smooth',
    })
}

// search
let searchMood = 'title';

function getSearchMood(id) {
    let search = document.getElementById('search');

    if (id == 'searchTitle') {
        searchMood = 'title';
    } else {
        searchMood = 'category';
    }

    search.placeholder = 'Search By ' + searchMood;
    search.focus();
    search.value = '';
    showData();
}


function searchData(value)
{
    let table = '';
    for(let i =0; i < datapro.length; i++){
        if(searchMood == 'title'){  
            if(datapro[i].title.includes(value.toLowerCase())){
            table += `
        <tr>
            <td>${i+1}</td>
            <td>${datapro[i].title}</td>
            <td>${datapro[i].price}</td>
            <td>${datapro[i].taxes}</td>
            <td>${datapro[i].ads}</td>
            <td>${datapro[i].discount}</td>
            <td>${datapro[i].total}</td>
            <td>${datapro[i].category}</td>
            <td><button onclick="updateData(${i})" 
            id="update${i}">update</button></td>
            <td><button onclick="deleteData( ${i} )" 
            id="delete${i}">delete</button></td>
        </tr>
        `;

            }
        }
        else{

            if(datapro[i].category.includes(value.toLowerCase())){
            table += `
            <tr>
                <td>${i+1}</td>
                <td>${datapro[i].title}</td>
                <td>${datapro[i].price}</td>
                <td>${datapro[i].taxes}</td>
                <td>${datapro[i].ads}</td>
                <td>${datapro[i].discount}</td>
                <td>${datapro[i].total}</td>
                <td>${datapro[i].category}</td>
                <td>
                <button onclick="updateData(${i})" 
                id="update${i}">update</button>
                </td>
                <td>
                <button onclick="deleteData( ${i} )" 
                id="delete${i}">delete</button>
                </td>
            </tr>
            `;
            }
        }
    }
    document.getElementById('tbody').innerHTML = table;
}

// clean data



