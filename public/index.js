//import * as manageFiles from '/js/manageFiles.js';

const audioContext = new AudioContext(); //cr�e context audio
const $btn = document.querySelector('button'); //donner elt button avec semble de functionnalit�
let resumed = false;




var myHeaders = new Headers({
  "Content-Type": "application/json",
  "Content-Length": content.length.toString(),
  "X-Custom-Header": "ProcessThisImmediately",
});


var fileTree ;

async function getFileTree(url){
  var myInit = { method: 'GET',
                 headers: myHeaders,
                 mode: 'cors',
                 cache: 'default'
                // body : JSON.stringify(data)
               };

  // Promise
  var myRequest = new Request(url,myInit);
  const response = await fetch(myRequest);
  const json = await response.json();
  return json;

  // .then(response => response.json()).then(result => fileTree = result)
}

fileTree = await getFileTree("/fileTree.json");

/*
function(response) {
  var contentType = response.headers.get("content-type");
  if(contentType && contentType.indexOf("application/json") !== -1) {
    return response.json().then(function(json) {

     });
  } else {
    console.log("Oops, nous n'avons pas du JSON!");
  }*/

console.log(fileTree);

var $choose_sample_set = document.createElement("SELECT");





/*console.log("Index loaded");
for (let file of manageFiles.getAllFileNames('/resources/Test1')){
    console.log(file);
};*/

const callback = async function () {

    fileTree = getFileTree("/fileTree.json");
    console.log(fileTree);
    fileTree['sample_sets'].keys.forEach(
      key => {console.log(key);}
    );

    alert(fileTree)
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
const main = async () => {
  const json = await getFileTree("/fileTree.json");

  //
}
window.addEventListener('load', main);
