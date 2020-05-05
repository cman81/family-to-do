var localTaskGroups = [];
var localUsers = [];
var localUserId;

$(function() {
    $('.existing.task-groups').on('click', '.row', function() {
        const groupName = $(this).find('.label').text();
        window.location.href = `index.html?groupId=${$(this).data('list-id')}&groupName=${encodeURI(groupName.trim())}`;
    });

    loadUsers()
        .then(response => response.json())
        .then(response => {
            localUsers = response;
            renderUsers();
        });

    loadTaskGroups()
        .then(response => response.json())
        .then(response => {
            localTaskGroups = response;
            renderTaskGroups();
        });
});

function renderUsers() {
    for(let key in localUsers) {
        const user = localUsers[key];
        const activeClass = (user.id == localUserId) ? 'active' : '';
        const currentTag = (user.id == localUserId) ? '<span class="sr-only">(current)</span>' : '';

        $('.users').append(`
            <a class="nav-item nav-link ${activeClass}" href="task_groups.html?userId=${user.id}">
                ${user.name}
                ${currentTag}
            </a>
        `);
    }
}

function loadUsers() {
    const urlVars = getUrlVars();
    localUserId = urlVars.userId || 1;

    const myRequest = new Request(`api/load_users.php`);
    return fetch(myRequest)
}

function listIcon() {
    return `
        <svg class="bi bi-list-task" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2 2.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5V3a.5.5 0 00-.5-.5H2zM3 3H2v1h1V3z" clip-rule="evenodd"/>
            <path d="M5 3.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM5.5 7a.5.5 0 000 1h9a.5.5 0 000-1h-9zm0 4a.5.5 0 000 1h9a.5.5 0 000-1h-9z"/>
            <path fill-rule="evenodd" d="M1.5 7a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H2a.5.5 0 01-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5H2zm1 .5H2v1h1v-1z" clip-rule="evenodd"/>
        </svg>
    `;
}

function peopleIcon() {
    return `
        <svg class="bi bi-people-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 100-6 3 3 0 000 6zm-5.784 6A2.238 2.238 0 015 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 005 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clip-rule="evenodd"/>
        </svg>
    `;
}

function renderTaskGroups() {
    for (let key in localTaskGroups) {
        const value = localTaskGroups[key];
        const thisIcon = (value.isPublic) ? peopleIcon() : listIcon();
        $('.existing.task-groups').append(`
            <div class="row" data-list-id="${value.id}">
                <div class="col-1 icon">
                    ${thisIcon}
                </div>
                <div class="col-8 label">
                    ${value.name}
                </div>
                <div class="col-3 list-size float-right">
                    <small>${value.taskCount || ''}</small>
                    <span class="float-right">
                        <svg class="bi bi-wrench" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M.102 2.223A3.004 3.004 0 003.78 5.897l6.341 6.252A3.003 3.003 0 0013 16a3 3 0 10-.851-5.878L5.897 3.781A3.004 3.004 0 002.223.1l2.141 2.142L4 4l-1.757.364L.102 2.223zm13.37 9.019L13 11l-.471.242-.529.026-.287.445-.445.287-.026.529L11 13l.242.471.026.529.445.287.287.445.529.026L13 15l.471-.242.529-.026.287-.445.445-.287.026-.529L15 13l-.242-.471-.026-.529-.445-.287-.287-.445-.529-.026z" clip-rule="evenodd"/>
                        </svg>
                    </span>
                </div>
            </div>

        `);
    }
}

function loadTaskGroups() {
    const myRequest = new Request(`api/load_task_groups.php?ownerId=${localUserId}`);
    return fetch(myRequest)
}
