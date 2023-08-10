var jsonData;
var skinsData;
var shareValue;
Toastify({
    text: "Идет загрузка данных...",
    duration: 1500,
    close: true
}).showToast();

$(document).ready(function () {
    var spreadsheetId = '1NYl838ERKhx42vrycL6bKxxWEpWwCbFW1OFQ0ePGrw0';
    var apiKey = 'AIzaSyAUIMhDDRWdIkqP1DhPVXlp0QN6AawIQ04';
    var sheetName = 'DataList';
    var column = 'D';

    // Получение "глубины" столбца D
    var depthUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${column}:${column}?key=${apiKey}`;
    $.get(depthUrl, function (response) {
        var depth = response.values.length;

        // Формирование диапазона
        var range = `${sheetName}!A2:H${depth + 1}`;
        var dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

        // Получение данных
        $.get(dataUrl, function (response) {
            var values = response.values;

            // Преобразование данных в формат JSON
            jsonData = values.map(row => ({
                'Name': row[0],
                'Series': row[1],
                'Price': row[2],
                'TypeClaim': row[3],
                'ResistBust': row[4],
                'OtherBust': row[5],
                'Image': row[6],
                'Badge': row[7]
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
            text: 'Использованная вами ссылка на скин загружается..\nПодождите секунду..',
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







/*

function readWeaponSkins() {
    var spreadsheetId = '1FblgSUb0Bb5BqU3xmYv_f8_ConUytYq3Uc8_V8Qcr-E';
    var apiKey = 'AIzaSyDYlCMZ-qIiTlwHLYZquW9qQAQlG3khikA';
    var sheetName = 'Скины Оружий';
    var column = 'D';

    // Получение "глубины" столбца D
    //var depthUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${column}:${column}?key=${apiKey}`;
    $.get(depthUrl, function (response) {
        var depth = response.values.length;

        // Формирование диапазона
        var range = `${sheetName}!A2:D${depth + 1}`;
        //var dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

        // Получение данных
        $.get(dataUrl, function (response) {
            var values = response.values;

            // Преобразование данных в формат JSON
            skinsData = values.map(row => ({
                'BaseWeaponName': row[0],
                'SkinName': row[1],
                'Edition': row[2],
                'Image': row[3]
            }));

            //console.log("Глубина столбца D: " + depth);
            //console.table(skinsData);
        });
    });

    
}




*/






























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

            typeWeaponElement.textContent = matchingItem.TypeClaim;
            damageTypeElement.textContent = matchingItem.Price;
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









// Функция для фильтрации оружия по типу и создания карточек
function filterWeaponsByResistBust(SearchName) {
    var filteredWeapons;
    if (SearchName === 'Защита') {
        filteredWeapons = jsonData.filter(function (skin) {
            return skin['ResistBust'] != 'Отсутствуют' && skin['ResistBust'] != 'Бонус: +10 блоков' && skin['ResistBust'] != 'Бонус: +5 блоков';
        });
    } else if (SearchName === 'ДопУрон') {
        filteredWeapons = jsonData.filter(function (skin) {
            return skin['OtherBust'] != 'Отсутствуют' && skin['OtherBust'] != 'Дополнительные 5 блоков';
        });
    } else if (SearchName === 'Блоки') {
        filteredWeapons = jsonData.filter(function (skin) {
            return skin['ResistBust'] === 'Бонус: +10 блоков' || skin['ResistBust'] === 'Бонус: +5 блоков' || skin['OtherBust'] === 'Дополнительные 5 блоков';
        });
    } else if (SearchName === 'Комбо') {
        var filteredWeapons_OneRound;
        filteredWeapons_OneRound = jsonData.filter(function (skin) {
            return skin['ResistBust'] != 'Отсутствуют' && skin['OtherBust'] != 'Отсутствуют';
        });
        filteredWeapons = filteredWeapons_OneRound.filter(function (skin) {
            return skin['ResistBust'] != 'Бонус: +10 блоков' && skin['ResistBust'] != 'Бонус: +5 блоков' && skin['OtherBust'] != 'Дополнительные 5 блоков';
        });

    } else if (SearchName === 'Выкл') {
        filteredWeapons = jsonData.filter(function (skin) {
            return (
                (skin['ResistBust'] === 'Отсутствуют' || skin['ResistBust'] === 'Бонус: +10 блоков' || skin['ResistBust'] === 'Бонус: +5 блоков') &&
                (skin['OtherBust'] === 'Отсутствуют' || skin['OtherBust'] === 'Дополнительные 5 блоков')
            );
        });
    }

    console.table(filteredWeapons);
    var resultContainer = document.getElementById("CardZoneMain");
    resultContainer.innerHTML = "";

    var cloneMainCard = document.getElementById("NodeToClone_MainCard").cloneNode(true);
    cloneMainCard.id = '';

    filteredWeapons.forEach(function (skin) {
        var card = cloneMainCard.cloneNode(true);
        card.setAttribute("onclick", 'GETNameFromCard(\'' + skin.Name + '\');');
        var mainCardImage = card.querySelector("#NTC_MC_image");
        var mainCardName = card.querySelector("#NTC_MC_name");

        mainCardImage.src = "./assets/PlayerSkins/" + skin.Image + ".png";
        mainCardName.textContent = skin.Name;

        resultContainer.appendChild(card);
    });

    openStandartCard();
}
















/*

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
        const typeA = a.TypeWeapon;
        const typeB = b.TypeWeapon;

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
        if (weapon.TypeWeapon === selectedGroup1Value) {
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


*/  



















/*Сортировка по листу скинов! */
function filterWeaponsByEdition(edition) {
    var filteredWeapons = jsonData.filter(function (weapon) {
        return weapon['Series'] === edition;
    });

    var resultContainer = document.getElementById("CardZoneMain");
    resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов

    var cloneMainCard = document.getElementById("NodeToClone_MainCard").cloneNode(true);
    cloneMainCard.id = '';

    filteredWeapons.forEach(function (skin) {
        var card = cloneMainCard.cloneNode(true);
        card.setAttribute("onclick", 'GETNameFromCard(\'' + skin.Name + '\');');
        var mainCardImage = card.querySelector("#NTC_MC_image");
        var mainCardName = card.querySelector("#NTC_MC_name");

        mainCardImage.src = "./assets/PlayerSkins/" + skin.Image + ".png";
        mainCardName.textContent = skin.Name;

        resultContainer.appendChild(card);
    });

    openStandartCard();
}


/*
//Сортировка по листу ТТХ! 
function filterWeaponsByEdition2(edition) {
    var filteredWeapons = jsonData.filter(function (weapon) {
        return weapon['Series'] === edition;
    });

    filteredWeapons.sort(function (a, b) {
        var seriesA = a['Series'];
        var seriesB = b['Series'];

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
        return weapon['Series'] === edition;
    });

    filteredWeapons.sort(function (a, b) {
        var seriesA = a['Series'];
        var seriesB = b['Series'];

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

*/









/*
'Name': row[0],
    'Series': row[1],
    'Price': row[2],
    'TypeClaim': row[3],
    'ResistBust': row[4],
    'OtherBust': row[5],
    'Image': row[6],
    'Badge': row[7]

*/

function GETNameFromCard(card) {
    var weaponName = card; // Получаем значение Name из JSON переменной

    // Ищем строку в JSON-массиве, где поле "Name" соответствует значению "Card"
    var matchingRow = jsonData.find(function (row) {
        return row.Name === weaponName;
    });
    console.log(matchingRow);
    if (matchingRow) {
        // Получаем элементы по уникальным идентификаторам и устанавливаем значения
        var seriesElement = document.getElementById("WPView_Name");
        if (seriesElement) {
            seriesElement.textContent = matchingRow.Name;
        }

        var typeWeaponElement = document.getElementById("WPView_series");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Series;
        }

        var typeWeaponElement = document.getElementById("WPView_typeclaim");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.TypeClaim;
        }

        var typeWeaponElement = document.getElementById("WPView_price");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Price;
        }
       






        var typeWeaponElement = document.getElementById("WPView_resisi");
        if (typeWeaponElement) {
            if (matchingRow.ResistBust === "Бонус: +10 блоков" || matchingRow.ResistBust === "Бонус: +5 блоков") {
                var labelResistBustElement = document.getElementById("labelResitBust");
                if (labelResistBustElement) {
                    labelResistBustElement.textContent = "Дополнительные свойства";
                }
            }
            typeWeaponElement.textContent = matchingRow.ResistBust;
        }


        var typeWeaponElement = document.getElementById("WPView_otherbust");
        if (typeWeaponElement) {
            if (matchingRow.ResistBust === "Дополнительные 5 блоков") {
                var labelResistBustElement = document.getElementById("labelWpBust");
                if (labelResistBustElement) {
                    labelResistBustElement.textContent = "Дополнительные свойства";
                }
            }
            typeWeaponElement.textContent = matchingRow.OtherBust;
        }
        /*
        var typeWeaponElement = document.getElementById("WPView_boxFl");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.AmmoFl;
            document.getElementById('WPView_boxFl2').textContent = matchingRow.AmmoFl;
        }

        var typeWeaponElement = document.getElementById("WPView_range");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Range;
            document.getElementById('WPView_range2').textContent = matchingRow.Range;
        }

        var typeWeaponElement = document.getElementById("WPView_reload");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.ReloadTime;
        }

        var typeWeaponElement = document.getElementById("WPView_price");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Cost;
        }

        var typeWeaponElement = document.getElementById("WPView_type");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.TypeWeapon;
        }

        var typeWeaponElement = document.getElementById("WPView_damageType");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.DamageType;
        }

        var typeWeaponElement = document.getElementById("WPView_series");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Series;
        }
        */




        var imageElement = document.getElementById("WPView_Image");
        if (imageElement) {
            // "./assets/ItemIcons/" + matchingRow.Image + ".png"
            imageElement.setAttribute("src", "./assets/PlayerSkins/" + matchingRow.Image + ".png");
            imageElement.setAttribute("alt", weaponName);
        }







    }
    if (document.getElementById("WPView_damageSt") != '') {
        OpenWindowTwo();
    }
    
    //onclick = function () {
    //    openSravnenie(this);
    //    insertCellsAndImageToRows(weaponName);
    //};

    document.getElementById('ShareButton').setAttribute('share', weaponName);
}



