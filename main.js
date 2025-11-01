var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = ctx.canvas.width;
var height = ctx.canvas.height;

const color_picker = document.getElementById("color")
let currentGradient = null;

var timepernote = 0;
var length = 0;

var interval = null;
var reset = false;

const input = document.getElementById('input');
const vol_slide = document.getElementById('vol-slide')

const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

notes = new Map();
notes.set("C", 261.6);
notes.set("D", 293.7);
notes.set("E", 329.6);
notes.set("F", 349.2);
notes.set("G", 392.0);
notes.set("A", 440.0);
notes.set("B", 493.9);


oscillator.start();
gainNode.gain.value = 0;

function createColorInput(value = '#ffffffff'){
    const container = document.getElementById("colors");
    const wrapper = document.createElement("div");
    wrapper.className = 'color-wrapper';

    if (wrapper){
        wrapper.classList.add('wrapper-styles');
    }

    const input = document.createElement("input");
    input.type = "color";
    input.style.backgroundColor = "#E2D2C8";
    input.style.backgroundColor = "rgba(142, 128, 141, 1)";
    input.value = value;
    input.addEventListener('input', applyGradient);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = 'X';
    remove.style.paddingBottom = "0.3em";
    remove.style.paddingTop = "0.3em";
    remove.style.margin = "0.2em";
    remove.style.color = "rgba(142, 128, 141, 1)";
    remove.style.backgroundColor = "#E2D2C8";
    remove.style.border = "rgba(142, 128, 141, 1)";
    remove.addEventListener('click', () => {
        wrapper.remove();
        applyGradient();
    });

    wrapper.appendChild(input);
    wrapper.appendChild(remove);
    container.appendChild(wrapper);

    return input;
}

function addColorPicker(){
    createColorInput('#ff0000');
    applyGradient();
}

function getColors(){
    return Array.from(document.querySelector('#colos input[type="color"]'))
        .map(i => i.value);
}


function applyGradient(){
    const nodeList = document.querySelectorAll('#colors input[type="color"]');
    const colorList = Array.from(nodeList);

    if(colorList.length === 0) {
        currentGradient = null;
        return;
    }
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    const steps = Math.max(colorList.length - 1, 1);
    colorList.forEach((color, index) => {
        gradient.addColorStop(index/steps, color.value);
    });

currentGradient = gradient;
}



function frequency(pitch){

    freq = pitch/10000;
    gainNode.gain.setValueAtTime(vol_slide.value, audioCtx.currentTime);
    setting = setInterval(() => {gainNode.value = vol_slide.value}, 1);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    setTimeout(() => {
        clearInterval(setting);
        gainNode.gain.value = 0;
    }, ((timepernote)-10));
    // gainNode.gain.setValueAtTime(0, (audioCtx.currentTime + ((timepernote/1000) - 0.1)));

}

function handle(){
    audioCtx.resume();
    reset = true;
    gainNode.gain.value = 0;
    var usernotes = String(input.value);
    length = usernotes.length;
    timepernote = (6000/length);
    var list = [];

    for (i = 0; i < usernotes.length; i++) {
        list.push(notes.get(usernotes.charAt(i)));
    }

    frequency(parseInt(list[0]));
    drawWave();

    let j = 1;
    repeat = setInterval(() => {
        if (j < list.length){
            frequency(parseInt(list[j]));
            drawWave();
            j++;
        }
        else {
            clearInterval(repeat);
        }
    }, timepernote)
}

let points = [];

function waveFill(){
    const fillRadio = document.getElementById("fill-wave");
    if (!fillRadio || !fillRadio.checked) return;
    if (points.length < 2) return;

    ctx.moveTo(points[0].x, points[0].y);
    ctx.beginPath();
    for (let i = 1; i < points.length; i++){
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.lineTo(points[points.length-1].x, height);
    ctx.lineTo(points[0].x, height);
    ctx.closePath();

    if (currentGradient){
        ctx.fillStyle = currentGradient;
    }
    else {
        ctx.fillStyle = "#d4edd9ff"
    }
    ctx.fill();

}

var counter = 0;

function drawWave(){

    clearInterval(interval);

    if (reset){
        ctx.clearRect(0, 0, width, height);
        x = 0;
        y = height/2;
        ctx.moveTo(x, y);
        ctx.beginPath();

        points = [];
        points.push({x:x, y:y});
    }
    

    counter = 0;
    interval = setInterval(line, 20);
    reset = false;

}

function line(){

    counter++;
    y = (height/2) + (((vol_slide.value/100)*40)*Math.sin(2*Math.PI*freq*x*(0.5*length)));
    points.push({x:x, y:y});
    ctx.lineTo(x, y);
    if (currentGradient === null){
        ctx.strokeStyle = color_picker.value;

    }
    else {
        ctx.strokeStyle = currentGradient;

    }

    ctx.stroke();
    x = x+1;

    if (counter > (timepernote/20)){
        clearInterval(interval);
        waveFill();
    }
}

window.addEventListener('load', () => {
    const submitBtn = document.getElementById('submit');
    if(submitBtn){
    submitBtn.style.color = "rgba(142, 128, 141, 1)";
    submitBtn.style.backgroundColor = "#E2D2C8";
    submitBtn.style.border = "rgba(142, 128, 141, 1)";
    }
    const addColorBtn = document.getElementById('add-color');
    if(addColorBtn){
        addColorBtn.style.color = "rgba(142, 128, 141, 1)";
    addColorBtn.style.backgroundColor = "#E2D2C8";
    addColorBtn.style.border = "rgba(142, 128, 141, 1)";
    }

    createColorInput('#ffffffff');
    applyGradient();
});
