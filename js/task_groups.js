var localTaskGroups = [];
var localUsers = [];
var localUserId;

$(function() {
    $('.existing.task-groups').on('click', '.row:not(.smart)', function() {
        window.location.href = `index.html?groupId=${$(this).data('list-id')}`;
    }).on('click', '.smart.row', function() {
        const queryParams = $.param({
            userId: localUserId,
            smart: $(this).data('smart'),
        });

        window.location.href = `index.html?${queryParams}`;
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
                        <svg class="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clip-rule="evenodd"/>
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
