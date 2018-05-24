/**
 * Method to get wss id.
 */
function getWssId() {
    var hasCookie = document.getElementById("cookie").checked;
    if (!hasCookie) {
        alert("WSS ID will not be present without cookie.");
        return;
    }

    var isBrowserOld = document.getElementById("old").checked;
    if (!isBrowserOld) {
        var params = {
            mode: 'cors'
        };
        addCredentials(params);
        fetch(getUrl('', true), params).then(logResponse).then(extractWssId).catch(logError);
    } else {
        createCORSOldBrowserRequest('GET', getUrl('', true));
    }
}

/**
 * Method to do a GET on mailboxes API.
 */
function doGet() {
    var isBrowserOld = document.getElementById("old").checked;
    if (!isBrowserOld) {
        var params = {
            mode: 'cors'
        };
        addCredentials(params);
        fetch(getUrl(), params).then(logResponse).then(extractMailboxId).catch(logError);
    } else {
        createCORSOldBrowserRequest('GET', getUrl());
    }
}

/**
 * Method to do a DELETE call on mailboxes API.
 */
function doDelete() {
    var isBrowserOld = document.getElementById("old").checked;
    if (!isBrowserOld) {
        var params = {
            mode: 'cors',
            method: "DELETE"
        };
        addCredentials(params);
        fetch(getUrl(), params).then(logResponse).then(logJson).catch(logError);
    } else {
        createCORSOldBrowserRequest('DELETE', getUrl());
    }
}

/**
 * Method to do a post save message call.
 */
function doPost() {
    var payload = {
        actions: {
            applyFilters: false,
            applyNotifications: false,
            applyVacationResponse: true,
            applyAntispam: true,
            applyForwardVerifiedCheck: true,
            saveWithVirus: false,
            applyFolderCleanup: true,
            responseMessage: true,
            responseMessageV2: false,
            saveWithInternalDate: true,
            saveWithCardDate: false,
            saveWithSkippedSchedule: false,
            applyForward: false,
            applySaveFromAddressCheck: false,
            saveWithUidl: false,
            applyMoveInSendMessage: true,
            wireTapSkipValidation: false
        },
        simpleBody: {
            text: "\u667a\u6167\u4e43\u9748\u9b42\u4e4b\u592a\u967d"
        },
        message: {
            newMessage: true,
            csid: "csid1505770544349",
            folder: {
                id: "1"
            },
            headers: {
                subject: "This is a message for \ufe8e\ufee0\ufecb\ufeae\ufe92\ufef3\ufe93 and \u4e0d\u7720\u7684\u5c0f\u9e1f",
                from: [{
                    name: "Goutham",
                    email: "goutham.rk@yahoo.com"
                }],
                to: [{
                    name: "\ufe8e\ufee0\ufecb\ufeae\ufe92\ufef3\ufe93",
                    email: "altestacct@yahoo.com"
                }],
                replyTo: [{
                    name: "Goutham",
                    email: "goutham.rk@yahoo.com"
                }]
            }
        }
    };

    var data = new FormData();
    data.append("json", JSON.stringify(payload));
    var isJson = document.getElementById("content").checked;
    var path = '/@id==' + document.getElementById("mailbox").value + '/messages';
    var isBrowserOld = document.getElementById("old").checked;
    if (!isBrowserOld) {
        var headers = {};
        if (isJson) {
            headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
        var params = {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify(payload),
            headers: headers
        };
        addCredentials(params);
        fetch(getUrl(path), params).then(logResponse).then(logJson).catch(logError);
    } else {
        createCORSOldBrowserRequest('POST', getUrl(path), isJson, data);
    }
}

/**
 * Method to so a sample websocket call.
 */
function WebSocketTest() {
    if ("WebSocket" in window) {
        var url = 'ws://jws200028x.mail.ne1.yahoo.com/ws/v3/mailboxes?appid=yahoomailneo';
        var wss = document.getElementById("wss").value;
        if (wss !== '') {
            url += '&wssid=' + wss;
        }
        // Let us open a web socket
        var ws = new WebSocket(url);

        ws.onopen = function () {
            // Web Socket is connected, send data using send()
            ws.send("Message to send");
            console.log("Message is sent...");
        };
        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            console.log("Message is received..." + received_msg);
        };
        ws.onclose = function () {
            // websocket is closed.
            console.log("Connection is closed...");
        };
    } else {
        // The browser doesn't support WebSocket
        console.log("WebSocket NOT supported by your Browser!");
    }
}

