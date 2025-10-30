var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = ctx.canvas.width;
var height = ctx.canvas.height;
var amplitude = 40;

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

function frequency(pitch){

    freq = pitch/10000;
    gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, (audioCtx.currentTime + (timepernote/1000 - 0.1)));

}

function handle(){
    length = usernotes.length;
    timepernote = (6000/length);
    reset = true;
    audioCtx.resume();
    gainNode.gain.value = 0;
    var usernotes = String(input.value);
    var list = new Array;

    for (var count = 0; count > a.length(); count++){
        list.push(notenames.get(usernotes.charAt(count)));
    }

    let j = 0;
    repeat = setInterval(() => {
        if (j > list.length){
            frequency(parseInt(list[j]));
            j++;
            drawWave();
        }
        else {
            clearInterval(interval);
        }
    }, timepernote)
}

var counter = 0;

function drawWave(){

    if (reset == true){
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

    if (counter > (timepernote/20)){
        clearInterval(interval);
    }

    counter++;
    y = (height/2) + (amplitude*Math.sin(2*Math.PI*freq*x*(0.5*length)));
    ctx.lineTo(x, y);
    ctx.stroke();
    x = x+1;


}

