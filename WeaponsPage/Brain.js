var jsonData;
var skinsData;
var shareValue;

Toastify({
    text: "Идет загрузка данных...",
    duration: 1500,
    close: true
}).showToast();



$(document).ready(function () {
    var spreadsheetId = '1FblgSUb0Bb5BqU3xmYv_f8_ConUytYq3Uc8_V8Qcr-E';
    var apiKey = 'AIzaSyDYlCMZ-qIiTlwHLYZquW9qQAQlG3khikA';
    var sheetName = 'ТТХ';
    var column = 'D';
    //shareValue = getShareValueFromURL();
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
                'Series': row[1],
                'TypeWeapon': row[2],
                'DamageType': row[3],
                'DamageSt': row[4],
                'DamageFl': row[5],
                'MagazineSt': row[6],
                'MagazineFl': row[7],
                'AmmoSt': row[8],
                'AmmoFl': row[9],
                'FireRate': row[10],
                'Range': row[11],
                'ReloadTime': row[12],
                'Cost': row[13],
                'Image': row[14],
                'Badge': row[15],
                'StockNoArmorHead': row[16],            // Сток | Без брони | Голова
                'StockNormalArmorHead': row[17],        // Сток | Обыч | Голова
                'StockReinforcedArmorHead': row[18],    // Сток | Укреп | Голова
                'FullNoArmorHead': row[19],             // Фулл | Без брони | Голова
                'FullNormalArmorHead': row[20],         // Фулл | Обыч | Голова
                'FullReinforcedArmorHead': row[21],     // Фулл | Укреп | Голова
                'StockNoArmorBody': row[22],            // Сток | Без брони | Тело
                'StockNormalArmorBody': row[23],        // Сток | Обыч | Тело
                'StockReinforcedArmorBody': row[24],    // Сток | Укреп | Тело
                'FullNoArmorBody': row[25],             // Фулл | Без брони | Тело
                'FullNormalArmorBody': row[26],         // Фулл | Обыч | Тело
                'FullReinforcedArmorBod': row[27]       // Фулл | Укреп | Тело
            }));

            //console.table(jsonData);
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
            text: 'Использованная вами ссылка на оружие загружается..\nПодождите секунду..',
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

            typeWeaponElement.textContent = matchingItem.TypeWeapon;
            damageTypeElement.textContent = matchingItem.DamageType;
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
function filterWeaponsByType(type) {
    var filteredWeapons = jsonData.filter(function (weapon) {
        return weapon['TypeWeapon'] === type;
    });

    var resultContainer = document.getElementById("CardZoneMain");
    resultContainer.innerHTML = ""; // Очистить контейнер перед добавлением результатов

    var cloneMainCard = document.getElementById("NodeToClone_MainCard").cloneNode(true);
    cloneMainCard.id = '';

    filteredWeapons.forEach(function (weapon) {
        var card = cloneMainCard.cloneNode(true);
        card.setAttribute("onclick", 'GETNameFromCard(\''+weapon.Name+'\');');
        var mainCardImage = card.querySelector("#NTC_MC_image");
        var mainCardName = card.querySelector("#NTC_MC_name");
        
        mainCardImage.src = "./assets/ItemIcons/" + weapon.Image + ".png";
        mainCardName.textContent = weapon.Name;

        resultContainer.appendChild(card);
    });
    document.getElementById("SearchNameLabel").textContent = type;
    openStandartCard();
}
















let selectedGroup1Value = '';
let selectedGroup2Value = '';
let selectedGroup3Value = '';
let selectedGroup4Value = '';

function handleGroup1Click(value) {
      if (selectedGroup1Value === value) {
          // Если значение уже совпадает с текущим выбранным, сбрасываем его
          selectedGroup1Value = '';
      } else {
          // Иначе присваиваем новое значение
          selectedGroup1Value = value;
      }
      console.log('Selected Group 1 value:', selectedGroup1Value);
      // Здесь можно вызвать вашу функцию filterWeaponsByType() с передачей выбранного значения
      // filterWeaponsByType(selectedGroup1Value);
}

