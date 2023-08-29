let values = [];
let states = [];
let num = 800;
let ls = 10;
let checks = 0;
let access = 0;
let iterations = 0;

function setup() {
    var canvas = createCanvas(windowWidth, 400);
    canvas.parent("canvas-container");
    for (let i = 0; i < num; i++) {
        values.push(random());
        states.push(-1);
    }
    mergeSort(values, 0, values.length - 1);
}

async function mergeSort(arr, start, end) {
    if (start >= end) {
        checks++;
        return;
    }
    let mid = floor((start + end) / 2);
    await Promise.all([
        mergeSort(arr, start, mid),
        mergeSort(arr, mid + 1, end)
    ]);
    await merge(arr, start, mid, end);
}

async function merge(arr, start, mid, end) {
    let tempArr = [];
    let i = start;
    let j = mid + 1;

    for (let k = start; k <= end; k++) {
        iterations++;
        checks++;
        tempArr[k] = arr[k];
        access += 2;
        states[k] = 1;
    }

    for (let k = start; k <= end; k++) {
        checks++;
        iterations++;
        if (i > mid) {
            checks++;
            arr[k] = tempArr[j];
            access += 2;
            j++;
        } else if (j > end) {
            checks++;
            arr[k] = tempArr[i];
            access += 2;
            i++;
        } else if (tempArr[j] < tempArr[i]) {
            checks++;
            arr[k] = tempArr[j];
            access += 4;
            j++;
        } else {
            arr[k] = tempArr[i];
            access += 4;
            i++;
        }
        states[k] = -1;
        await sleep(ls);
    }

}

async function swap(arr, a, b) {
    await sleep(ls);
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
    access += 4;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function draw() {
    background(255);
    noStroke();
    for (let i = 0; i < values.length; i++) {
        if (states[i] == 1) {
            fill(255, 0, 0);
        } else if (states[i] == -1) {
            fill(0);
        } else {
            fill(0, 0, 255);
        }
        rect(i * width / num, height, (width / num), -values[i] * height);
    }
    update();
}

let inputs = document.getElementById("inputs");
inputs.addEventListener("input", function (event) {
    if (inputs.value != 0 && inputs.value != "") {
        ls = inputs.value;
    }
})
inputs.value = ls;

function speed(x) {
    ls = ls + x;
    inputs.value = ls;
}
var checksEl = document.getElementById("checks");
var accessEl = document.getElementById("access");
var iterationsEl = document.getElementById("iterations");

function update() {
    checksEl.innerHTML = "checks = " + checks;
    accessEl.innerHTML = "access = " + access;
    iterationsEl.innerHTML = "iterations = " + iterations;
}