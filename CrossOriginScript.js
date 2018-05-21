function doGet() {
    var path = document.getElementById("url").value;
    if (path === '') {
        alert("URI path should not be empty");
        return;
    }
    var headers = {};
    var params = {
        mode: 'cors',
        headers: headers
    };

    var cookie = document.getElementById("cookie").value;
    if (cookie !== '') {
        headers.Cookie = cookie;
        params.credentials = 'include';
    }

    fetch("https://test-apis-12.mail.yahoo.com" + path, params)
        .then(function (response) {
            console.log('Content-Type: ' + response.headers.get('Content-Type'));
            console.log('Status: ' + response.status);
            console.log('Status-Text: ' + response.statusText);
            console.log('Type: ' + response.type);
            console.log('URL ' + response.url);
        })
        .catch(function (error) {
            console.log(error.message);
        });
}

function doDelete() {
    var path = document.getElementById("url").value;
    if (path === '') {
        alert("URI path should not be empty");
        return;
    }
    var headers = {};
    var params = {
        mode: 'cors',
        method: "DELETE",
        headers: headers
    };

    var cookie = document.getElementById("cookie").value;
    if (cookie !== '') {
        headers.Cookie = cookie;
        params.credentials = 'include';
    }

    fetch("https://test-apis-12.mail.yahoo.com" + path, params)
        .then(function (response) {
            console.log('Content-Type: ' + response.headers.get('Content-Type'));
            console.log('Status: ' + response.status);
            console.log('Status-Text: ' + response.statusText);
            console.log('Type: ' + response.type);
            console.log('URL ' + response.url);
        })
        .catch(function (error) {
            console.log(error.message);
        });
}

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

    var path = document.getElementById("url").value;
    if (path === '') {
        alert("URI path should not be empty");
        return;
    }

    var data = new FormData();
    // data.append("json", JSON.stringify(payload));
    data.append("json", payload);
    var isJson = document.getElementById("content").checked;
    var headers = {};
    if (isJson) {
        headers = {
            Accept: 'application/json',
            Content-Type: 'application/json'
        }
    }
    var params = {
        mode: 'cors',
        method: "POST",
        body: data,
        headers: headers
    };

    var cookie = document.getElementById("cookie").value;
    if (cookie !== '') {
        headers.Cookie = cookie;
        params.credentials = 'include';
    }

    fetch("https://test-apis-12.mail.yahoo.com" + path, params)
        .then(function (response) {
            console.log('Content-Type: ' + response.headers.get('Content-Type'));
            console.log('Status: ' + response.status);
            console.log('Status-Text: ' + response.statusText);
            console.log('Type: ' + response.type);
            console.log('URL ' + response.url);
        })
        .then(function (response) {
            if (response) {
                console.log('Content-Type: ' + response.headers.get('Content-Type'));
                console.log('Status: ' + response.status);
                console.log('Status-Text: ' + response.statusText);
                console.log('Type: ' + response.type);
                console.log('URL ' + response.url);
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
}