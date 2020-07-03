let listSmiles = ['😊', '🔥', '❤', '😁', '👍', '😎', '😉', '😇', '🎉', '🙌', '🌸', '🌹', '✅', '❌', '▶', '🙈', '❗', '🚙', '🚕', '🚩', '🚲', '🚶', '⌛', '☕', '🎁', '🎊'];

document.addEventListener('click', function(e) {
    if (e.target.id.indexOf('r') == 0)
        updateCommand(e.target.id.slice(1));
    if (e.target.id.indexOf('d') == 0)
        deleteCommand(e.target.id.slice(1));
    if (e.target.id.indexOf('c') == 0)
        cancelEditElement(e.target.id.slice(1));
    if (e.target.id.indexOf('s') == 0 && e.target.id.indexOf('m') != 1)
        saveEditElement(e.target.id.slice(1));
    if (e.target.id.indexOf('s') == 0 && e.target.id.indexOf('m') == 1)
        insertSmile(e.target.id.slice(0));
    if (e.target.id.indexOf('i') == 0 && e.target.id.indexOf('S') == 2)
        showSmile(e.target.id.slice(7));
    if (e.target.id.indexOf('check') > -1)
        taskList.finishedTask(e.target.id.slice(5));
    if (e.target.id == 'addCommand')
        addCommand();
});

// if (e.target.id.indexOf('x') == 0 && e.target.id.indexOf('s') == 1)
//     sends(e.target.id.slice());


//good
function insertSmile(id) {
    let elements = getEditElements(id);
    let command = elements.smilesPanel.getAttribute('command').slice(7);
    elements = getEditElements(command);
    let start = elements.textarea.selectionStart;
    let end = elements.textarea.selectionEnd;
    let finText = elements.textarea.value.substring(0, start) + listSmiles[id.slice(5)] + elements.textarea.value.substring(end);
    elements.textarea.value = finText;
    elements.textarea.focus();
    elements.textarea.selectionEnd = (start == end) ? (end + listSmiles[id.slice(5)].length) : end;
}


window.onload = function() {
    //ищем элемент по селектору
    var a = document.getElementById('smiles');
    //вешаем на него события
    a.onmouseout = function(e) {
        document.getElementById('smiles').className = 'smiles invisible';
    }

    a.onmouseover = function(e) {
        document.getElementById('smiles').className = 'smiles show';
    };


    let smiles = document.getElementById('smiles');
    // 
    let coutn = 0;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let div = document.createElement('div');
            div.style = `   width: 20px;
                            height: 20px;
                            margin-left: 10px;
                            margin-top: ${i*30}px;
                            position: absolute;
                            left: ${j*40}px;
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            `;

            div.setAttribute('id', `smile${coutn}`);
            div.setAttribute('ку', 'param-pam-pam');
            div.innerHTML = listSmiles[coutn++];



            smiles.append(div);
        }

    }

}


//good
function showSmile(object) {
    let smilesPanel = moveSmilePanel(object.id);
    smilesPanel.className = 'smiles show';
    smilesPanel.setAttribute('command', `${object.id}`);
}
//good
function moveSmilePanel(id) {
    let elements = getEditElements(id);

    let x = elements.iconSmile.getBoundingClientRect().x;

    let y = elements.iconSmile.getBoundingClientRect().y;
    if (y == 93.5) {
        x = x + 20;
        y = y + 60;
    }

    elements.smilesPanel.style = `top: calc(${y}px - 160px);    left: ${x}px;`;
    return elements.smilesPanel;
}
//good
function hideSmile(object) {
    let smilesPanel = moveSmilePanel(object.id);
    smilesPanel.className = 'smiles invisible';
}

//good
function clearListCommands() {
    const list = document.getElementById("save_commands");
    list.innerHTML = '';
}

//good
function cancelEditElement(id) {
    hideEditElement(id);
    clearListCommands();
    console.log(`id =${id}`)
    onLoadList();
}


function saveEditElement(id) {
    let elements = getEditElements(id);
    sendUpdateCommand(elements.command.value, elements.textarea.value);
    // console.log(check)
    hideEditElement(id);
    //if (check == true) {

    // } else {

    // }
}

onLoadList();

async function onLoadList() {
    let { all } = await fetch("/commands", getRequestOptions('getAll', '', ''))
        .then(response => response.json());
    all = JSON.parse(all)
    all.forEach(item => {
        console.log(item);
        const command = item.id;
        const textCommandAdd = item.text;
        const id = item.id;
        const list = document.getElementById("save_commands");
        let li = document.createElement('li');
        li.className = 'shadow p-3 mb-5 bg-white rounded';
        li.id = `li${id}`;
        let div = document.createElement('div');
        div.className = 'list_commands';
        let div2 = document.createElement('div');
        div2.className = 'command no_border';
        let input = document.createElement('input');
        input.id = `idCommand${id}`;
        input.type = 'text';
        input.value = command;
        input.disabled = true;
        input.className = 'command material_border';
        input.placeholder = 'command';
        div2.append(input);
        div.append(div2);
        let div3 = document.createElement('div');
        div3.className = 'text';
        let textarea = document.createElement('textarea');
        textarea.className = 'material_border save_text';
        textarea.placeholder = 'Write a message...';
        textarea.value = textCommandAdd;
        textarea.id = `idText${id}`;
        textarea.disabled = true;
        div3.append(textarea);
        let div32 = document.createElement('div');
        div32.className = 'smile_send';
        div32.innerHTML = `<a id="idSmile${id}" class="mdi mdi-panda menu-icon invisible smile color" onmouseout = "hideSmile(this)"  onmouseover = "showSmile(this)"><i class="icon icon-emoji"></i></a>`;
        div32.display = 'none';
        div3.append(div32);
        div.append(div3);
        let div4 = document.createElement('div');
        div4.className = 'button edit color';
        div4.innerHTML = `<div id="idButtonActive${id}" style="
        display: flex;
        flex-direction: row;
    "><i id="r${id}" class="mdi mdi-grease-pencil"></i>
            <i id="d${id}" class="mdi mdi-delete"></i>
        </div>    <div id="idButtonDisable${id}" class="invisible" style="
        display: flex;
        flex-direction: row;
    ">
    <i id="c${id}" class="mdi mdi-close"></i>
    <i id="s${id}" class="mdi mdi-content-save"></i>
        </div>`;
        div.append(div4);
        li.append(div);
        let t = document.createElement('div');
        list.append(li);
    });
}


