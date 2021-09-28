var issueContainerEl = document.querySelector("#issues-container");

function getRepoIssues(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);
            });
        } else {
            alert("There was a problem with your request!");
        }
    });
};

function displayIssues(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!"
        return;
    }
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create a span to hold issue title
        var titleEl =  document.createElement("span");
        titleEl.textContent = issues[i].title;
        // append to container
        issueEl.appendChild(titleEl);

        // create a span to hold type of issue (issue or pull request)
        var typeEl = document.createElement("type");
        // check if issue is a pull request or not
        if (issues[i].pull_request) {
            typeEl.textContent = "Pull Request";
        } else {
            typeEl.textContent = "Issue";
        }
        // append to container
        issueEl.appendChild(typeEl);

        // append container to DOM
        issueContainerEl.appendChild(issueEl);
    };
};

getRepoIssues("mtlankenau/git-it-done");