function handleGroup2Click(value) {
    selectedGroup2Value = value;
    console.log('Selected Group 2 value:', selectedGroup2Value);
}

function handleGroup3Click(value) {
    selectedGroup3Value = value;
    console.log('Selected Group 3 value:', selectedGroup3Value);
}
function handleGroup4Click(value) {
    selectedGroup4Value = value;
    console.log('Selected Group 4 value:', selectedGroup4Value);
}










function sortAndPrintStockTimeNoArmor() {
    if (
        selectedGroup2Value === '' ||
        selectedGroup4Value === '' ||
        selectedGroup3Value === ''
    ) {
        // Одна из переменных имеет пустую строку, функция не будет выполняться
        return;
    }
    document.getElementById("SearchNameLabel").textContent = selectedGroup4Value + " / " + selectedGroup2Value + " / " + selectedGroup3Value;

    

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
        const stockTimeA = getStockTime(a, selectedGroup2Value, selectedGroup3Value, selectedGroup4Value);
        const stockTimeB = getStockTime(b, selectedGroup2Value, selectedGroup3Value, selectedGroup4Value);

        // Add console.log to check the values returned by getStockTime
        //console.log(a.Name+' : '+stockTimeA);
        //console.log(b.Name + ' : ' +stockTimeB);

        // Convert stock times to numbers before comparing them
        return Number(stockTimeA) - Number(stockTimeB);
    });


    if (selectedGroup1Value === '') {
        // Если selectedGroup1Value пустая, просто выводим все оружия без сортировки по типу
        var resultContainer = document.getElementById("CardZoneMain");
        resultContainer.innerHTML = "";

        var cloneMainCard = document.getElementById("NodeToClone_MainCard").cloneNode(true);
        cloneMainCard.id = '';

        jsonData.forEach(function (weapon) {
            var card = cloneMainCard.cloneNode(true);
            card.setAttribute("onclick", 'GETNameFromCard(\'' + weapon.Name + '\');');
            var mainCardImage = card.querySelector("#NTC_MC_image");
            var mainCardName = card.querySelector("#NTC_MC_name");

            mainCardImage.src = "./assets/ItemIcons/" + weapon.Image + ".png";
            mainCardName.textContent = weapon.Name;
            console.warn(weapon.Name + " : " + weapon.FullReinforcedArmorHead);
            resultContainer.appendChild(card);
        });

        openStandartCard();
        return;
    }
    else{
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
                console.warn(weapon.Name + " : " + weapon.FullReinforcedArmorHead);
                resultContainer.appendChild(card);
            }
        });

        openStandartCard();
        return;
    }
}

















