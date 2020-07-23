document.getElementById("clap_button").addEventListener("click", function () {
    var user_id;
    chrome.cookies.get({"url": "https://medium.com", "name": "uid"}, function (cookie) {
        if (cookie) {
            user_id = cookie.value;
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    cmd: 'send_clap',
                    user_id: user_id
                });
            });

        } else {
            alert('Failed to get uid from Cookies');
        }
    });
});
