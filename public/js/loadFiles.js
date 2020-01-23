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

export async function loadSampleSet(sample_set_tree, path_to_sample_set, audio_context) {
    var sample_set = await getJSON(path_to_sample_set + "/metaData.json");
    sample_set["samples"] = [[], [], [], []];
    sample_set["sample_names"] = [[], [], [], []];
    sample_set["category_names"] = [];

    var i = 0;
    Object.keys(sample_set_tree).forEach(category =>  {
        if (i < 4) {
            sample_set["category_names"].push(category);
            console.log(category);
            if (sample_set_tree[category]) {
                sample_set_tree[category].forEach(async sample => {
                    sample_set["sample_names"][i].push(sample);
                    var sampleURL = path_to_sample_set + "/" + category + "/" + sample;
                    sample_set["samples"][i].push(await loadWav(sampleURL, audio_context));
                });
            }

            i++;
        }
    });
    console.log(sample_set)
    return sample_set;
}
