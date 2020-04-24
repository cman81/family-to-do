if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

var localTasks = [
    {
        id: 1,
        name: 'Cancel Hulu',
        dateDue: 'Fri, May 1'
    },
    {
        id: 2,
        name: '21 Jump Street',
    },
    {
        id: 3,
        name: 'Pure Chaos in Tabletop Simulator | Hard Mode',
        isMore: true
    },
    {
        id: 4,
        name: 'Dollar Store',
        dateDue: 'Fri, Apr 24',
        isMore: true
    },

];


const ready = function (cb) {
    // Check if the `document` is loaded completely
    document.readyState === "loading"
        ? document.addEventListener("DOMContentLoaded", function (e) {
            cb();
        })
        : cb();
};

  
ready(function() {
    document
        .querySelectorAll('#actions button')
        .forEach(element => {
            element.addEventListener('click', actionHandler);
        });

    const myRequest = new Request('api/load_tasks.php');
    fetch(myRequest)
        .then(response => response.json())
        .then(renderTaskList);
})

function actionHandler(event) {
    const operation = event.currentTarget.getAttribute('data-operation');

    if (operation == 'addTask') {
        const taskName = document.getElementById('add-task').value;

        const myRequest = new Request(
            'api/add_task.php',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: taskName
                })
            }
        );
        fetch(myRequest)
            .then(response => response.json())
            .then(renderTaskList); 
        console.log(taskName);
    }
}

function renderTaskList(tasks) {
    for (let key in localTasks) {
        const task = tasks[key];

        const $container = $('.container.existing.task');
        $container.append(`
            <div class="row">
                <div class="col">
                <form class="form-inline">
                    <div class="form-group task-checkbox">
                    <input class="form-check-input position-static" type="checkbox" value="${task.id}" aria-label="..." />
                    </div>
                    <div class="form-group task-details ${task.dateDue ? '' : 'no-due'}" data-task-id="${task.id}">
                        <div class="task-name">${task.name}</div>
                    </div>
                    <div class="form-group task-icons float-right">
                        ${task.isMore ? pencilIcon() : ''}
                    </div>
                </form>
                </div>
            </div>
        `);

        if (task.dateDue) {
            $container.find('.task-details').last().append(`
                <div class="task-due">
                    <small>${task.dateDue}</small>
                </div>
            `);
        }
    }
}

function pencilIcon() {
    return `
        <svg class="bi bi-pencil" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M11.293 1.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 00.5.5H4v.5a.5.5 0 00.5.5H5v.5a.5.5 0 00.5.5H6v-1.5a.5.5 0 00-.5-.5H5v-.5a.5.5 0 00-.5-.5H3z" clip-rule="evenodd"/>
        </svg>
    `;
}
