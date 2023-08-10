/*

// Создание кнопки
var button = document.createElement('button');
button.textContent = 'Переключить блоки';
button.style.position = 'fixed';
button.style.bottom = '10px';
button.style.left = '10px';
document.body.appendChild(button);

// Обработчик клика по кнопке
button.addEventListener('click', function () {
    var windowOne = document.querySelector('.Window_One');
    var windowTwo = document.querySelector('.Window_Two');

    if (windowOne.hasAttribute('hidden')) {
        windowOne.removeAttribute('hidden');
        windowTwo.setAttribute('hidden', 'true');
    } else {
        windowOne.setAttribute('hidden', 'true');
        windowTwo.removeAttribute('hidden');
    }
});






































// Создание кнопки
var button2 = document.createElement('button');
button2.textContent = 'Получить случайное слово и скопировать ссылку';
button2.style.position = 'fixed';
button2.style.bottom = '30px'; // На 20 пикселей выше первой кнопки
button2.style.left = '10px';
document.body.appendChild(button2);

// Обработчик события клика по кнопке
button2.onclick = function () {
    var words = ['AA12', 'M4A1', 'AK-47', 'Sniper']; // Здесь должен быть ваш список слов
    var randomWord = getRandomWord(words);

    // Обновление URL страницы
    var newUrl = window.location.href.split('?')[0] + '?share=' + randomWord;
    window.location.href = newUrl;

    // Копирование ссылки в буфер обмена
    navigator.clipboard.writeText(newUrl)
        .then(function () {
            alert('Ссылка скопирована в буфер обмена, спасибо :3');
        })
        .catch(function (error) {
            alert('Ошибка при копировании ссылки. Пожалуйста сообщите чтобы мы её исправили, спасибо :3', error);
        });
};

// Функция для получения случайного слова из списка
function getRandomWord(words) {
    var randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// Создание кнопки
var button3 = document.createElement('button');
button3.textContent = 'Получить адресную строку и случайное слово';
button3.style.position = 'fixed';
button3.style.bottom = '70px'; // На 20 пикселей выше первой кнопки
button3.style.left = '10px';
document.body.appendChild(button3);

// Функция обработки клика по кнопке
function handleClick() {
    var url = window.location.href;
    var searchParams = new URLSearchParams(url.split('?')[1]);
    var randomWord = searchParams.get('share');

    // Вывод результатов в консоль
    console.log('Адресная строка:', url);
    console.log('Случайное слово:', randomWord);
}

// Привязка функции обработки клика к событию onclick кнопки
button3.onclick = handleClick;



*/
/*
var adminButtons = document.createElement("div");
adminButtons.className = "admin-buttons";
adminButtons.style.position = "fixed";
adminButtons.style.bottom = "10px";
adminButtons.style.left = "10px";
document.body.appendChild(adminButtons);

var buttonNames = [
    "Получить Темы - установить",
    "Загрузить ссылку",
    "Добавить о. к сравнению",
    "Установить мониторинг",
    "Переключить окна",
    "Voxel вид",
    "Открыть настройки"
];

buttonNames.forEach(function (buttonName) {
    var button = document.createElement("button");
    button.className = "admin-button";
    button.textContent = buttonName;
    button.addEventListener("click", function () {
        alert("Вы нажали кнопку '" + buttonName + "'");
    });
    adminButtons.appendChild(button);

    // Добавляем отступ между кнопками
    var spacer = document.createElement("div");
    spacer.style.height = "10px";
    adminButtons.appendChild(spacer);
});
*/





function stringToHex(text) {
    let hexString = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i).toString(16);
        hexString += charCode.padStart(4, '0'); // Дополняем код символа нулями, чтобы получить 4 цифры
    }
    return hexString;
}

function getShareLink(button) {
    // Получение значения атрибута "share" из кнопки
    const shareValue = button.getAttribute('share');

    // Проверка наличия значения атрибута "share"
    if (shareValue) {
        // Кодируем значение атрибута в 16-ричный код
        const encodedShareValue = stringToHex(shareValue).replace(/\s+/g, '_');

        // Создание ссылки с полученным значением атрибута "share" (с нижними подчеркиваниями, если есть пробелы)
        const link = `https://blockadebook.ru/maps.html?share=${encodedShareValue}`;
        console.warn(link);

        // Копируем ссылку в буфер обмена
        copyToClipboard(link);

        // Сообщаем пользователю, что ссылка была скопирована
        alert('Ссылка скопирована в буфер обмена.');
    } else {
        console.warn('Ссылка не сработала');
    }
}




function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}




function handleImageMapPrevVisible() {
    // Ваш код для обработки видимости блока ImageMapPrev
    // ...

    console.log("Блок ImageMapPrev видим");
    scrollBlocks(); // Запуск функции прокрутки блоков после видимости ImageMapPrev
}

