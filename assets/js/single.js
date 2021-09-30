var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

function getRepoName() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    if (repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        // if no repo was given, redirect to the homepage
        document.location.replace("index.html");
    }
};

function getRepoIssues(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // if request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);
                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        } else {
            // if not successful, redirect to homepage
            document.location.replace("index.html");
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

function displayWarning(repo) {
    // add text content to limit-warning div
    limitWarningEl.textContent = "To see more than 30 issues, visit "
    // <a> tag with link to github repo URL
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
    // append <a> tag to limit-warning div
    limitWarningEl.appendChild(linkEl);
};

getRepoName();