var jsonData;
var skinsData;
var shareValue;
Toastify({
    text: "Идет загрузка данных...",
    duration: 1500,
    close: true
}).showToast();
$(document).ready(function () {
    var spreadsheetId = '1WkxonETpPrDme6i3ZTt1ddB8e9YI19KBST1qTLl8BFs';
    var apiKey = 'AIzaSyCnXboKn76sNySWx3KZmPJPmDxC475iT_w';
    var sheetName = 'MapsData';
    var column = 'D';

    // Получение "глубины" столбца D
    var depthUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${column}:${column}?key=${apiKey}`;
    $.get(depthUrl, function (response) {
        var depth = response.values.length;

        // Формирование диапазона
        var range = `${sheetName}!A2:V${depth + 1}`;
        var dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

        // Получение данных
        $.get(dataUrl, function (response) {
            var values = response.values;

            // Преобразование данных в формат JSON
            jsonData = values.map(row => ({
                'Name': row[0],
                'MapID': row[1],
                'Builder': row[2],
                'Platform': row[3],
                'Description': row[4],
                'ImagesROW': row[5],
            }));

            console.table(jsonData);
        });
    });
    setTimeout(function () {

        Toastify({
            text: "Данные успешно загружены!",
            duration: 2000,
            close: true
        }).showToast();

    }, 500);
});

function hexToString(hex) {
    let string = '';
    for (let i = 0; i < hex.length; i += 4) {
        const charCode = parseInt(hex.substr(i, 4), 16);
        string += String.fromCharCode(charCode);
    }
    return string;
}

async function getShareValueFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareValue = urlParams.get('share');
    console.log(shareValue); // Выведет значение параметра "share" или null, если он отсутствует

    // Проверяем, что значение shareValue не пустое
    if (shareValue) {
       Toastify({
           text: 'Использованная вами ссылка на карту загружается..\nПодождите секунду..',
           duration: 4000, // Продолжительность отображения сообщения в миллисекундах
           close: true
       }).showToast();

        // Вместо простого тайм-аута, вам нужно получить данные для jsonData из асинхронного источника, например, с помощью AJAX запроса
        // Пример с тайм-аутом в 3 секунды для демонстрации
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('Значение в 16-ричном коде:');
        console.log(shareValue);

        // Обратное преобразование из 16-ричного кода в русский текст
        const russianShareValue = hexToString(shareValue);
        console.log('Обратное преобразование:');
        console.log(russianShareValue);

        // После получения данных или выполнения асинхронных операций, вызываем GETNameFromCard(russianShareValue)
        if (jsonData) {
            GETNameFromCard(russianShareValue);
        } else {
            console.log('jsonData is empty');
        }
    }
}
// Обработчик события DOMContentLoaded
document.addEventListener('DOMContentLoaded', async function () {
    await getShareValueFromURL();
});






function search(TextInput) {
    var text = TextInput.value.toLowerCase();
    var weaponName = [];
    for (var sindex = 0; sindex < jsonData.length; sindex++) {
        weaponName.push(jsonData[sindex].Name.toLowerCase());
    }
    var matchingWords = weaponName.filter(function (_weaponName) {
        return _weaponName.includes(text);
    });
    var resultContainer = document.getElementById("ResuldCardByName");

    if (text === '') {
        resultContainer.innerHTML = ""; // Очистить контейнер при пустом поле ввода
    } else if (matchingWords.length === 0) {
        console.log('Оружия с таким названием не найдено.. Попробуйте изменить запрос или сменить язык');
        resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов
        TextInput.classList.add('shake-animation');
    } else {
        TextInput.classList.remove('shake-animation');
        var cloneNode = document.getElementById("NodeToClone_rowResuldName").cloneNode(true);
        resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов

        matchingWords.forEach(function (matchingWord) {
            var resultItem = cloneNode.cloneNode(true);
            var typeWeaponElement = resultItem.querySelector("#twrr_TypeWeapon");
            var damageTypeElement = resultItem.querySelector("#twrr_DamageType");
            var nameWeaponElement = resultItem.querySelector("#twrr_WeaponName");
            var badgeElement = resultItem.querySelector("#twrr_Badge");

            // Устанавливаем значения типа оружия и типа урона
            var matchingItem = jsonData.find(function (item) {
                return item.Name.toLowerCase() === matchingWord;
            });

            typeWeaponElement.textContent = matchingItem.Builder;
            damageTypeElement.textContent = matchingItem.Platform;
            nameWeaponElement.textContent = matchingItem.Name;
            resultItem.setAttribute("onclick", 'GETNameFromCard(\'' + matchingItem.Name + '\');');

            if (matchingItem.Badge !== undefined) {
                badgeElement.src = "./assets/EventImage/" + matchingItem.Badge + ".png";
                badgeElement.hidden = false;
            } else {
                badgeElement.hidden = true;
            }

            resultContainer.appendChild(resultItem);
        });
    }
}





function findDistinctBuilders(button) {
    // Создаем пустой массив для хранения уникальных значений строителей
    const uniqueBuilders = [];
    const buildersZone = document.getElementById("BuildersZone");
    buildersZone.innerHTML = "";

    // Итерируемся по каждому объекту в jsonData
    for (let i = 0; i < jsonData.length; i++) {
        const builder = jsonData[i].Builder;

        // Проверяем, содержится ли строитель в массиве uniqueBuilders
        if (!uniqueBuilders.includes(builder)) {
            // Если строитель не содержится в массиве, добавляем его в массив
            uniqueBuilders.push(builder);

            // Клонируем блок и заменяем "Холодное" на имя строителя
            const clone = document.getElementById("NodeToClone_SortByTypeButton_Cold").cloneNode(true);
            clone.innerHTML = builder;

            // Заменяем onclick-обработчик на новый, использующий имя строителя
            clone.setAttribute("onclick", `filterWeaponsByBuilder('${builder}')`);

            // Вставляем клонированный блок в BuildersZone
            buildersZone.appendChild(clone);
        }
    }

    // Выводим уникальные значения строителей в консоль
    //console.log(uniqueBuilders);

    openSearchByType(button);
}




function filterWeaponsByBuilder(builder) {
    var filteredWeapons = jsonData.filter(function (weapon) {
        return weapon['Builder'] === builder;
    });

    var resultContainer = document.getElementById("CardZoneMain");
    resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов

    var cloneMainCard = document.getElementById("NodeToClone_MainCard").cloneNode(true);
    cloneMainCard.id = '';

    filteredWeapons.forEach(function (weapon) {
        var card = cloneMainCard.cloneNode(true);
        card.setAttribute("onclick", 'GETNameFromCard(\'' + weapon.Name + '\');');
        var mainCardImage = card.querySelector("#NTC_MC_image");
        var mainCardName = card.querySelector("#NTC_MC_name");

        mainCardImage.src = getFirstImageFromImagesArray(weapon.ImagesROW);
        mainCardName.textContent = weapon.Name;

        resultContainer.appendChild(card);
    });
    document.getElementById('SearchNameLabel').textContent = "Строитель: " + builder;
    openStandartCard();
}





















function getFirstImageFromImagesArray(images) {
    // Разделение строки на подстроки по запятой с пробелом
    const imageArray = images.split(", ");

    // Получение первого изображения из массива
    if (imageArray.length > 0) {
        const firstImage = imageArray[0];
        return "https://drive.google.com/uc?export=download&confirm=no_antivirus&id=" + firstImage;
    } else {
        console.error("Массив изображений пуст");
        return null;
    }
}

















function findDistinctPlatforms(button) {
    // Создаем пустой массив для хранения уникальных значений игровых платформ
    const uniquePlatforms = [];
    const platformsZone = document.getElementById("PlatformsZone");
    platformsZone.innerHTML = "";

    // Итерируемся по каждому объекту в jsonData
    for (let i = 0; i < jsonData.length; i++) {
        const platform = jsonData[i].Platform;

        // Проверяем, содержится ли игровая платформа в массиве uniquePlatforms
        if (!uniquePlatforms.includes(platform)) {
            // Если игровая платформа не содержится в массиве, добавляем ее в массив
            uniquePlatforms.push(platform);

            // Клонируем блок и заменяем "Холодное" на имя игровой платформы
            const clone = document.getElementById("NodeToClone_SortByTypeButton_Cold").cloneNode(true);
            clone.innerHTML = platform;

            // Заменяем onclick-обработчик на новый, использующий имя игровой платформы
            clone.setAttribute("onclick", `filterWeaponsByPlatform('${platform}')`);

            // Вставляем клонированный блок в PlatformsZone
            platformsZone.appendChild(clone);
        }
    }

    openSearchByIvent(button);
}




function filterWeaponsByPlatform(platform) {
    var filteredWeapons = jsonData.filter(function (weapon) {
        return weapon['Platform'] === platform;
    });

    var resultContainer = document.getElementById("CardZoneMain");
    resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов

    var cloneMainCard = document.getElementById("NodeToClone_MainCard").cloneNode(true);
    cloneMainCard.id = '';

    filteredWeapons.forEach(function (weapon) {
        var card = cloneMainCard.cloneNode(true);
        card.setAttribute("onclick", 'GETNameFromCard(\'' + weapon.Name + '\');');
        var mainCardImage = card.querySelector("#NTC_MC_image");
        var mainCardName = card.querySelector("#NTC_MC_name");

        mainCardImage.src = getFirstImageFromImagesArray(weapon.ImagesROW);
        mainCardName.textContent = weapon.Name;

        resultContainer.appendChild(card);
    });
    document.getElementById('SearchNameLabel').textContent = "Игровая платформа: " + platform;
    openStandartCard();
}







function showAllCards(button) {
    var resultContainer = document.getElementById("CardZoneMain");
    resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов

    var cloneMainCard = document.getElementById("NodeToClone_MainCard").cloneNode(true);
    cloneMainCard.id = '';

    jsonData.forEach(function (weapon) {
        var card = cloneMainCard.cloneNode(true);
        card.setAttribute("onclick", 'GETNameFromCard(\'' + weapon.Name + '\');');
        var mainCardImage = card.querySelector("#NTC_MC_image");
        var mainCardName = card.querySelector("#NTC_MC_name");

        mainCardImage.src = getFirstImageFromImagesArray(weapon.ImagesROW);
        mainCardName.textContent = weapon.Name;

        resultContainer.appendChild(card);
    });

    document.getElementById('SearchNameLabel').textContent = "Все карты";
    openStandartCard(button);
}








function GETNameFromCard(card) {
    var weaponName = card; // Получаем значение Name из JSON переменной

    // Ищем строку в JSON-массиве, где поле "Name" соответствует значению "Card"
    var matchingRow = jsonData.find(function (row) {
        return row.Name === weaponName;
    });
    console.log(matchingRow);
    if (matchingRow) {
        // Получаем элементы по уникальным идентификаторам и устанавливаем значения
        var seriesElement = document.getElementById("WPView_name");
        if (seriesElement) {
            seriesElement.textContent = matchingRow.Name;
        }

        var typeWeaponElement = document.getElementById("WPView_mapId");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.MapID;
        }

        var typeWeaponElement = document.getElementById("WPView_builder");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Builder;
        }

        var typeWeaponElement = document.getElementById("WPView_platform");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Platform;
        }
        var typeWeaponElement = document.getElementById("WPView_Descript");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Description;
        }



       // //var imageElement = document.getElementById("WPView_Image");
        //if (imageElement) {
            // "./assets/ItemIcons/" + matchingRow.Image + ".png"
            //imageElement.setAttribute("src", getFirstImageFromImagesArray(matchingRow.ImagesROW));
            //imageElement.setAttribute("alt", weaponName);
        //}







    }
    if (document.getElementById("WPView_name") != '') {
        OpenWindowTwo();
    }
    modifyArrayElements(matchingRow.ImagesROW);

    document.getElementById('ShareButton').setAttribute('share', weaponName);

}



function modifyArrayElements(images) {
    // Разделение строки на подстроки по запятой с пробелом
    const array = images.split(", ");

    const modifiedArray = array.map(function (element) {
        return "https://drive.google.com/uc?export=download&confirm=no_antivirus&id=" + element;
    });

    // Очистить элемент ImageMapPrev перед вставкой
    const imageMapPrev = document.getElementById("ImageMapPrev");
    imageMapPrev.innerHTML = "";

    // Создание и вставка элементов с модифицированными ссылками
    modifiedArray.forEach(function (image) {
        // Клонирование блока WPView_Image
        const clone = document.getElementById("WPView_Image").cloneNode(true);
        clone.setAttribute("src", image);
        clone.id = "CloneImageRoCorucel"; // Установка айди CloneImageRoCorucel

        // Вставка клонированного блока в элемент ImageMapPrev
        imageMapPrev.appendChild(clone);
    });

    //return modifiedArray;
}













































































let selectedGroup1Value = '';
let selectedGroup2Value = '';
let selectedGroup3Value = '';

function handleGroup1Click(value) {
    selectedGroup1Value = value;
    console.log('Selected Group 1 value:', selectedGroup1Value);
}

function handleGroup2Click(value) {
    selectedGroup2Value = value;
    console.log('Selected Group 2 value:', selectedGroup2Value);
}

function handleGroup3Click(value) {
    selectedGroup3Value = value;
    console.log('Selected Group 3 value:', selectedGroup3Value);
}

























function sortAndPrintStockTimeNoArmor() {
    if (
        selectedGroup2Value === '' ||
        selectedGroup1Value === '' ||
        selectedGroup3Value === ''
    ) {
        // Одна из переменных имеет пустую строку, функция не будет выполняться
        return;
    }
    document.getElementById("SearchNameLabel").textContent = selectedGroup2Value + " / " + selectedGroup1Value + " / " + selectedGroup3Value;

    jsonData.sort((a, b) => {
        const typeA = a.Builder;
        const typeB = b.Builder;

        if (typeA === selectedGroup1Value && typeB !== selectedGroup1Value) {
            return -1;
        }
        if (typeA !== selectedGroup1Value && typeB === selectedGroup1Value) {
            return 1;
        }

        // New conditions based on selectedGroup2Value and selectedGroup3Value
        const stockTimeA = getStockTime(a, selectedGroup2Value, selectedGroup3Value);
        const stockTimeB = getStockTime(b, selectedGroup2Value, selectedGroup3Value);

        // Add console.log to check the values returned by getStockTime
        //console.log(a.Name+' : '+stockTimeA);
        //console.log(b.Name + ' : ' +stockTimeB);

        // Convert stock times to numbers before comparing them
        return Number(stockTimeA) - Number(stockTimeB);
    });


    var resultContainer = document.getElementById("CardZoneMain");
    resultContainer.innerHTML = "";

    var cloneMainCard = document.getElementById("NodeToClone_MainCard").cloneNode(true);
    cloneMainCard.id = '';

    jsonData.forEach(function (weapon) {
        if (weapon.Builder === selectedGroup1Value) {
            var card = cloneMainCard.cloneNode(true);
            card.setAttribute("onclick", 'GETNameFromCard(\'' + weapon.Name + '\');');
            var mainCardImage = card.querySelector("#NTC_MC_image");
            var mainCardName = card.querySelector("#NTC_MC_name");

            mainCardImage.src = "./assets/ItemIcons/" + weapon.Image + ".png";
            mainCardName.textContent = weapon.Name;
            console.warn(weapon.Name + " : " + weapon.FullTimeReinforced);
            resultContainer.appendChild(card);
        }
    });

    openStandartCard();
}

function getStockTime(weapon, group2, group3) {
    if (group2 === "Без прокачки") {
        if (group3 === "Без брони") {
            return weapon.StockTimeNoArmor;
        } else if (group3 === "Обычная броня") {
            return weapon.StockTimeNormal;
        } else if (group3 === "Укреплённая броня") {
            return weapon.StockTimeReinforced;
        }
    } else if (group2 === "Полная прокачка") {
        if (group3 === "Без брони") {
            return weapon.FullTimeNoArmor;
        } else if (group3 === "Обычная броня") {
            return weapon.FullTimeNormal;
        } else if (group3 === "Укреплённая броня") {
            return weapon.FullTimeReinforced;
        }
    }
    // Default case
    return 0;
}






















/*Сортировка по листу скинов! */
function filterWeaponsByEdition(edition) {
    var filteredWeapons = skinsData.filter(function (weapon) {
        return weapon['Edition'] === edition;
    });

    var resultContainer = document.getElementById("CardZoneMain");
    resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов

    var cloneMainCard = document.getElementById("NodeToClone_MainCard").cloneNode(true);
    cloneMainCard.id = '';

    filteredWeapons.forEach(function (weapon) {
        var card = cloneMainCard.cloneNode(true);
        card.setAttribute("onclick", 'GETNameFromCardIvents(this);');
        card.setAttribute("BaseName", weapon.BaseWeaponName);
        card.setAttribute("ImageName", weapon.Image);
        var mainCardImage = card.querySelector("#NTC_MC_image");
        var mainCardName = card.querySelector("#NTC_MC_name");

        mainCardImage.src = "./assets/SkinsIcons/" + weapon.Image + ".png";
        mainCardName.textContent = weapon.SkinName;

        resultContainer.appendChild(card);
    });

    openStandartCard();
}



/*Сортировка по листу ТТХ! */
function filterWeaponsByEdition2(edition) {
    var filteredWeapons = jsonData.filter(function (weapon) {
        return weapon['MapID'] === edition;
    });

    filteredWeapons.sort(function (a, b) {
        var seriesA = a['MapID'];
        var seriesB = b['MapID'];

        if (seriesA < seriesB) {
            return -1;
        }
        if (seriesA > seriesB) {
            return 1;
        }
        return 0;
    });

    var resultContainer = document.getElementById("CardZoneMain");
    resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов

    var cloneMainCard = document.getElementById("NodeToClone_MainCard").cloneNode(true);
    cloneMainCard.id = '';
    

    filteredWeapons.forEach(function (weapon) {
        var card = cloneMainCard.cloneNode(true);
        card.setAttribute("onclick", 'GETNameFromCardIvents1(this);');
        var mainCardImage = card.querySelector("#NTC_MC_image");
        var mainCardName = card.querySelector("#NTC_MC_name");
        card.setAttribute("BaseName", weapon.Name);
        card.setAttribute("ImageName", weapon.Image);

        mainCardImage.src = "./assets/ItemIcons/" + weapon.Image + ".png";
        mainCardName.textContent = weapon.Name;

        resultContainer.appendChild(card);
    });

    openStandartCard();
}


function filterWeaponsByEd_Combo(edition) {
    filterWeaponsByEdition(edition);

    var filteredWeapons = jsonData.filter(function (weapon) {
        return weapon['MapID'] === edition;
    });

    filteredWeapons.sort(function (a, b) {
        var seriesA = a['MapID'];
        var seriesB = b['MapID'];

        if (seriesA < seriesB) {
            return -1;
        }
        if (seriesA > seriesB) {
            return 1;
        }
        return 0;
    });

    var resultContainer = document.getElementById("CardZoneMain");
    //resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов

    var cloneMainCard = document.getElementById("NodeToClone_MainCard").cloneNode(true);
    cloneMainCard.id = '';

    filteredWeapons.forEach(function (weapon) {
        var card = cloneMainCard.cloneNode(true);
        card.setAttribute("onclick", 'GETNameFromCardIvents1(this);');
        var mainCardImage = card.querySelector("#NTC_MC_image");
        var mainCardName = card.querySelector("#NTC_MC_name");
        card.setAttribute("BaseName", weapon.Name);
        card.setAttribute("ImageName", weapon.Image);

        mainCardImage.src = "./assets/ItemIcons/" + weapon.Image + ".png";
        mainCardName.textContent = weapon.Name;

        resultContainer.appendChild(card);
    });



}















































function getWeaponStats() {
    var percentProtection = parseInt(document.getElementById("PercentProtection").value);
    var percentDopDamage = parseInt(document.getElementById("PercentDopDamage").value);
    var pumpLevel = 0;
    var pumpLevelHelmet = 0;
    var pumpLevelArmor = 0;

    var pumpLevelValue = document.getElementById("PumpLevel").value;
    if (pumpLevelValue === "Сток") {
        pumpLevel = parseInt(document.getElementById("WPView_damageSt").textContent);
    } else if (pumpLevelValue === "Фулл") {
        pumpLevel = parseInt(document.getElementById("WPView_damageFl").textContent);
    }

    var pumpLevelHelmetValue = document.getElementById("PumpLevelHelmet").value;
    if (pumpLevelHelmetValue === "Без каски") {
        pumpLevelHelmet = 2;
    } else if (pumpLevelHelmetValue === "Обычная") {
        pumpLevelHelmet = 1.25;
    } else if (pumpLevelHelmetValue === "Укреплённая") {
        pumpLevelHelmet = 1.5;
    }

    var pumpLevelArmorValue = document.getElementById("PumpLevelArmor").value;
    if (pumpLevelArmorValue === "Без брони") {
        pumpLevelArmor = 100;
    } else if (pumpLevelArmorValue === "Обычная") {
        pumpLevelArmor = 125;
    } else if (pumpLevelArmorValue === "Укреплённая") {
        pumpLevelArmor = 150;
    }

    return {
        percentProtection: percentProtection,
        percentDopDamage: percentDopDamage,
        pumpLevel: pumpLevel,
        pumpLevelHelmet: pumpLevelHelmet,
        pumpLevelArmor: pumpLevelArmor
    };
}




function searchSrav(TextInput) {
    var text = TextInput.value.toLowerCase();
    var weaponName = [];
    for (var sindex = 0; sindex < jsonData.length; sindex++) {
        weaponName.push(jsonData[sindex].Name.toLowerCase());
    }
    var matchingWords = weaponName.filter(function (_weaponName) {
        return _weaponName.includes(text);
    });
    var resultContainer = document.getElementById("SravResultSearch");

    if (text === '') {
        resultContainer.innerHTML = ""; // Очистить контейнер при пустом поле ввода
    } else if (matchingWords.length === 0) {
        console.log('Оружия с таким названием не найдено.. Попробуйте изменить запрос или сменить язык');
        resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов
        TextInput.classList.add('shake-animation');
    } else {
        TextInput.classList.remove('shake-animation');
        var cloneNode = document.getElementById("NodeToClone_rowResuldNameSrav").cloneNode(true);
        resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов

        matchingWords.forEach(function (matchingWord) {
            var resultItem = cloneNode.cloneNode(true);

            // Устанавливаем значения типа оружия и типа урона
            var matchingItem = jsonData.find(function (item) {
                return item.Name.toLowerCase() === matchingWord;
            });

            
            resultItem.textContent = matchingItem.Name;
            resultItem.setAttribute("onclick", 'insertCellsAndImageToRows(\'' + matchingItem.Name + '\');');

            resultContainer.appendChild(resultItem);
        });
    }
}










function insertCellsAndImageToRows(weaponName) {
    var rowsStok = document.querySelectorAll('.tr-Srav_Stok');
    var rowsFull = document.querySelectorAll('.tr-Srav_Full');
    var imageZone = document.getElementById('NodeToClone_ImageSrav');
    var clonedImageZone = imageZone.cloneNode(true);
    var imageElement = clonedImageZone.querySelector('img');

    var weaponData = jsonData.find(function (item) {
        return item.Name === weaponName;
    });

    if (weaponData) {
        var columnsStok = ['Description', 'FireRate', 'MagazineSt', 'AmmoSt', 'Range', 'ReloadTime'];
        var columnsFull = ['ImagesROW', 'FireRate', 'MagazineFl', 'AmmoFl', 'Range', 'ReloadTime'];

        var existingWeapons = document.querySelectorAll('[BaseWeapon="' + weaponData.Name + '"]');
        if (existingWeapons.length > 0) {
            alert('Оружие уже существует!');
            return;
        }

        rowsStok.forEach(function (row, index) {
            var cellValue = weaponData[columnsStok[index]];
            var cell = document.createElement('td');
            cell.className = 'td-srav';
            cell.textContent = cellValue;
            cell.setAttribute('BaseWeapon', weaponData.Name);

            row.appendChild(cell);
        });

        rowsFull.forEach(function (row, index) {
            var cellValue = weaponData[columnsFull[index]];
            var cell = document.createElement('td');
            cell.className = 'td-srav';
            cell.textContent = cellValue;
            cell.setAttribute('BaseWeapon', weaponData.Name);

            row.appendChild(cell);
        });

        imageElement.src = "./assets/ItemIcons/" + weaponData.Image + ".png";
        imageElement.setAttribute('BaseWeapon', weaponData.Name);
        imageElement.setAttribute('STReinforced', weaponData.StockTimeReinforced);
        imageElement.setAttribute('FTReinforced', weaponData.FullTimeReinforced);

        clonedImageZone.removeAttribute('id');
        clonedImageZone.hidden = false;

        var weaponPrev = document.querySelector('.SravWeapontPrev');
        weaponPrev.appendChild(clonedImageZone);
    }

    var imageElements = document.querySelectorAll('.ISWP_ImgZone');
    imageElements.forEach(function (imageElement) {
        imageElement.onclick = removeCellsAndImageOnClick;
    });

    findMinimumReinforcedValue();
}










function removeCellsAndImageOnClick() {
    var imgZone = this;
    var imageElement = imgZone.querySelector('img');
    var baseWeapon = imageElement.getAttribute('BaseWeapon');
    var cells = document.querySelectorAll('.td-srav[BaseWeapon="' + baseWeapon + '"]');

    cells.forEach(function (cell) {
        cell.parentNode.removeChild(cell);
    });

    imgZone.parentNode.removeChild(imgZone);
    console.log('123');

    findMinimumReinforcedValue();
}

function findMinimumReinforcedValue() {
    var imageElements = document.querySelectorAll('.ISWP_ImgZone img');
    var sravPumpLevel = document.getElementById('sravPupmLevel').value;
    var minimumReinforcedValue;
    var minimumReinforcedWeapons = [];

    imageElements.forEach(function (imageElement) {
        var reinforcedValue;
        var baseName;

        if (sravPumpLevel === 'Сток') {
            reinforcedValue = imageElement.getAttribute('STReinforced');
        } else if (sravPumpLevel === 'Фулл') {
            reinforcedValue = imageElement.getAttribute('FTReinforced');
        }

        baseName = imageElement.getAttribute('baseweapon');

        if (reinforcedValue) {
            if (!minimumReinforcedValue || reinforcedValue < minimumReinforcedValue) {
                minimumReinforcedValue = reinforcedValue;
                minimumReinforcedWeapons = [baseName];
            } else if (reinforcedValue === minimumReinforcedValue) {
                minimumReinforcedWeapons.push(baseName);
            }
        }
    });

    var winWeaponElement = document.getElementById('WinWeapon');
    if (minimumReinforcedWeapons.length > 0) {
        winWeaponElement.textContent = minimumReinforcedWeapons.join(', ');
        console.error('Минимальное значение усиления: ' + minimumReinforcedValue);
    } else {
        winWeaponElement.textContent = '';
        console.error('Нет доступных значений усиления');
    }
}