function scrollBlocks() {
    // Получение всех блоков с заданным айди
    const blocks = document.querySelectorAll("[id^='CloneImageRoCorucel']");

    let currentIndex = 0; // Индекс текущего блока

    // Функция для прокрутки блоков
    function scrollToNextBlock() {
        if (currentIndex >= blocks.length) {
            currentIndex = 0; // Вернуться к первому блоку, если достигнут конец массива
        }

        // Прокрутка к текущему блоку
        blocks[currentIndex].scrollIntoView({
            behavior: "smooth"
        });

        currentIndex++; // Увеличение индекса для следующего блока
    }

    // Прокрутка к первому блоку
    blocks[0].scrollIntoView({
        behavior: "smooth"
    });

    // Установка интервала для прокрутки каждые 3 секунды
    setInterval(scrollToNextBlock, 3000);
}

// Получение блока ImageMapPrev
const imageMapPrev = document.getElementById("ImageMapPrev");

// Создание экземпляра наблюдателя за изменением видимости блока
const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            handleImageMapPrevVisible();
        }
    });
});

// Наблюдение за изменением видимости блока ImageMapPrev
observer.observe(imageMapPrev);






function scrollBack() {
    var container = document.querySelector('.Srav_Zone');
    var blockWidth = (0.24 * window.innerWidth) + 2;

    container.scrollLeft -= blockWidth;
}

function scrollForward() {
    var container = document.querySelector('.Srav_Zone');
    var blockWidth = (0.24 * window.innerWidth) + 2;

    container.scrollLeft += blockWidth;
}

function resetScroll() {
    var container = document.querySelector('.Srav_Zone');

    container.scrollLeft = 0;
}









function openSearchByName(CallBtn) {
    hideAllBlocks();
    document.getElementById('StandartCard').hidden = true;
    document.getElementById('SearchByType').hidden = true;
    document.getElementById('SearchByIvent').hidden = true;
    document.getElementById('SearchByName').hidden = false;

    CallBtn.classList.add('btnSelectedHead');
}

function openSearchByType(CallBtn) {
    hideAllBlocks();
    document.getElementById('StandartCard').hidden = true;
    document.getElementById('SearchByType').hidden = false;
    document.getElementById('SearchByIvent').hidden = true;
    document.getElementById('SearchByName').hidden = true;

    CallBtn.classList.add('btnSelectedHead');
}

function openSearchByIvent(CallBtn) {
    hideAllBlocks();
    document.getElementById('StandartCard').hidden = true;
    document.getElementById('SearchByType').hidden = true;
    document.getElementById('SearchByIvent').hidden = false;
    document.getElementById('SearchByName').hidden = true;

    CallBtn.classList.add('btnSelectedHead');
}

function openStandartCard(CallBtn) {
    hideAllBlocks();
    document.getElementById('StandartCard').hidden = false;
    document.getElementById('SearchByType').hidden = true;
    document.getElementById('SearchByIvent').hidden = true;
    document.getElementById('SearchByName').hidden = true;

    if (CallBtn != null) {
        CallBtn.classList.add('btnSelectedHead');
    }
}

function hideAllBlocks() {
    var buttons = document.getElementsByClassName('btnSelectedHead');
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove('btnSelectedHead');
    }
}



function hideAllBlocks2() {
    var buttons = document.getElementsByClassName('btnSelectedIvents');
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove('btnSelectedIvents');
    }
}

function openBattlePass(CallBtn) {
    if (!CallBtn.classList.contains('btnSelectedIvents')) {
        hideAllBlocks2();
        document.getElementById('BattlePass').hidden = false;
        document.getElementById('NewYear').hidden = true;
        document.getElementById('Hellowen').hidden = true;

        CallBtn.classList.add('btnSelectedIvents');
    } else {
        document.getElementById('BattlePass').hidden = true;
    }
}

function openNewYear(CallBtn) {
    if (!CallBtn.classList.contains('btnSelectedIvents')) {
        hideAllBlocks2();
        document.getElementById('BattlePass').hidden = true;
        document.getElementById('NewYear').hidden = false;
        document.getElementById('Hellowen').hidden = true;

        CallBtn.classList.add('btnSelectedIvents');
    } else {
        document.getElementById('NewYear').hidden = true;
    }
}

function openHellowen(CallBtn) {
    if (!CallBtn.classList.contains('btnSelectedIvents')) {
        hideAllBlocks2();
        document.getElementById('BattlePass').hidden = true;
        document.getElementById('NewYear').hidden = true;
        document.getElementById('Hellowen').hidden = false;

        CallBtn.classList.add('btnSelectedIvents');
    } else {
        document.getElementById('Hellowen').hidden = true;
    }
}

