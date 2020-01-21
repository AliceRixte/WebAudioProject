import * as manageFiles from '/js/manageFiles.js';



const audioContext = new AudioContext(); //crée context audio
let resumed = false;

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



const main = async () => {

    const $btn = document.querySelector('button'); //donner elt button avec semble de functionnalité
    $btn.addEventListener("click", callback);

    var $choose_sample_set = document.createElement("SELECT");

    const file_tree = await manageFiles.getJSON("/fileTree.json");
    var $choose_sample_set = document.createElement("select");
    Object.keys(file_tree["sample_sets"]).forEach(key => {
        var $option = document.createElement("option");
        $option.text = key;
        $choose_sample_set.add($option);
    });
    document.querySelector("body").appendChild($choose_sample_set);
}
window.addEventListener('load', main);