/*
function GETNameFromCardIvents(card) {
    var weaponName = card.getAttribute('BaseName');
    
; // Получаем значение Name из JSON переменной

    // Ищем строку в JSON-массиве, где поле "Name" соответствует значению "Card"
    var matchingRow = jsonData.find(function (row) {
        return row.Name === weaponName;
    });
    console.log(matchingRow);
    if (matchingRow) {
        // Получаем элементы по уникальным идентификаторам и устанавливаем значения
        var seriesElement = document.getElementById("WPView_damageSt");
        if (seriesElement) {
            seriesElement.textContent = matchingRow.DamageSt;
            document.getElementById('WPView_damageSt2').textContent = matchingRow.DamageSt;
        }

        var typeWeaponElement = document.getElementById("WPView_damageFl");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.DamageFl;
            document.getElementById('WPView_damageFl2').textContent = matchingRow.DamageFl;
        }

        var typeWeaponElement = document.getElementById("WPView_temp");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.FireRate;
            document.getElementById('WPView_temp2').textContent = matchingRow.FireRate;
        }

        var typeWeaponElement = document.getElementById("WPView_clipSt");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.MagazineSt;
            document.getElementById('WPView_clipSt2').textContent = matchingRow.MagazineSt;
        }

        var typeWeaponElement = document.getElementById("WPView_clipFl");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.MagazineFl;
            document.getElementById('WPView_clipFl2').textContent = matchingRow.MagazineFl;
        }

        var typeWeaponElement = document.getElementById("WPView_boxSt");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.AmmoSt;
            document.getElementById('WPView_boxSt2').textContent = matchingRow.AmmoSt;
        }

        var typeWeaponElement = document.getElementById("WPView_boxFl");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.AmmoFl;
            document.getElementById('WPView_boxFl2').textContent = matchingRow.AmmoFl;
        }

        var typeWeaponElement = document.getElementById("WPView_range");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Range;
            document.getElementById('WPView_range2').textContent = matchingRow.Range;
        }

        var typeWeaponElement = document.getElementById("WPView_reload");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.ReloadTime;
        }

        var typeWeaponElement = document.getElementById("WPView_price");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Cost;
        }

        var typeWeaponElement = document.getElementById("WPView_type");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.TypeWeapon;
        }

        var typeWeaponElement = document.getElementById("WPView_damageType");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.DamageType;
        }

        var typeWeaponElement = document.getElementById("WPView_series");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Series;
        }





        var imageElement = document.getElementById("WPView_Image");
        if (imageElement) {
            // "./assets/ItemIcons/" + matchingRow.Image + ".png"
            imageElement.setAttribute("src", "./assets/SkinsIcons/" + card.getAttribute('ImageName') + ".png");
            imageElement.setAttribute("alt", '');
        }







    }
    if (document.getElementById("WPView_damageSt") != '') {
        OpenWindowTwo();
    }


    
    findWeaponSkins(weaponName);
    TimeConque();

    var button = document.querySelector('.AddWpToSravIN');
    var linkes = 'openSravnenie(this); insertCellsAndImageToRows(\'' + weaponName + '\');'
    button.setAttribute('onclick', linkes);
}


function GETNameFromCardIvents1(card) {
    var weaponName = card.getAttribute('BaseName');

    ; // Получаем значение Name из JSON переменной

    // Ищем строку в JSON-массиве, где поле "Name" соответствует значению "Card"
    var matchingRow = jsonData.find(function (row) {
        return row.Name === weaponName;
    });
    console.log(matchingRow);
    if (matchingRow) {
        // Получаем элементы по уникальным идентификаторам и устанавливаем значения
        var seriesElement = document.getElementById("WPView_damageSt");
        if (seriesElement) {
            seriesElement.textContent = matchingRow.DamageSt;
            document.getElementById('WPView_damageSt2').textContent = matchingRow.DamageSt;
        }

        var typeWeaponElement = document.getElementById("WPView_damageFl");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.DamageFl;
            document.getElementById('WPView_damageFl2').textContent = matchingRow.DamageFl;
        }

        var typeWeaponElement = document.getElementById("WPView_temp");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.FireRate;
            document.getElementById('WPView_temp2').textContent = matchingRow.FireRate;
        }

        var typeWeaponElement = document.getElementById("WPView_clipSt");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.MagazineSt;
            document.getElementById('WPView_clipSt2').textContent = matchingRow.MagazineSt;
        }

        var typeWeaponElement = document.getElementById("WPView_clipFl");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.MagazineFl;
            document.getElementById('WPView_clipFl2').textContent = matchingRow.MagazineFl;
        }

        var typeWeaponElement = document.getElementById("WPView_boxSt");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.AmmoSt;
            document.getElementById('WPView_boxSt2').textContent = matchingRow.AmmoSt;
        }

        var typeWeaponElement = document.getElementById("WPView_boxFl");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.AmmoFl;
            document.getElementById('WPView_boxFl2').textContent = matchingRow.AmmoFl;
        }

        var typeWeaponElement = document.getElementById("WPView_range");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Range;
            document.getElementById('WPView_range2').textContent = matchingRow.Range;
        }

        var typeWeaponElement = document.getElementById("WPView_reload");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.ReloadTime;
        }

        var typeWeaponElement = document.getElementById("WPView_price");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Cost;
        }

        var typeWeaponElement = document.getElementById("WPView_type");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.TypeWeapon;
        }

        var typeWeaponElement = document.getElementById("WPView_damageType");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.DamageType;
        }

        var typeWeaponElement = document.getElementById("WPView_series");
        if (typeWeaponElement) {
            typeWeaponElement.textContent = matchingRow.Series;
        }





        var imageElement = document.getElementById("WPView_Image");
        if (imageElement) {
            // "./assets/ItemIcons/" + matchingRow.Image + ".png"
            imageElement.setAttribute("src", "./assets/ItemIcons/" + card.getAttribute('ImageName') + ".png");
            imageElement.setAttribute("alt", '');
        }







    }
    if (document.getElementById("WPView_damageSt") != '') {
        OpenWindowTwo();
    }

    findWeaponSkins(weaponName);
    TimeConque();


    var button = document.querySelector('.AddWpToSravIN');
    var linkes = 'openSravnenie(this); insertCellsAndImageToRows(\'' + weaponName + '\');'
    button.setAttribute('onclick', linkes);

}

function findWeaponSkins(weaponName) {
    var matchingSkins = skinsData.filter(function (row) {
        return row.BaseWeaponName === weaponName;
    });

    var innerZone = document.getElementById('containerSkinwWpis');
    innerZone.innerHTML = "";
    if (matchingSkins.length > 0) {
        matchingSkins.forEach(function (skin) {
            var clone = document.getElementById("NodeToClone_SkinButtonAndPrev").cloneNode(true);
            var imgElement = clone.querySelector("img");
            imgElement.setAttribute("src", "./assets/SkinsIcons/" + skin.Image + ".png");

            // Вставляем клонированный блок в начало элемента innerZone
            innerZone.insertBefore(clone, innerZone.firstChild);
        });
    } else {
        document.getElementById('buttonSkinsWpis').hidden = true;
        console.log('123131231');
    }
}
*/
















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


