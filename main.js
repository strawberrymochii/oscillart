var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = ctx.canvas.width;
var height = ctx.canvas.height;
var amplitude = 40;
const gradient = ctx.createLinearGradient(0, 0, width, 0)

const color_picker = document.getElementById("color")
let currentGradient = null;

var timepernote = 0;
var length = 0;

var interval = null;
var reset = false;

const input = document.getElementById('input');

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

function createColorInput(value = #ffffffff){
    const container = document.getElementById("colors");
    const wrapper = document.createElement("div");
    wrapper.className = 'color-wrapper';

    const input = document.createElement("input");
    input.type = "color";
    input.value = value;
    input.addEventListener('input', applyGradient);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = 'X';
    remove.addEventListener('click', () => wrapper.remove());

    wrapper.appendChild('input');
    wrapper.appendChild('remove');
    container.appendChild('wrapper');

    return input;


}

function addColorPicker(){
    createColorInput(#ffffffff);
    applyGradient();
}

function applyGradient(){

}

function frequency(pitch){

    freq = pitch/10000;
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, (audioCtx.currentTime + ((timepernote/1000) - 0.1)));

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

var counter = 0;

function drawWave(){

    clearInterval(interval);

    if (reset){
        ctx.clearRect(0, 0, width, height);
        x = 0;
        y = height/2;
        ctx.moveTo(x, y);
        ctx.beginPath();
    }
    

    counter = 0;
    interval = setInterval(line, 20);
    reset = false;

}

function line(){

    counter++;
    y = (height/2) + (amplitude*Math.sin(2*Math.PI*freq*x*(0.5*length)));
    ctx.lineTo(x, y);
    ctx.strokeStyle = color_picker.value;
    ctx.stroke();
    x = x+1;

    if (counter > (timepernote/20)){
        clearInterval(interval);
    }
}

