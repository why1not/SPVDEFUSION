
// Функция для сохранения и загрузки выбранной темы
function changeTheme(theme) {
    var href;
    switch (theme) {
        case 'Winter':
            href = './CrossAssets/Thems/Winter.css';
            break;
        case '8 марта':
            href = './CrossAssets/Thems/8marta.css';
            break;
        case 'Dracula':
            href = './CrossAssets/Thems/Dracula.css';
            break;
        case 'Лето':
            href = './CrossAssets/Thems/Summer.css';
            break;
        case 'Классическая':
            href = './CrossAssets/Thems/Classik.css';
            break;
        case 'Nuar':
            href = './CrossAssets/Thems/Nuar.css';
            break;
        case 'Discordo':
            href = './CrossAssets/Thems/Discordo.css';
            break;
        case 'RetroWave':
            href = './CrossAssets/Thems/RetroWave.css';
            break;
        case 'Trifolium':
            href = './CrossAssets/Thems/Trifolium.css';
            break;
        case 'Harun':
            href = './CrossAssets/Thems/Harun.css';
            break;

            
    }
    document.getElementById('ThemsLink').href = href;

    // Сохранение выбранной темы
    localStorage.setItem('selectedTheme', theme);
}

// Загрузка сохраненной темы при загрузке страницы
window.addEventListener('load', function () {
    var savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        changeTheme(savedTheme);
    }
});

// Обработчик события изменения значения выбора темы
/*
var themeSelect = document.getElementById('themeSelect');
themeSelect.addEventListener('change', function () {
    var selectedTheme = themeSelect.value;
    changeTheme(selectedTheme);
});
*/





// Функция для сохранения значения настройки
function saveSmoothingSetting(value) {
    if (value.checked) {
        localStorage.setItem('smoothing', 'true');
        var linkElement = document.getElementById('SmoothinkLink');
        linkElement.href = './CrossAssets/Smooting/Smooth.css';
    } else {
        localStorage.setItem('smoothing', 'false');
        var linkElement = document.getElementById('SmoothinkLink');
        linkElement.href = './CrossAssets/Smooting/NonSmooth.css';
    }
}

// Функция для получения значения настройки
function getSmoothingSetting() {
    return localStorage.getItem('smoothing');
}

var checkbox = document.getElementById('cb3-8');
var linkElement = document.getElementById('SmoothinkLink');

// Проверяем сохраненное значение при загрузке страницы
var savedSetting = getSmoothingSetting();
console.log(savedSetting);
if (savedSetting === 'true') {
    checkbox.checked = true;
    linkElement.href = './CrossAssets/Smooting/Smooth.css';
} else if (savedSetting === 'false') {
    checkbox.checked = false;
    linkElement.href = './CrossAssets/Smooting/NonSmooth.css';
}

































var originalWidth, originalHeight;

if (window.innerWidth > 767) {
    originalWidth = 17 * window.innerWidth / 100;
    originalHeight = 27 * window.innerHeight / 100;
} else {
    originalWidth = 40 * window.innerWidth / 100;
    originalHeight = 20 * window.innerHeight / 100;
}


function setScale(value) {
    var width;
    var height;

    switch (value) {
        case '1':
            width = 0.5;
            height = 0.5;
            break;
        case '2':
            width = 0.75;
            height = 0.75;
            break;
        case '3':
            width = 1;
            height = 1;
            break;
        case '4':
            width = 1.25;
            height = 1.25;
            break;
        case '5':
            width = 1.5;
            height = 1.5;
            break;
        default:
            width = 1;
            height = 1;
            break;
    }

    //if (value === '1' || value === '2') {
     //   fontScale = parseFloat(value);
    //}

    //var originalFontHeight = 3.5; // Original font height in vh units

    var elements = document.getElementsByClassName('card');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        var newWidth = width * originalWidth;
        var newHeight = height * originalHeight; // Calculate the new font size

        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px'; // Set the new font size in vh units
    }

    // Сохраняем выбранное значение в localStorage
    localStorage.setItem('selectedScale', value);
    console.log('Установлено новое значение масштаба:', value);

    // Устанавливаем выбранное значение на радио-кнопке
    var selectedRadio = document.getElementById('scaleOption' + value);
    if (selectedRadio) {
        selectedRadio.checked = true;
        console.log('Установлен атрибут checked для радио-кнопки:', value);
    }
}


var scaleOptions = document.getElementsByName('radio');

// Восстанавливаем сохраненное значение при загрузке страницы
window.addEventListener('load', function () {
    var savedScale = localStorage.getItem('selectedScale');
    console.log('Загруженное сохраненное значение:', savedScale);
    if (savedScale) {
        // Вызываем функцию setScale для восстановления выбранного значения
        setScale(savedScale);
    } else {
        // Иначе устанавливаем стартовые значения
        setScale('3');
    }
});





























































































function clearLocalStorageKeys() {
    var keys = ['smoothing', 'selectedScale', 'selectedTheme'];
    var removedKeys = [];

    keys.forEach(function (key) {
        if (localStorage.getItem(key) !== null) {
            localStorage.removeItem(key);
            removedKeys.push(key);
        }
    });

    if (removedKeys.length > 0) {
        var message = 'Были удалены следующие настройки из localStorage: ' + removedKeys.join(', ');
        alert(message);
    } else {
        alert('Не удалось удалить ключи из localStorage.');
    }
}
