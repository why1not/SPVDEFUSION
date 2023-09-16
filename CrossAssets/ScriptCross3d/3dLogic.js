import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import {
    OrbitControls
} from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js';







const canvas = document.getElementById('CANVAS_MAIN_CARD_3D');

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    pixelRatio: 0.1,
    canvas
});
const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();

/**
 (min - width: 768 px) Пк
 (max - width: 767 px) Телефоны
 */
var aspect = 0;
//if (window.innerWidth >= 768) {
const canvas2 = renderer.domElement;
const width = canvas2.clientWidth;
const height = canvas2.clientHeight;
aspect = (width) / (height);
renderer.setSize(width, height);
//} else {
//    aspect = (window.innerWidth * 0.9) / (window.innerHeight * 0.4);
//const canvasWidth = window.innerWidth * 0.9;
//const canvasHeight = window.innerHeight * 0.4;
//renderer.setSize(canvasWidth, canvasHeight);
//}


const fov = 45; // Угол обзора
const near = 0.001; // Ближняя плоскость отсечения
const far = 2000; // Дальняя плоскость отсечения
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(10, 3, 10); // отдалим камеру по оси Z




// Создаем геометрию куба
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const texture = loader.load('./assets/testTexture.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.LinearFilter;
// Создаем материал для куба (например, красный цвет)
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    map: texture
});

// Создаем меш (куб) с использованием геометрии и материала
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// Добавляем куб на сцену
//scene.add(cube);

// Устанавливаем начальное положение куба (по умолчанию он создается в центре сцены)
cube.position.set(0, 0, 0);


let d3d_obj; 

const divElement = document.getElementById("ToDoGet3dName");

// Создаем событийный слушатель для события "input"
divElement.addEventListener("change", function () {
    // Извлекаем значение атрибута "имя"
    var nameAttribute = divElement.getAttribute("todoget3dname");
    d3d_obj = './assets/3d_assets/guns/' + nameAttribute;
});

const objLoader = new GLTFLoader();
let model;
objLoader.load(d3d_obj, (gltf) => {
    model = gltf.scene;
    model.scale.set(4, 4, 4); // Увеличиваем масштаб в 4 раза по всем осям

    // Проходимся по всем частям модели
    model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            // Сохраняем существующую текстуру
            const existingTexture = child.material.map;

            // Настраиваем фильтры на текстуре
            if (existingTexture) {
                existingTexture.magFilter = THREE.NearestFilter;
                existingTexture.minFilter = THREE.NearestFilter;
            }

            // Создаем новый материал и применяем существующую текстуру и цвет
            const material = new THREE.MeshPhongMaterial({
                color: 0xFFFFFF, // Устанавливаем белый цвет
                map: existingTexture, // Применяем существующую текстуру
            });

            child.material = material;
        }
    });

    


    let modelBoundingBox = new THREE.Box3().setFromObject(model);
    modelBoundingBox.size = {};
    //modelBoundingBox.size.x = modelBoundingBox.max.x;// - modelBoundingBox.min.x;
    //modelBoundingBox.size.y = modelBoundingBox.max.y;// - modelBoundingBox.min.y;
    modelBoundingBox.size.z = modelBoundingBox.max.z + modelBoundingBox.min.z;//;

    //const centerX = modelBoundingBox.size.x / 2;
    //const centerY = modelBoundingBox.size.y / 2;
    const centerZ = modelBoundingBox.size.z / 2;

    model.position.set(0, 0, -centerZ);


    //const angleInRadians = THREE.MathUtils.degToRad(45); // Преобразование градусов в радианы
    //model.rotateY(-angleInRadians);
    // Добавляем модель на сцену
    scene.add(model);

    
});

// Создаем пустой объект для управления вращением



var axes = new THREE.AxesHelper(10);

//reset axes colors
var colors = axes.geometry.attributes.color;

colors.setXYZ(0, 1, 0, 0); // index, R, G, B
colors.setXYZ(1, 1, 0, 0); // red
colors.setXYZ(2, 0, 1, 0);
colors.setXYZ(3, 0, 1, 0); // green
colors.setXYZ(4, 0, 0, 1);
colors.setXYZ(5, 0, 0, 1); // blue

//scene.add(axes);


















const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0); // Устанавливаем точку, вокруг которой будет вращаться камера

// Устанавливаем ограничения для управления камерой
controls.minDistance = 1; // Минимальное расстояние
controls.maxDistance = 25; // Максимальное расстояние
controls.maxPolarAngle = THREE.MathUtils.degToRad(96.5); // Максимальный угол наклона в 45 градусов

// Отключаем перемещение правой кнопкой мыши
controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: null,
};
controls.enablePan = false; // Отключаем перемещение
controls.update();









const ambientLight = new THREE.AmbientLight(0xffffff, 10); // Цвет и интенсивность
//ambientLight.position.set(5, 10, 0);
//ambientLight.target.position.set(-5, 0, 0);
scene.add(ambientLight);








renderer.setClearColor(0x000000, 0);
//scene.add(aLight);
//renderer.render(scene, camera)
//const color = 0xFFFFFF;
//const dirLightIntensity = 1;
//const dirLight = new THREE.DirectionalLight(color, dirLightIntensity);
//dirLight.position.set(5, 10, 0);
//dirLight.target.position.set(-5, 0, 0);
//scene.add(dirLight);
//scene.add(dirLight.target);


function animateCube() {
    //cube.rotation.z += 0.01; // Увеличиваем угол вращения// Получите текущее положение камеры
    //const cameraPosition = camera.position;

    // Выведите координаты x, y, z
    //console.log(`X: ${cameraPosition.x}, Y: ${cameraPosition.y}, Z: ${cameraPosition.z}`);
    
}

// Создаем функцию анимации и вызываем ее в цикле
function animate() {
    animateCube(); // Вызываем функцию анимации

    // Рендерим сцену
    renderer.render(scene, camera);

    // Запрашиваем следующий кадр анимации
    requestAnimationFrame(animate);
}

// Запускаем анимацию
animate();