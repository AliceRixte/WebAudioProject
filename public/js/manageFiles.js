// This file contains all function related to file loading and management

var WavHeaders = new Headers({
    "Content-Type": "audio/wav",
    "Content-Length": window.top.length.toString(),
    "X-Custom-Header": "ProcessThisImmediately",
});

var JSONHeaders = new Headers({
    "Content-Type": "application/json",
    "Content-Length": window.top.length.toString(),
    "X-Custom-Header": "ProcessThisImmediately",
});


function initFromHeaders(headers) {
    return  { method: 'GET',
              headers: headers,
              mode: 'cors',
              cache: 'default'
            };
}


//get JSON file from Express server
export async function getJSON(url) {
    const request = new Request(url, initFromHeaders(JSONHeaders));
    const response = await fetch(request);
    const json = await response.json();
    return json;
}


export async function loadWav(url,audio_context) {
    const request = new Request(url, initFromHeaders(WavHeaders));
    const response = await fetch(request);
    const buffer = await response.arrayBuffer();
    var source = audio_context.createBufferSource();

    audio_context.decodeAudioData(buffer, function (decodedData) {
            source.buffer = decodedData;
            source.connect(audio_context.destination);
    });

    return source;
}

export async function loadSampleSet(sample_set_tree, audio_context) {
    var sample_set = [];
    Object.keys(sample_set_tree).forEach(key => {
        sample_set.push(key);
    });
    return sample_set;
}