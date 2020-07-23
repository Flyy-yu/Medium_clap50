function getpostID() {
    var url = window.location.href;
    return url.substring(url.lastIndexOf("-") + 1, url.length);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd === "send_clap") {
        console.log("let's clap");
        console.log(request.user_id);
        console.log(getpostID());
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://medium.com/_/graphql");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.withCredentials;
        var payload = {
            "operationName": "ClapMutation",
            "variables": {"targetPostId": getpostID(), "userId": request.user_id, "numClaps": 50},
            "query": "mutation ClapMutation($targetPostId: ID!, $userId: ID!, $numClaps: Int!) {\n  clap(targetPostId: $targetPostId, userId: $userId, numClaps: $numClaps) {\n    ...ClapMutation_post\n    __typename\n  }\n}\n\nfragment ClapMutation_post on Post {\n  __typename\n  id\n  clapCount\n  viewerClapCount\n  ...MultiVoteCount_post\n}\n\nfragment MultiVoteCount_post on Post {\n  id\n  ...PostVotersNetwork_post\n  __typename\n}\n\nfragment PostVotersNetwork_post on Post {\n  voterCount\n  viewerClapCount\n  recommenders {\n    name\n    __typename\n  }\n  __typename\n}\n"
        };
        xhr.send(JSON.stringify(payload));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText.indexOf('401') > -1) {
                    alert("Clap failed, are you logged in");
                } else {
                    alert("It works! Refresh the page to see the +50 👏");
                }
            }
        }
    }
});


