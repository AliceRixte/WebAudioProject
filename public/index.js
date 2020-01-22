import * as loadFiles from '/js/loadFiles.js';



const audio_context = new AudioContext(); //cr�e context audio
let resumed = false;

const callback = async function () {
    if (!resumed) {
        await audio_context.resume();
        resumed = true;
    }
    const now = audio_context.currentTime;

    const env = audio_context.createGain();
    env.connect(audio_context.destination);
    env.gain.value = 0;

    const sine = audio_context.createOscillator();
    sine.connect(env);
    sine.frequency.value = 200 + 600 * Math.random();
    sine.start();

    //env.gain.cancelScheduledValues(now);
    env.gain.linearRampToValueAtTime(1, now + 0.005);
    env.gain.setValueAtTime(1, now + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 3);
};


const playSample = async function ( {
    if (!resumed) {
        await audio_context.resume();
        resumed = true;
    }

    sampleBuffer.start(0);
    sampleBuffer.stop(1);
}


const main = async () => {

    const $btn = document.querySelector('button'); //donner elt button avec semble de functionnalit�
    $btn.addEventListener("click", callback);

    var $choose_sample_set = document.createElement("SELECT");

    const file_tree = await loadFiles.getJSON("/fileTree.json");
    var $choose_sample_set = document.createElement("select");
    Object.keys(file_tree["sample_sets"]).forEach(key => {
        var $option = document.createElement("option");
        $option.text = key;
        $choose_sample_set.add($option);
    });



    const audio_context = new AudioContext(); //cr�e context audio
    let resumed = false;

    if (!resumed) {
        await audio_context.resume();
        resumed = true;
    }

    //var source = await loadFiles.loadWav("sounds/Test1/Drums/test1_drums1.wav", audio_context);
    //source.start(0);
    //source.stop(1);
    var current_sample_set = "Test1";
    var path_to_sample_set = file_tree["path_to_sounds"] + "/" + current_sample_set;
    const sample_set = await loadFiles.loadSampleSet(file_tree["sample_sets"]["Test1"], path_to_sample_set, audio_context);
    document.querySelector("body").appendChild($choose_sample_set);


    let boxes = document.querySelectorAll(".grid-cell");

    const sampleBuffer = await loadFiles.loadWav("sounds/Test1/Drums/test1_drums1.wav", audio_context)

    Array.from(boxes, function(box) {
      box.addEventListener("click", callback)
    });

}
window.addEventListener('load', main);
