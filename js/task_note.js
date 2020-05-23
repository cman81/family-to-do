var emptyNotePlaceholder = `<em>Add a note</em>`;
var localTask = {};
var taskChanges = {};

$(function() {
    $('.task-note.value').on('keyup', function() {
        let noteValue = scrubNote($(this).html());
        if ($(this).html() == emptyNotePlaceholder) {
            noteValue = '';
        }

        if (localTask.taskNote == noteValue) {
            delete taskChanges.taskNote;
            return;
        }
        taskChanges.taskNote = noteValue;
        console.log(taskChanges.taskNote);
    });

    $('body').on('click', 'button', function() {
        const operation = $(this).data('operation');
        if (!operation) {
            return;
        }

        if (operation == 'updateTask') {
            updateTask(taskChanges);
            taskChanges = {};
        }
    })
        .on('click', 'div[contenteditable]', function() {
            if ($(this).html() == emptyNotePlaceholder) {
                $(this).html('');
            }
        })
        .on('blur', 'div[contenteditable]', function() {
            if (getText($(this).html()).trim() == '') {
                $(this).html(emptyNotePlaceholder);
            }
        })
        .on('click', '.back.icon', function() {
            window.location.assign(`task_detail.html?taskId=${localTask.id}`);
        });

    /**
     * Javascript trick for 'paste as plain text` in execCommand
     * @see https://stackoverflow.com/a/12028136
     */
    document.querySelector("div[contenteditable]").addEventListener("paste", function(e) {
        // cancel paste
        e.preventDefault();
    
        // get text representation of clipboard
        var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    
        // insert text manually
        document.execCommand("insertHTML", false, text);
    });

    loadTask()
        .then(renderTaskDetails);
});

function scrubNote(htmlSnippet) {
    return getText(htmlSnippet);
}

/**
 * Handle new <div> elements that are created when adding newlines to a 'contenteditable' field
 * 
 * @see https://medium.com/@albertogasparin/getting-plain-text-from-user-input-on-a-contenteditable-element-b711aba2cb36
 */
function getText() {
    let element = document.querySelector('div[contenteditable]');

    if (!element.firstChild) {
        return element.textContent;
    }

    let firstTag = element.firstChild.nodeName;
    let keyTag = new RegExp(
      firstTag === '#text' ? '<br' : '</' + firstTag,
      'i'
    );
    let tmp = document.createElement('p');
    tmp.innerHTML = element.innerHTML
      .replace(/<[^>]+>/g, (m, i) => (keyTag.test(m) ? '{ß®}' : ''))
      .replace(/{ß®}$/, '');
    return tmp.innerText.replace(/{ß®}/g, '\n');
}