/**
 * Creates cross domain request using {XMLHttpRequest} for older browsers that do not support fetch.
 *
 * @param method HTTP method to use.
 * @param url URL to call.
 * @param preflight Whether a preflight request.
 * @param data JSON payload.
 */
function createCORSOldBrowserRequest(method, url, preflight, data) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {
        // Otherwise, CORS is not supported by the browser.
        console.log('CORS not supported');
    }

    // Response handlers.
    xhr.onload = function () {
        var text = xhr.responseText;
        console.log('Response from CORS request to ' + url + ': ' + text);
    };

    xhr.onerror = logError;
    var hasCookie = document.getElementById("cookie").checked;
    if (hasCookie) {
        xhr.withCredentials = true;
    }
    if (preflight) {
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
    }
    xhr.send(data);
}

/**
 * Gets url based on production checkbox, path and wss id provided.
 *
 * @param path Path to append after mailboxes path. Null means the url will be mailboxes path.
 * @param skipWssIdCheck boolean to indicate to skip checking if wss id is present.
 * @returns {string}
 */
function getUrl(path, skipWssIdCheck) {
    var isProd = document.getElementById("prod").checked;
    var wss = document.getElementById("wss").value;
    var url = null;
    if (isProd) {
        url = 'https://apis.mail.yahoo.com/ws/v3/mailboxes';
    } else {
        url = 'https://test-apis-12.mail.yahoo.com/ws/v3/mailboxes';
    }
    if (path != undefined) {
        url += path;
    }
    url += '?appid=yahoomailneo';
    if (wss !== '') {
        url += '&wssid=' + wss;
    } else if (skipWssIdCheck == undefined || !skipWssIdCheck) {
        alert('Please get WSS ID first.');
        return '';
    }
    return url;
}

/**
 * Logs response metadata in fetch call.
 *
 * @param response Response object.
 * @returns {Promise} as json.
 */
function logResponse(response) {
    if (response) {
        console.log('Content-Type: ' + response.headers.get('Content-Type'));
        console.log('Status: ' + response.status);
        console.log('Status-Text: ' + response.statusText);
        console.log('Type: ' + response.type);
        console.log('URL: ' + response.url);

        // Set green for 2xx and red otherwise in output text
        var outputText = document.getElementById('json');
        if (response.status >= 200 && response.status < 300) {
            outputText.classList.remove('w3-text-red');
            outputText.classList.add('w3-text-green');
        } else {
            outputText.classList.add('w3-text-red');
            outputText.classList.remove('w3-text-green');
        }
        return response.json();
    }
}

/**
 * Logs and displays content as json. Chained after logResponse.
 *
 * @param json JSON object.
 */
function logJson(json) {
    if (json) {
        var jsonString = JSON.stringify(json, null, 4);
        console.log('Content: ' + jsonString);
        var output = document.getElementById('output');
        if (jsonString != undefined && jsonString !== '') {
            output.classList.remove('w3-hide');
            document.getElementById('json').innerText = jsonString;
        } else {
            hideOutput();
        }
    }
}

/**
 * Extracts wss id and sets it in the text box. Chained after logResponse.
 *
 * @param json JSON object.
 */
function extractWssId(json) {
    if (json) {
        logJson(json);
        document.getElementById('wss').value = json['error']['details']['wssid'];
    }
}

/**
 * Extracts mailbox id and sets it in the text box. Chained after logResponse.
 *
 * @param json JSON object.
 */
function extractMailboxId(json) {
    if (json) {
        logJson(json);
        document.getElementById('mailbox').value = json['result']['mailboxes'][0]['id'];
    }
}

/**
 * Logs error in console and displays it on the page.
 *
 * @param error Error object.
 */
function logError(error) {
    console.log('Error: ' + error.message);
    var outputText = document.getElementById('json');
    outputText.classList.add('w3-text-red');
    outputText.classList.remove('w3-text-green');
    if (error.message != undefined && error.message !== '') {
        document.getElementById('output').classList.remove('w3-hide');
        outputText.innerText = 'Error: ' + error.message;
    } else {
        hideOutput();
    }
}

/**
 * Adds cookie credentials to the fetch request if cookie checkbox is checked.
 *
 * @param params fetch params.
 */
function addCredentials(params) {
    var hasCookie = document.getElementById("cookie").checked;
    if (hasCookie) {
        params.credentials = 'include';
    }
}

/**
 * Hides the output area.
 */
function hideOutput() {
    document.getElementById('output').classList.add('w3-hide');
}