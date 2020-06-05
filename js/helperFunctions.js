// interval functions

function interval(a, b) {
    let l = [];
    let x = a;
    while (x <= b) {
        l.push(x);
        x++;
    }
    return l;
}

export function left(x, y) {
    return interval(1, x).map((i) => [x - i, y]);
}

export function below(x, y) {
    return interval(1, y).map((j) => [x, y - j]);
}

export function above(x, y, size) {
    return interval(y + 1, size - 1).map((j) => [x, j]);
}

export function right(x, y, size) {
    return interval(x + 1, size - 1).map((i) => [i, y]);
}

export function belowright(x, y, size) {
    return interval(1, size - 1)
        .map((k) => [x + k, y + k])
        .filter(([i, j]) => i < size && j < size);
}

export function belowleft(x, y, size) {
    return interval(1, size - 1)
        .map((k) => [x - k, y + k])
        .filter(([i, j]) => i >= 0 && j < size);
}

export function aboveright(x, y, size) {
    return interval(1, size - 1)
        .map((k) => [x + k, y - k])
        .filter(([i, j]) => i < size && j >= 0);
}

export function aboveleft(x, y, size) {
    return interval(1, size - 1)
        .map((k) => [x - k, y - k])
        .filter(([i, j]) => i >= 0 && j >= 0);
}

// checks if coordinate is contained in array of coordinates

export function hasElement(arr, el) {
    return arr.some((x) => x[0] === el[0] && x[1] === el[1]);
}

// DOM functions

export function getEl(str) {
    return document.getElementById(str);
}

export function getClEl(str) {
    return document.querySelector(`.${str}`);
}

export function getClEls(str) {
    return document.querySelectorAll(`.${str}`);
}

export function createEl(type, className, parentNode, innerText) {
    const element = document.createElement(type);
    element.className = className;
    parentNode.appendChild(element);
    if (innerText) element.innerText = innerText;
    return element;
}

// equality of coordinate-valued maps

function inclusionMaps(map1, map2) {
    for (const [key, value] of map1) {
        if (!map2.has(key) || map2.get(key).toString() !== value.toString()) {
            return false;
        }
    }
    return true;
}

export function equalMaps(map1, map2) {
    return inclusionMaps(map1, map2) && inclusionMaps(map2, map1);
}

// check for mobile View

export function mobileView() {
    const wrapper = getEl("wrapper");
    return wrapper.clientWidth < 1200;
}

// change background image

let bgIndex = 1;
getEl("header").addEventListener("click", () => {
    bgIndex++;
    if (bgIndex > 4) bgIndex = 1;
    document.body.style.backgroundImage = `url(../img/bg${bgIndex}.jpg)`;
});
