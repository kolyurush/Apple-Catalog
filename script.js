// Шаг 2. Переменные и типы
const shopName = 'ЦРММчик';
let year = 2026;

let allProducts = [];

function formatPrice(value) {
    return value.toLocaleString('ru-RU');
}

// Шаг 1. Контейнер для вывода
const productList = document.querySelector('#product-list');

// Шаг 2. Рендер списка
function renderProducts(list) {
    productList.innerHTML = '';
    for (const item of list) {
        const card = document.createElement('article');
        card.className = 'product-card';

        const badgeHtml = item.badge ? '<span class="badge">' + item.badge + '</span>' : '';

        card.innerHTML =
            badgeHtml +
            '<img src="' + item.img + '" alt="' + item.name + '">' +
            '<h3>' + item.name + '</h3>' +
            '<p>Цена: ' + formatPrice(item.price) + ' ' + item.unit + '</p>' +
            '<p><button class="btn-buy" data-id="' + item.id + '">' + item.buttonText + '</button></p>';

        productList.appendChild(card);
    }
}

// Шаг 2 (лекция 10). JSON.parse / JSON.stringify — демонстрация в консоли
const text = '{"name": "Тест", "price": 100}';
const obj = JSON.parse(text);
console.log(obj.name);
const back = JSON.stringify(obj);
console.log(back);

// Шаг 5. Сортировка без мутации исходного массива
function sortByPrice(list) {
    return list.slice().sort(function (a, b) {
        return a.price - b.price;
    });
}

// Шаг 3 (лекция 9). Запрос через fetch + Шаг 3 (лекция 10). Хранение загруженных данных
fetch('data.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log('Данные пришли');
        allProducts = data;

        console.log(shopName, year, allProducts.length);
        console.log(formatPrice(allProducts[0].price));

        renderProducts(allProducts);

        // Условия и циклы — дорогие товары в консоль
        for (const item of allProducts) {
            if (item.price > 10000) {
                console.log('Дорогой товар:', item.name);
            }
        }
    })
    .catch(function (error) {
        console.error('Ошибка загрузки:', error);
    });

console.log('Конец скрипта');

// Обработчики кликов фильтров
document.querySelector('#btn-all')
    .addEventListener('click', function () {
        renderProducts(allProducts);
    });

document.querySelector('#btn-cheap')
    .addEventListener('click', function () {
        const cheap = allProducts.filter(function (item) {
            return item.price <= 10000;
        });
        renderProducts(cheap);
    });

document.querySelector('#btn-sort')
    .addEventListener('click', function () {
        renderProducts(sortByPrice(allProducts));
    });

// Шаг 4. Фильтр по категории
document.querySelector('#category-filter')
    .addEventListener('change', function (event) {
        const value = event.target.value;
        if (value === 'all') {
            renderProducts(allProducts);
            return;
        }
        const filtered = allProducts.filter(function (item) {
            return item.category === value;
        });
        renderProducts(filtered);
    });

// Шаг 2. Валидация формы «Быстрый заказ»
const form = document.querySelector('#order-form');
const message = document.querySelector('#form-message');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const quantity = Number(form.elements.quantity.value);

    if (name.length < 2) {
        message.textContent = 'Укажите имя (минимум 2 символа)';
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        message.textContent = 'Укажите корректный email';
        return;
    }
    if (!(quantity >= 1 && quantity <= 10)) {
        message.textContent = 'Количество от 1 до 10';
        return;
    }

    message.textContent = 'Заказ принят! Спасибо, ' + name + '.';
    form.reset();
});

// Шаг 2. Проверка по словарю (учебная — на клиенте)
const users = [
    { login: 'admin', password: 'admin123' },
    { login: 'ivan', password: 'qwerty1' }
];

document.querySelector('#login-form')
    .addEventListener('submit', function (event) {
        event.preventDefault();
        const login = event.target.login.value.trim();
        const password = event.target.password.value;

        const found = users.some(function (u) {
            return u.login === login && u.password === password;
        });

        if (found) {
            sessionStorage.setItem('user', login);
            document.querySelector('#login-form').hidden = true;
            document.querySelector('#user-info').textContent = 'Вы вошли как: ' + login;
        } else {
            alert('Неверные данные');
        }
    });

// Если сессия уже есть (например, после перезагрузки) — сразу показываем, кто вошёл
if (sessionStorage.getItem('user')) {
    document.querySelector('#login-form').hidden = true;
    document.querySelector('#user-info').textContent = 'Вы вошли как: ' + sessionStorage.getItem('user');
}

// Шаг 3. Гейт для корзины — добавление товара только после входа
function addToCart(item) {
    if (!sessionStorage.getItem('user')) {
        alert('Войдите, чтобы добавить товар');
        return;
    }
    console.log('В корзину:', item.name);
}

// Карточки рендерятся динамически, поэтому слушаем клики через делегирование
productList.addEventListener('click', function (event) {
    if (!event.target.classList.contains('btn-buy')) {
        return;
    }
    const id = Number(event.target.dataset.id);
    const item = allProducts.find(function (p) {
        return p.id === id;
    });
    if (item) {
        addToCart(item);
    }
});