async function addCommand() {
    let command = document.getElementById("commandAdd").value;
    let textCommandAdd = document.getElementById("idTextAddCommand").value;
    const list = document.getElementById("save_commands");
    let id = await sendAddCommand(command, textCommandAdd);
    console.log(id)
    if (id != 'error') {
        let li = document.createElement('li');
        li.className = 'shadow p-3 mb-5 bg-white rounded';
        li.id = `li${id}`;
        let div = document.createElement('div');
        div.className = 'list_commands';
        let div2 = document.createElement('div');
        div2.className = 'command no_border';
        let input = document.createElement('input');
        input.id = `idCommand${id}`;
        input.type = 'text';
        input.value = command;
        input.disabled = true;
        input.className = 'command no_border';
        input.placeholder = 'command';
        div2.append(input);
        div.append(div2);
        let div3 = document.createElement('div');
        div3.className = 'text';
        let textarea = document.createElement('textarea');
        textarea.className = 'material_border save_text';
        textarea.placeholder = 'Write a message...';
        textarea.value = textCommandAdd;

        textarea.id = `idText${id}`;
        textarea.disabled = true;
        div3.append(textarea);
        let div32 = document.createElement('div');
        div32.className = 'smile_send';
        div32.innerHTML = '<a src="/l" class="mdi mdi-panda menu-icon color smile"><i class="icon icon-emoji"></i></a>';
        div32.display = 'none';
        div3.append(div32);

        div.append(div3);
        let div4 = document.createElement('div');
        div4.className = 'button edit color';
        div4.innerHTML = `<i id='i${id}' class="mdi mdi-grease-pencil"></i>
        <i id='d${id}' class="mdi mdi-delete"></i>`;
        div.append(div4);
        li.append(div);

        document.getElementById('save_commands').append(li);

        document.getElementById("idTextAddCommand").value = '';
        document.getElementById("commandAdd").value = '';
        $('.modal').modal('hide');
        $('.modal').modal('toggle');
        let error = document.getElementById('error');
        error.className = "error invisible";
    } else {
        let error = document.getElementById('error');
        error.className = "error";
    }
    // } else {

    // }

    // list.parentElement.insertBefore(li, list.nextElementSibling);

}

//good
function hideEditElement(id) {
    let button = disabledEditElements(id);
    button.command.disabled = true;
    button.textarea.disabled = true;
    button.idButtonActive.className = 'activete';
    button.idButtonDisabled.className = 'invisible';
}

//good
function disabledEditElements(id) {
    let elements = getEditElements(id);
    console.log(elements)
    elements.smile.className = "mdi mdi-panda menu-icon activete smile";
    let request = {
        idButtonActive: elements.idButtonActive,
        idButtonDisabled: elements.idButtonDisabled,
        command: elements.command,
        textarea: elements.textarea,
    }
    return request;
}

//good
function showEditElement(id) {
    let button = disabledEditElements(id);
    button.command.disabled = false;
    button.textarea.disabled = false;
    button.idButtonActive.className = 'invisible';
    button.idButtonDisabled.className = 'activete';
}

//good
function getEditElements(id) {
    let command = document.getElementById(`idCommand${id}`);
    let textarea = document.getElementById(`idText${id}`);
    let smile = document.getElementById(`idSmile${id}`);
    let idButtonActive = document.getElementById(`idButtonActive${id}`);
    let idButtonDisabled = document.getElementById(`idButtonDisable${id}`);
    let smilesPanel = document.getElementById(`smiles`);
    let iconSmile = document.getElementById(`${id}`);
    let textAreaSaveCommands = document.getElementById("save_commands");
    let elements = {
        command: command,
        textarea: textarea,
        smile: smile,
        idButtonActive: idButtonActive,
        idButtonDisabled: idButtonDisabled,
        smilesPanel: smilesPanel,
        iconSmile: iconSmile,
        textAreaSaveCommands: textAreaSaveCommands
    }
    return elements;
}

//good
function updateCommand(id) {
    showEditElement(id);
}

function deleteCommand(id) {
    let answer = sendDeleteCommand(id);
    if (answer != 'error') {
        let li = document.getElementById(`li${id}`);
        li.remove();
    } else {

    }
}

//good
async function sendAddCommand(command, text) {
    const { id } = await fetch("/commands", getRequestOptions('addCommand', command, text))
        .then(response => response.json());
    if (id == 'error') {
        return 'error'
    } else
        return id;
}




//good
async function sendDeleteCommand(command) {
    const { id } = await fetch("/commands", getRequestOptions('deleteCommand', command, ""))
        .then(response => response.json());
    if (id == 'error')
        return false;
    return true;
}

//good
function getRequestOptions(type, command, text) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ 'type': type, "command": command, 'text': text });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    return requestOptions;
}


async function sendUpdateCommand(command, text) {
    console.log('update', command, text)
    const { id } = await fetch("/commands", getRequestOptions('updateCommand', command, text))
        .then(response => response.json());

    // if (id == 'error')
    //     return false;
    // else {
    //     return true;
    // }
}

function loadCommand() {}