function TimeConque() {
    //var weaponStats = getWeaponStats();
    //console.log('percentProtection: ' + weaponStats.percentProtection);
    //console.log('percentDopDamage: ' + weaponStats.percentDopDamage);
    //console.log('pumpLevel: ' + weaponStats.pumpLevel);
    //console.log('pumpLevelHelmet: ' + weaponStats.pumpLevelHelmet);
    //console.log('pumpLevelArmor: ' + weaponStats.pumpLevelArmor);

    //var cS = calculateStats(weaponStats.pumpLevel, weaponStats.pumpLevelArmor, temp, weaponStats.percentDopDamage, weaponStats.percentProtection);
    //console.log(":");
    //console.log("cSdamageCoefficient:" + cS.damageCoefficient);
    //console.log("totalDamage:" + cS.totalDamage);
    //console.log("shotsToKill:" + cS.shotsToKill);
    //console.log("timeToKill:" + cS.timeToKill);
    //console.log("Голова" + calculateStats(1.0, true).timeToKill);
    //console.log("Тело" + calculateStats(1.0).timeToKill);
    //console.log("Плечо" + calculateStats(0.95).timeToKill);
    //console.log("Предплечье" + calculateStats(0.9).timeToKill);
    //console.log("Кисть" + calculateStats(0.85).timeToKill);
    //console.log("Бедро" + calculateStats(0.6).timeToKill);
    //console.log("Голень" + calculateStats(0.5).timeToKill);
    //console.log("Ступня" + calculateStats(0.4).timeToKill);


    CShead = calculateStats(1.0, true);
    CSBody = calculateStats(1.0);
    CShand1 = calculateStats(0.95);
    CShand2 = calculateStats(0.9);
    CShand3 = calculateStats(0.85);
    CSLeg1 = calculateStats(0.6);
    CSLeg2 = calculateStats(0.5);
    CSLeg3 = calculateStats(0.4);

    document.getElementById('CollBullets1').textContent = CShead.shotsToKill;
    document.getElementById('CollBullets2').textContent = CSBody.shotsToKill;
    document.getElementById('CollBullets3').textContent = CShand1.shotsToKill;
    document.getElementById('CollBullets4').textContent = CShand2.shotsToKill;
    document.getElementById('CollBullets5').textContent = CShand3.shotsToKill;
    document.getElementById('CollBullets6').textContent = CSLeg1.shotsToKill;
    document.getElementById('CollBullets7').textContent = CSLeg2.shotsToKill;
    document.getElementById('CollBullets8').textContent = CSLeg3.shotsToKill;

    document.getElementById('CollTime1').textContent = CShead.timeToKill;
    document.getElementById('CollTime2').textContent = CSBody.timeToKill;
    document.getElementById('CollTime3').textContent = CShand1.timeToKill;
    document.getElementById('CollTime4').textContent = CShand2.timeToKill;
    document.getElementById('CollTime5').textContent = CShand3.timeToKill;
    document.getElementById('CollTime6').textContent = CSLeg1.timeToKill;
    document.getElementById('CollTime7').textContent = CSLeg2.timeToKill;
    document.getElementById('CollTime8').textContent = CSLeg3.timeToKill;

    console.error(CShead.totalDamage + " : " + CShead.shotsToKill + " : " + CShead.timeToKill)


}


