import * as loadFiles from '/js/loadFiles.js';

const CATEGORIES_PER_SET= 4;
const SAMPLES_PER_CATEGORY = 16;



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



function loadGrid () {
    var $grid = [[], [], [], []];
    for (var i = 0; i < CATEGORIES_PER_SET; i++) {
        for (var j = 0; j < SAMPLES_PER_CATEGORY; j++) {
            $grid[i].push(document.querySelector("#sample-" + (i * SAMPLES_PER_CATEGORY + j).toString()));
        }
    }
    return $grid;

}

function viewport() {
    var e = window
        , a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width: e[a + 'Width'], height: e[a + 'Height'] }
}





function gridPlacement() {
    var $grid_container = document.getElementById("grid");
    var grid_size = 0;
    const window_size = viewport();
    if (window_size.height > window_size.width) {
        grid_size = 0.8 * window_size.width;
    } else {
        grid_size = 0.8 * window_size.height;
    }
    $grid_container.style.width = grid_size.toString() + "px";
    $grid_container.style.height = grid_size.toString() + "px";

    const left = Math.round((window_size.width - grid_size) / 2);
    const top = Math.round((window_size.height - grid_size) / 2);

    $grid_container.style.left = left.toString() + "px";
    $grid_container.style.top = top.toString() + "px";

    const $choose_sample_set = document.getElementById("choose-sample-set");
    $choose_sample_set.style.top = Math.round((top - $choose_sample_set.clientHeight) / 2).toString() + "px";
    $choose_sample_set.style.left = Math.round((window_size.width - $choose_sample_set.clientWidth) / 2).toString() + "px";

}

function playSound(buffer, time, duration, context) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(time);
  source.stop(time+duration);
}


const patternLength = 1;


const main = async () => {

    const $grid = loadGrid();




  //  const $btn = document.querySelector('button'); //donner elt button avec semble de functionnalit�
   // $btn.addEventListener("click", callback);


    const file_tree = await loadFiles.getJSON("/fileTree.json");

    var $choose_sample_set = document.getElementById("choose-sample-set");
    Object.keys(file_tree["sample_sets"]).forEach(key => {
        var $option = document.createElement("option");
        $option.text = key;
        $choose_sample_set.add($option);
    });


    gridPlacement();


    window.onresize = gridPlacement;


    const audio_context = new AudioContext(); //cr�e context audio
    let resumed = false;

    if (!resumed) {
        await audio_context.resume();
        resumed = true;
    }


    var current_sample_set = "Test1";
    var path_to_sample_set = file_tree["path_to_sounds"] + "/" + current_sample_set;
    const sample_set = await loadFiles.loadSampleSet(file_tree["sample_sets"]["Test1"], path_to_sample_set, audio_context);
    document.querySelector("body").appendChild($choose_sample_set);

    //Set color right
    for (var catID = 0; catID < 4; catID++){
      for (var boxID = 0; boxID<sample_set["sample_names"][catID].length; boxID++){
        const newColor = getComputedStyle(document.documentElement).getPropertyValue('--main-cat-color' + catID.toString() + '-bright');
        let myElement = document.querySelector("#sample-"+(catID*16+boxID).toString());
        myElement.style.backgroundColor = 'rgb('+newColor+', 0.5)';
      }
    }

    let categoryBox = Array.from(document.querySelectorAll(".cat-container"));
    let boxes = document.querySelectorAll(".grid-cell");

    let boxSelected = [0,0,0,0]

    categoryBox.forEach((cat, catID) => {
      Array.from(cat["children"]).forEach((box, boxID) => {
        /*
        const playSample = async function (){
          const sampleBuffer = sample_set["samples"][catID][boxID].slice(0)
          audio_context.decodeAudioData(sampleBuffer, function (decodedData) {
              playSound(decodedData, audio_context.currentTime, patternLength, audio_context)
          });
        }
        */
        const selectBox = async function (){
          boxSelected[catID] = boxID;
          if (boxID < sample_set["sample_names"][catID].length){
            const newColor = getComputedStyle(document.documentElement).getPropertyValue('--main-cat-color' + catID.toString() + '-dark');
            let myElement = document.querySelector("#sample-"+(catID*16+boxID).toString());
            myElement.style.backgroundColor = 'rgba('+newColor+', 0.5)';
          }

          for (var i = 0; i<sample_set["sample_names"][catID].length; i++){
            if (i != boxID){
              const newColor = getComputedStyle(document.documentElement).getPropertyValue('--main-cat-color' + catID.toString() + '-bright');
              let myElement = document.querySelector("#sample-"+(catID*16+i).toString());
              myElement.style.backgroundColor = 'rgb('+newColor+', 0.5)';
            }
          }

        }
        //$grid[catID][boxID].addEventListener("click", playSample);
        $grid[catID][boxID].addEventListener("click", selectBox);
      })
    })

    function playLoop () {
      for (var i = 0; i<4; i++){
        const sampleBuffer = sample_set["samples"][i][boxSelected[i]].slice(0)
        audio_context.decodeAudioData(sampleBuffer, function (decodedData) {
            playSound(decodedData, audio_context.currentTime, patternLength, audio_context)
        });
      }
    }

    var intervalID = window.setInterval(playLoop, patternLength*1000);

}
window.addEventListener('load', main);
