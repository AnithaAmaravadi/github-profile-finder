 const searchBtn =
document.getElementById("searchBtn");

const profile =
document.getElementById("profile");
document
.getElementById("username")
.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        getProfile();
    }

});

searchBtn.addEventListener(
    "click",
    getProfile
);

loadHistory();

async function getProfile() {
    profile.innerHTML = `
<div class="loading">
Loading Profile...
</div>
`;

    const username =
    document.getElementById("username")
    .value
    .trim();

    if(username===""){
        alert("Enter username");
        return;
    }

    try{

        const response =
        await fetch(
            `https://api.github.com/users/${username}`
        );

        if(!response.ok){
            throw new Error();
        }

        const data =
        await response.json();

        profile.innerHTML = `
        <div class="card success">

            <img src="${data.avatar_url}">

            <h2>${data.name || data.login}</h2>

            <p>${data.bio || "No bio available"}</p>
            <p>📍 ${data.location || "Not Available"}</p>
<p>
📅 Joined:
${new Date(data.created_at)
.toLocaleDateString()}
</p>

            <div class="stats">

                <div>
                    <h3>${data.followers}</h3>
                    <p>Followers</p>
                </div>

                <div>
                    <h3>${data.following}</h3>
                    <p>Following</p>
                </div>

                <div>
                    <h3>${data.public_repos}</h3>
                    <p>Repos</p>
                </div>

            </div>

            <a href="${data.html_url}"
            target="_blank">
            View GitHub
            </a>
            <br><br>

<button
onclick="copyUser('${data.login}')">
Copy Username
</button>

        </div>
        `;

        saveHistory(username);

    }

    catch{

        profile.innerHTML = `
        <div class="card error">
            <h2>User Not Found</h2>
            <p>
            Please check the username.
            </p>
        </div>
        `;
    }
}

function saveHistory(user){

    let history =
    JSON.parse(
        localStorage.getItem("githubHistory")
    ) || [];

    history.unshift({
        user:user,
        time:new Date()
        .toLocaleString()
    });

    history = history.slice(0,10);

    localStorage.setItem(
        "githubHistory",
        JSON.stringify(history)
    );

    loadHistory();
}

function loadHistory(){

    let history =
    JSON.parse(
        localStorage.getItem("githubHistory")
    ) || [];

    const historyList =
    document.getElementById("history");

    historyList.innerHTML = "";

    history.forEach(item=>{

        historyList.innerHTML += `
        <li onclick="selectUser('${item.user}')">
            <strong>${item.user}</strong>
            <br>
            <small>${item.time}</small>
        </li>
        `;
    });
}
function selectUser(username){

    document.getElementById("username")
    .value = username;

    getProfile();
}

function clearHistory(){

    if(
        !confirm(
            "Are you sure you want to clear all history?"
        )
    ){
        return;
    }

    localStorage.removeItem(
        "githubHistory"
    );

    document.getElementById("username")
    .value = "";

    document.getElementById("profile")
    .innerHTML = "";

    loadHistory();

}
function copyUser(user){

    navigator.clipboard.writeText(user);

    alert("Username Copied!");
}
function toggleTheme(){

    document.body.classList.toggle(
        "light-theme"
    );

}
