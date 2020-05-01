var localTask = {};
var taskChanges = {};

$(function() {
    loadTask()
        .then(renderRepeat)
        .then(setupBackButton);
});

function renderRepeat(result) {
    if (!localTask.respawn) {
        $('#never').attr('checked', true);
        return;
    }

    const commonValues = ['daily', 'weekly', 'monthly', 'yearly'];
    for (let key in commonValues) {
        const value = commonValues[key];

        if (localTask.respawn == value) {
            $(`#${value}`).attr('checked', true);
            return;
        }
    }

    $('#custom').attr('checked', true);
    $('#customString').val(localTask.respawn);
}

function setupBackButton(result) {
    $('.back.icon').on('click', function() {
        window.location.href = `task_detail.html?taskId=${localTask.id}`;
    })
}
