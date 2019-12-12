//import * as manageFiles from '/js/manageFiles.js';

const audioContext = new AudioContext(); //crée context audio
const $btn = document.querySelector('button'); //donner elt button avec semble de functionnalité
let resumed = false;

/*console.log("Index loaded");
for (let file of manageFiles.getAllFileNames('/resources/Test1')){
    console.log(file);
};*/

const callback = async function () {
    if (!resumed) {
        await audioContext.resume();
        resumed = true;
    }
    const now = audioContext.currentTime;

    const env = audioContext.createGain();
    env.connect(audioContext.destination);
    env.gain.value = 0;

    const sine = audioContext.createOscillator();
    sine.connect(env);
    sine.frequency.value = 200 + 600 * Math.random();
    sine.start();

    //env.gain.cancelScheduledValues(now);
    env.gain.linearRampToValueAtTime(1, now + 0.005);
    env.gain.setValueAtTime(1, now + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 3);
};

$btn.addEventListener('click', callback);