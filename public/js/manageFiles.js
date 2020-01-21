export async function getJSON(url) {
    var myHeaders = new Headers({
        "Content-Type": "application/json",
        "Content-Length": window.top.length.toString(),
        "X-Custom-Header": "ProcessThisImmediately",
    });

    var myInit = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };

    // Promise
    var myRequest = new Request(url, myInit);
    const response = await fetch(myRequest);
    const json = await response.json();
    return json;
}