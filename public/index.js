//import * as manageFiles from '/js/manageFiles.js';
import * as loadFiles from "/js/loadFiles.js"
const audioContext = new AudioContext(); //crée context audio
const $btn = document.querySelector('button'); //donner elt button avec semble de functionnalité
let resumed = false;

//load json file from server
var file_tree;
fetch('/fileTree.json')
    .then(response => response.json())
    .then(jsonResponse => file_tree = jsonResponse);

var set_list = document.createElement("select");

const callback = async function () {
    if (!resumed) {
        await audioContext.resume();
        resumed = true;
    }
    Object.keys(file_tree["sample_sets"]).forEach((key) => {
        var new_option = document.createElement("option");
        new_option.text = key;
        set_list.add(new_option);
    })
    document.querySelector("body").append(set_list);
    
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