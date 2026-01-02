const barsDiv = document.getElementById("bars");
const statusText = document.getElementById("status");

let arr = [];
let n = 0;
let i = 0, j = 0;
let interval = null;
let currentAlgo = "bubble";

let steps = [];
let stepIndex = 0;

resetAlgo();

/* ---------- HELPERS ---------- */

function generateArray(size = 12) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 90) + 10
  );
}

function render(highlight = []) {
  barsDiv.innerHTML = "";
  arr.forEach((v, idx) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = v * 3 + "px";
    if (highlight.includes(idx)) bar.style.background = "#ef4444";
    barsDiv.appendChild(bar);
  });
}

/* ---------- CONTROLS ---------- */

function play() {
  if (interval) return;
  interval = setInterval(nextStep, speed());
}

function pause() {
  clearInterval(interval);
  interval = null;
}

function speed() {
  return document.getElementById("speed").value;
}

function resetAlgo() {
  pause();
  arr = generateArray(12);
  n = arr.length;
  i = j = 0;
  steps = [];
  stepIndex = 0;
  render();
  statusText.innerText = `${currentAlgo.toUpperCase()} Sort Ready`;
}

function changeAlgorithm() {
  currentAlgo = document.getElementById("algo").value;
  resetAlgo();
}

function nextStep() {
  if (currentAlgo === "bubble") bubble();
  else if (currentAlgo === "selection") selection();
  else if (currentAlgo === "insertion") insertion();
  else if (currentAlgo === "merge") merge();
  else if (currentAlgo === "quick") quick();
}

/* ---------- BUBBLE ---------- */

function bubble() {
  if (i >= n - 1) return done("Bubble Sort");
  if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
  render([j, j + 1]);
  j++;
  if (j >= n - i - 1) { j = 0; i++; }
}

/* ---------- SELECTION ---------- */

let minIndex = 0;
function selection() {
  if (i >= n - 1) return done("Selection Sort");
  if (j === 0) { minIndex = i; j = i + 1; }
  if (arr[j] < arr[minIndex]) minIndex = j;
  render([i, j, minIndex]);
  j++;
  if (j >= n) {
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    i++; j = 0;
  }
}

/* ---------- INSERTION ---------- */

let key = null;
function insertion() {
  if (i >= n) return done("Insertion Sort");
  if (key === null) { key = arr[i]; j = i - 1; }
  if (j >= 0 && arr[j] > key) {
    arr[j + 1] = arr[j];
    j--;
  } else {
    arr[j + 1] = key;
    key = null;
    i++;
  }
  render([j + 1]);
}

/* ---------- MERGE ---------- */

function merge() {
  if (!steps.length) generateMerge();
  if (stepIndex >= steps.length) return done("Merge Sort");
  arr = steps[stepIndex++];
  render();
}

function generateMerge() {
  steps = [];
  const temp = [...arr];

  function mergeSort(l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    mergeSort(l, m);
    mergeSort(m + 1, r);
    mergeArr(l, m, r);
  }

  function mergeArr(l, m, r) {
    const left = temp.slice(l, m + 1);
    const right = temp.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      temp[k++] = left[i] <= right[j] ? left[i++] : right[j++];
      steps.push([...temp]);
    }
    while (i < left.length) temp[k++] = left[i++], steps.push([...temp]);
    while (j < right.length) temp[k++] = right[j++], steps.push([...temp]);
  }

  mergeSort(0, temp.length - 1);
}

/* ---------- QUICK ---------- */

function quick() {
  if (!steps.length) generateQuick();
  if (stepIndex >= steps.length) return done("Quick Sort");
  arr = steps[stepIndex++];
  render();
}

function generateQuick() {
  steps = [];
  const temp = [...arr];

  function qs(l, r) {
    if (l >= r) return;
    const p = partition(l, r);
    qs(l, p - 1);
    qs(p + 1, r);
  }

  function partition(l, r) {
    const pivot = temp[r];
    let i = l - 1;
    for (let j = l; j < r; j++) {
      if (temp[j] < pivot) {
        i++;
        [temp[i], temp[j]] = [temp[j], temp[i]];
        steps.push([...temp]);
      }
    }
    [temp[i + 1], temp[r]] = [temp[r], temp[i + 1]];
    steps.push([...temp]);
    return i + 1;
  }

  qs(0, temp.length - 1);
}

/* ---------- DONE ---------- */

function done(name) {
  pause();
  statusText.innerText = `${name} Completed ✅`;
}
