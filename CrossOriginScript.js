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
        fetch(getUrl(), params).then(logResponse).then(logJson).catch(logError);
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
            applySaveFromAddressCheck: true,
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
                id: "3"
            },
            headers: {
                subject: "This is a message for \ufe8e\ufee0\ufecb\ufeae\ufe92\ufef3\ufe93 and \u4e0d\u7720\u7684\u5c0f\u9e1f",
                from: [{
                    name: "\ufe8e\ufee0\ufecb\ufeae\ufe92\ufef3\ufe93",
                    email: "altestacct@yahoo.com"
                }],
                to: [{
                    name: "\ufe8e\ufee0\ufecb\ufeae\ufe92\ufef3\ufe93",
                    email: "altestacct@yahoo.com"
                }],
                replyTo: [{
                    name: "\ufe8e\ufee0\ufecb\ufeae\ufe92\ufef3\ufe93",
                    email: "altestacct@yahoo.com"
                }]
            }
        }
    };

    var data = new FormData();
    data.append("json", JSON.stringify(payload));
    var isJson = document.getElementById("content").checked;
    var isBrowserOld = document.getElementById("old").checked;
    if (!isBrowserOld) {
        var headers = {};
        if (isJson) {
            headers = {
                Accept: 'application/json'
                //‘Content-Type': 'application/json'
            }
        }
        var params = {
            mode: 'cors',
            method: "POST",
            body: data,
            headers: headers
        };
        addCredentials(params);

        var path = '/@id==' + document.getElementById("mailbox").value + '/messages';
        fetch(getUrl(path), params)
            .then(logResponse).then(logJson).catch(logError);
    } else {
        createCORSOldBrowserRequest('POST', url, isJson, data);
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
 * @returns {string}
 */
function getUrl(path) {
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
        return response.json();
    }
}

/**
 * Logs content as json. Chained after logResponse.
 *
 * @param json JSON object.
 */
function logJson(json) {
    if (json) {
        console.log('Content: ' + JSON.stringify(json));
    }
}

/**
 * Logs error in console.
 *
 * @param error Error object.
 */
function logError(error) {
    console.log(error.message);
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