function clearSearchInput() {
    var searchInput = document.querySelector('.SearchInput');
    searchInput.value = '';
}

function clearSearchInput2() {
    var searchInput = document.querySelector('#SearchInputSrav');
    searchInput.value = '';
}

function openSravnenie(CallBtn) {
    document.querySelector('.Window_One').hidden = true;
    document.querySelector('.Window_Two').hidden = true;
    document.querySelector('.Window_Tree').hidden = false;

    var elementsWithAttribute = document.querySelectorAll('[thisbuttoncallsravnenie]');

    elementsWithAttribute.forEach(function (element) {
        element.removeAttribute('thisbuttoncallsravnenie');
    });

    if (!CallBtn.hasAttribute('thisbuttoncallsravnenie')) {
        CallBtn.setAttribute('thisbuttoncallsravnenie', '');
    }
}
function findSravnenieElement() {
    var elementsWithId = document.querySelectorAll('[id^="SravnenieOpennButton"]');

    elementsWithId.forEach(function (element) {
        if (element.hasAttribute('thisbuttoncallsravnenie')) {
            var buttonId = element.id;
            var windowToShow = buttonId.split(' ')[1];

            if (windowToShow === '_Window_One') {
                document.querySelector('.Window_One').hidden = false;
                document.querySelector('.Window_Two').hidden = true;
                document.querySelector('.Window_Tree').hidden = true;
            } else if (windowToShow === '_Window_Two') {
                document.querySelector('.Window_One').hidden = true;
                document.querySelector('.Window_Two').hidden = false;
                document.querySelector('.Window_Tree').hidden = true;
            }
        }
    });
}





function handleButtonClick(button,hValue) {
    var buttons = button.parentElement.querySelectorAll(".SSTT2");

    buttons.forEach(function (btn) {
        btn.classList.remove("buttonTops1");
    });

    button.classList.add("buttonTops1");

    // Далее можно вызвать вашу функцию filterWeaponsByType() с передачей выбранного значения
    handleGroup1Click(hValue);
}


function handleButtonClick2(button, hValue) {
    var buttons = button.parentElement.querySelectorAll(".SortSatt");

    buttons.forEach(function (btn) {
        btn.classList.remove("buttonTops1");
    });

    button.classList.add("buttonTops1");

    // Далее можно вызвать вашу функцию filterWeaponsByType() с передачей выбранного значения
    handleGroup2Click(hValue);
}


function handleButtonClick3(button, value) {
    var buttons = button.parentElement.querySelectorAll(".SortSatt");

    buttons.forEach(function (btn) {
        btn.classList.remove("buttonTops1");
    });

    button.classList.add("buttonTops1");

    // Далее можно вызвать вашу функцию filterWeaponsByType() с передачей выбранного значения
    handleGroup3Click(value);
}



function OpenWindowTwo() {
    document.querySelector('.Window_One').hidden = true;
    document.querySelector('.Window_Two').hidden = false;
    document.getElementById('logoandback').innerHTML = "Вернуться";
};

function OpenSkinsZone() {
    var CSWeap = document.querySelector('#containerSkinwWpis');

    if (CSWeap.hasAttribute('hidden')) {
        CSWeap.hidden = false;
    } else {
        CSWeap.hidden = true;
    }
}



function BackToOne() {
    var windowOne = document.querySelector('.Window_One');
    var windowTwo = document.querySelector('.Window_Two');
    if (windowOne.hasAttribute('hidden')) {
        windowOne.removeAttribute('hidden');
        windowTwo.setAttribute('hidden', 'true');
        document.getElementById('logoandback').textContent = "Вернуться";
    } else {
        windowOne.setAttribute('hidden', 'true');
        windowTwo.removeAttribute('hidden');
        document.getElementById('logoandback').textContent = "Справочник";
    }
    
}





function showBlockSrav() {
    var block = document.getElementById("SearchSravnenie"); // Замените "yourBlockId" на идентификатор вашего блока
    
    block.style.transform = "translateX(0vw)";
}

function HideBlockSrav() {
    var block = document.getElementById("SearchSravnenie"); // Замените "yourBlockId" на идентификатор вашего блока

    block.style.transform = "translateX(50vw)";
}



function toggleTableVisibility(sravPump) {
    var sravPumpLevel = sravPump.value;
    var tableStok = document.getElementById('TableStok');
    var tableFull = document.getElementById('TableFull');

    if (sravPumpLevel === 'Сток') {
        tableStok.hidden = false;
        tableFull.hidden = true;
    } else if (sravPumpLevel === 'Фулл') {
        tableStok.hidden = true;
        tableFull.hidden = false;
    } else {
        console.log('Некорректное значение sravPumpLevel');
    }
    findMinimumReinforcedValue();
}



