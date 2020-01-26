import * as loadFiles from '/js/loadFiles.js';

const CATEGORIES_PER_SET = 4;
const SAMPLES_PER_CATEGORY = 16;



const audio_context = new AudioContext(); //cr�e context audio
let resumed = false;


function loadGrid() {
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

function brighterBox(i, j) {
    const newColor = getComputedStyle(document.documentElement).getPropertyValue('--main-cat-color' + i.toString() + '-bright');
    let myElement = document.querySelector("#sample-" + (i * 16 + j).toString());
    myElement.style.backgroundColor = 'rgba(' + newColor + ', 0.5)';
}

function darkerBox(i, j) {
    const newColor = getComputedStyle(document.documentElement).getPropertyValue('--main-cat-color' + i.toString() + '-dark');
    let myElement = document.querySelector("#sample-" + (i * 16 + j).toString());
    myElement.style.backgroundColor = 'rgba(' + newColor + ', 0.5)';
}

function playSound(buffer, time, duration, context) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
    source.stop(time + duration);
}



function patternLength(bpm, beat_number) {
    return beat_number * 60. / bpm;
}


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
    document.querySelector("body").appendChild($choose_sample_set);


    gridPlacement();


    window.onresize = gridPlacement;


    const audio_context = new AudioContext(); //cr�e context audio
    let resumed = false;

    if (!resumed) {
        await audio_context.resume();
        resumed = true;
    }

    var sample_set;




    var intervalID;

    async function loadSampleSet() {
        var current_sample_set = document.getElementById("choose-sample-set").options[document.getElementById("choose-sample-set").selectedIndex].text;
        var path_to_sample_set = file_tree["path_to_sounds"] + "/" + current_sample_set;
        sample_set = await loadFiles.loadSampleSet(file_tree["sample_sets"][current_sample_set], path_to_sample_set, audio_context);

        setColorsInit(sample_set);
        if (intervalID)
            clearInterval(intervalID)
        intervalID = window.setInterval(playLoop, patternLength(sample_set.bpm, sample_set.nb_beat) * 1000);


    }


    function setColorsInit(sample_set) {
        for (var catID = 0; catID < 4; catID++) {
            for (var boxID = 0; boxID < 16; boxID++) {
                var newColor;
                if (boxID < sample_set["sample_names"][catID].length) {
                    if (boxSelected[catID].indexOf(boxID) >= 0) 
                        newColor = getComputedStyle(document.documentElement).getPropertyValue('--main-cat-color' + catID.toString() + '-dark');
                    else 
                        newColor = getComputedStyle(document.documentElement).getPropertyValue('--main-cat-color' + catID.toString() + '-bright');
                }
                else 
                    newColor = '255,255,255';
                let myElement = document.querySelector("#sample-" + (catID * 16 + boxID).toString());
                myElement.style.backgroundColor = 'rgba(' + newColor + ', 0.5)';
            }
        }
    }


    loadSampleSet();

    let played_already = [];
    for (var i = 0; i < CATEGORIES_PER_SET; i++) {
        played_already.push(Array(SAMPLES_PER_CATEGORY).fill(false));
    }
    let boxSelected = [[], [], [], []]; //Which box is currently selected for each category



    let categoryBox = Array.from(document.querySelectorAll(".cat-container"));
    let boxes = document.querySelectorAll(".grid-cell");


    categoryBox.forEach((cat, catID) => {
        Array.from(cat["children"]).forEach((box, boxID) => {
            //Callback function to change colors of boxes when selecting a new one
            const selectBox = function () {
                const index = boxSelected[catID].indexOf(boxID)
                if (index >= 0) {
                    console.log(index);
                    boxSelected[catID].splice(index, 1);
                    brighterBox(catID,boxID);
                }


                else {
                    if (boxSelected[catID].length >= sample_set["simultaneous_samples"][catID])
                        brighterBox(catID, boxSelected[catID].shift());
                    if (boxID < sample_set["sample_names"][catID].length) {
                        boxSelected[catID].push(boxID);
                        played_already[catID][boxID] = false;
                        darkerBox(catID, boxID);
                    }
                }
               

            }
            $grid[catID][boxID].addEventListener("click", selectBox);
        })
    })


    function playLoop() {
        console.log(boxSelected);
        for (var i = 0; i < 4; i++) {
            boxSelected[i].forEach(j => {
                if (sample_set["samples"][i][j] !== undefined) {
                    if (sample_set["repeat"][i] || !played_already[i][j]) {
                        const sampleBuffer = sample_set["samples"][i][j].slice(0);
                        played_already[i][j] = true;
                        audio_context.decodeAudioData(sampleBuffer, function (decodedData) {
                            playSound(decodedData, audio_context.currentTime, patternLength(sample_set.bpm, sample_set.nb_beat), audio_context)
                        });
                    }
                    else {
                        const index = boxSelected[i].indexOf(j);
                        if (index > -1) {
                            boxSelected[i].splice(index, 1);
                        }
                        brighterBox(i, j);
                    }
                }
            });
        }
    }




    function listQ() {
        const e = document.getElementById("choose-sample-set");
        console.log();
    }

    document.getElementById("choose-sample-set").onchange = loadSampleSet;
}
window.addEventListener('load', main);