function getStockTime(weapon, group2, group3, group4) {
    if (group2 === "Без прокачки") {
        if (group3 === "Без брони") {
            return group4 === "Голова" ? weapon.StockNoArmorHead : weapon.StockNoArmorBody;
        } else if (group3 === "Обычная броня") {
            return group4 === "Голова" ? weapon.StockNormalArmorHead : weapon.StockNormalArmorBody;
        } else if (group3 === "Укреплённая броня") {
            return group4 === "Голова" ? weapon.StockReinforcedArmorHead : weapon.StockReinforcedArmorBody;
        }
    } else if (group2 === "Полная прокачка") {
        if (group3 === "Без брони") {
            return group4 === "Голова" ? weapon.FullNoArmorHead : weapon.FullNoArmorBody;
        } else if (group3 === "Обычная броня") {
            return group4 === "Голова" ? weapon.FullNormalArmorHead : weapon.FullNormalArmorBody;
        } else if (group3 === "Укреплённая броня") {
            return group4 === "Голова" ? weapon.FullReinforcedArmorHead : weapon.FullReinforcedArmorBody;
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
    document.getElementById("SearchNameLabel").textContent = edition;
    openStandartCard();
}



/*Сортировка по листу ТТХ! */
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
    document.getElementById("SearchNameLabel").textContent = edition;
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


    document.getElementById("SearchNameLabel").textContent = edition;
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
            imageElement.setAttribute("src", "./assets/ItemIcons/" + matchingRow.Image + ".png");
            imageElement.setAttribute("alt", weaponName);
        }







    }
    if (document.getElementById("WPView_damageSt") != '') {
        OpenWindowTwo();
    }

    //findWeaponSkins(weaponName);
    TimeConque();

    //var button = document.querySelector('.AddWpToSravIN');
    //var linkes = 'openSravnenie(this); insertCellsAndImageToRows(\'' + weaponName + '\');'
    //button.setAttribute('onclick', linkes);

    document.getElementById('ShareButton').setAttribute('share', weaponName);
}


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

    document.getElementById('ShareButton').setAttribute('share', weaponName);
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

    document.getElementById('ShareButton').setAttribute('share', weaponName);

}
/*
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
    var imageZone = document.getElementById('NodeToClone_ImageSrav');
    var clonedImageZone = imageZone.cloneNode(true);
    var imageElement = clonedImageZone.querySelector('img');

    var weaponData = jsonData.find(function (item) {
        return item.Name === weaponName;
    });

    if (weaponData) {

        var existingWeapons = document.querySelectorAll('[BaseWeapon="' + weaponData.Name + '"]');
        if (existingWeapons.length > 0) {
            alert('Оружие уже существует!');
            return;
        }

        AddStockSrav(weaponData);
        AddFullSrav(weaponData);
        SpeedsKillIset(weaponData);

        imageElement.src = "./assets/ItemIcons/" + weaponData.Image + ".png";
        imageElement.setAttribute('BaseWeapon', weaponData.Name);
        imageElement.setAttribute('STReinforced', weaponData.StockTimeReinforced);
        imageElement.setAttribute('FTReinforced', weaponData.FullTimeReinforced);
        imageElement.setAttribute('TimeSpeeds', [1,2,3,4,5,6,7,8,9,0,1,2,34,5,6,7,8,9,0,0,8,76,5456,46]);

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



function AddStockSrav(weaponData) {
    var rowsStok = document.querySelectorAll('.tr-Srav_Full');
    var columnsStok = ['DamageSt', 'FireRate', 'MagazineSt', 'AmmoSt', 'Range', 'ReloadTime'];

    rowsStok.forEach(function (row, index) {
        var cellValue = weaponData[columnsStok[index]];
        var cell = document.createElement('td');
        cell.className = 'td-srav';
        cell.textContent = cellValue;
        cell.setAttribute('BaseWeapon', weaponData.Name);

        row.appendChild(cell);
    });
}

function AddFullSrav(weaponData) {
    var rowsFull = document.querySelectorAll('.tr-Srav_Stok');
    var columnsFull = ['DamageFl', 'FireRate', 'MagazineFl', 'AmmoFl', 'Range', 'ReloadTime'];

    rowsFull.forEach(function (row, index) {
        var cellValue = weaponData[columnsFull[index]];
        var cell = document.createElement('td');
        cell.className = 'td-srav';
        cell.textContent = cellValue;
        cell.setAttribute('BaseWeapon', weaponData.Name);

        row.appendChild(cell);
    });
}

function SpeedsKillIset(weaponData) {
    var rowsStokTime = document.querySelectorAll('.tr-Srav_TimeSt');
    var rowsFullTime = document.querySelectorAll('.tr-Srav_TimeFull');
    var columnsTime = ['Head', 'Body', 'Shoulder', 'Forearm', 'Wrist', 'Thigh', 'Shin', 'Foot'];
    
    //  imageElement.setAttribute('TimeSpeeds', [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 34, 5, 6, 7, 8, 9, 0, 0, 8, 76, 5456, 46]);
    //  imageElements = document.querySelectorAll('.ISWP_ImgZone img');
    //  Math.ceil(60 / weapon.Speed * 1000 * (Math.ceil(100 / (weapon.damage * 2)) - 1));
    //     ОКРУГЛ(60 / weapon.Speed * 1000 * ( ОКРВВЕРХ(100 / (weapon.damage * 2)) - 1))

    rowsStokTime.forEach(function (row, index) {

        var cellValue;// = '1';//weaponData[columnsTime[index]];

        switch (columnsTime[index]) {
            case 'Head':
                cellValue = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageSt * 1.5)) - 1));
                break;
            case 'Body':
                cellValue = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageSt * 1)) - 1));
                break;
            case 'Shoulder':
                cellValue = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageSt * 0.95)) - 1));
                break;
            case 'Forearm':
                cellValue = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageSt * 0.9)) - 1));
                break;
            case 'Wrist':
                cellValue = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageSt * 0.85)) - 1));
                break;
            case 'Thigh':
                cellValue = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageSt * 0.6)) - 1));
                break;
            case 'Shin':
                cellValue = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageSt * 0.5)) - 1));
                break;
            case 'Foot':
                cellValue = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageSt * 0.4)) - 1));
                break;
            default:
                console.log('Invalid body part');
        }




        var cell = document.createElement('td');
        cell.className = 'td-srav';
        cell.textContent = cellValue;
        cell.setAttribute('BaseWeapon', weaponData.Name);

        row.appendChild(cell);

    });

    rowsFullTime.forEach(function (row, index) {

        var cellValue; // = '1';//weaponData[columnsTime[index]];

        switch (columnsTime[index]) {
            case 'Head':
                cellValue = Math.round(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageFl * 1.5)) - 1));
                break;
            case 'Body':
                cellValue = Math.round(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageFl * 1)) - 1));
                break;
            case 'Shoulder':
                cellValue = Math.round(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageFl * 0.95)) - 1));
                break;
            case 'Forearm':
                cellValue = Math.round(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageFl * 0.9)) - 1));
                break;
            case 'Wrist':
                cellValue = Math.round(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageFl * 0.85)) - 1));
                break;
            case 'Thigh':
                cellValue = Math.round(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageFl * 0.6)) - 1));
                break;
            case 'Shin':
                cellValue = Math.round(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageFl * 0.5)) - 1));
                break;
            case 'Foot':
                cellValue = Math.round(60 / weaponData.FireRate * 1000 * (Math.ceil(150 / (weaponData.DamageFl * 0.4)) - 1));
                break;
            default:
                console.log('Invalid body part');
        }




        var cell = document.createElement('td');
        cell.className = 'td-srav';
        cell.textContent = cellValue;
        cell.setAttribute('BaseWeapon', weaponData.Name);

        row.appendChild(cell);

    });
}
/*
Head = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(100 / (weaponData.DamageFl * 2)) - 1));
Body = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(100 / (weaponData.DamageFl * 1)) - 1));
Shoulder = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(100 / (weaponData.DamageFl * 0.95)) - 1));
Forearm = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(100 / (weaponData.DamageFl * 0.9)) - 1));
Wrist = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(100 / (weaponData.DamageFl * 0.85)) - 1));
Thigh = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(100 / (weaponData.DamageFl * 0.6)) - 1));
Shin = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(100 / (weaponData.DamageFl * 0.5)) - 1));
Foot = Math.ceil(60 / weaponData.FireRate * 1000 * (Math.ceil(100 / (weaponData.DamageFl * 0.4)) - 1));
*/


























































































































































































































































































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



























































function removeCellsAndImageOnClick() {
    var imgZone = this;
    var imageElement = imgZone.querySelector('img');
    var baseWeapon = imageElement.getAttribute('BaseWeapon');
    var cells = document.querySelectorAll('.td-srav[BaseWeapon="' + baseWeapon + '"]');

    cells.forEach(function (cell) {
        cell.parentNode.removeChild(cell);
    });

    imgZone.parentNode.removeChild(imgZone);

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