function calculateStats(GEDON, head) {
    //var GEDON = 1.0;
    var weaponStats = getWeaponStats();
    if (head === true) {
        GEDON = weaponStats.pumpLevelHelmet;
    }
    var fireRate = document.getElementById('WPView_temp').textContent;
    damage = weaponStats.pumpLevel;
    health = weaponStats.pumpLevelArmor;
    percentDopDamage = weaponStats.percentDopDamage;
    percentResistance = weaponStats.percentProtection;

    console.warn(GEDON);






    // Расчет коэффициента урона
    var damageCoefficient = 1 + (percentDopDamage / 100) + (-percentResistance / 100);

    // Расчет общего урона
    var totalDamage = Math.ceil(damage * GEDON * damageCoefficient);

    // Расчет количества выстрелов
    var shotsToKill = Math.ceil(health / totalDamage);

    // Расчет времени убийства
    var timeToKill = Math.round((60 / fireRate * 1000) * (shotsToKill - 1));

    return {
        damageCoefficient: damageCoefficient,
        totalDamage: totalDamage,
        shotsToKill: shotsToKill,
        timeToKill: timeToKill
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
        var columnsStok = ['DamageSt', 'FireRate', 'MagazineSt', 'AmmoSt', 'Range', 'ReloadTime'];
        var columnsFull = ['DamageFl', 'FireRate', 'MagazineFl', 'AmmoFl', 'Range', 'ReloadTime'];

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

