var localTask = {};
var taskChanges = {};

$(function() {
    $('#customString').on('change', function() {
        if (!$(this).val().trim()) { return; }

        taskChanges.respawn = $(this).val();
        $('#custom').trigger('click');
    });

    $('input:radio').on('click', updateRespawn);

    loadTask()
        .then(deactivateRadioTrigger)
        .then(renderRepeat)
        .then(reactivateRadioTrigger)
        .then(setupBackButton);
});

function deactivateRadioTrigger(result) {
    $('input:radio').off('click');
}
function reactivateRadioTrigger(result) {
    $('input:radio').on('click', updateRespawn);
}

function updateRespawn() {
    if ($(this).val() != 'custom') {
        $('#customString').val('');
        taskChanges.respawn = $(this).val();
    }

    if ($(this).val() == 'custom' && $('#customString').val().trim() == '') { return; }

    updateTask(taskChanges)
        .then(backToDetails);
}

function backToDetails(result) {    
    window.location.assign(`task_detail.html?taskId=${localTask.id}`);
}

function renderRepeat(result) {
    if (!localTask.respawn) {
        $('#never').trigger('click');
        return;
    }

    const commonValues = ['daily', 'weekly', 'monthly', 'yearly'];
    for (let key in commonValues) {
        const value = commonValues[key];

        if (localTask.respawn == value) {
            $(`#${value}`).trigger('click');
            return;
        }
    }

    $('#custom').trigger('click');
    $('#customString').val(localTask.respawn);
}

function setupBackButton(result) {
    $('.back.icon').on('click', function() {
        window.location.assign(`task_detail.html?taskId=${localTask.id}`);
    })
}
