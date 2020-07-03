let listSmiles = ['😊', '🔥', '❤', '😁', '👍', '😎', '😉', '😇', '🎉', '🙌', '🌸', '🌹', '✅', '❌', '▶', '🙈', '❗', '🚙', '🚕', '🚩', '🚲', '🚶', '⌛', '☕', '🎁', '🎊'];

document.addEventListener('click', function(e) {
    if (e.target.id.indexOf('x') == 0)
        sends();


    if (e.target.id.indexOf('s') == 0 && e.target.id.indexOf('m') == 1)
        insertSmile(e.target.id.slice(0));
    if (e.target.id.indexOf('i') == 0 && e.target.id.indexOf('S') == 2)
        showSmile(e.target.id.slice(7));
    // if (e.target.id.indexOf('check') > -1)
    //     taskList.finishedTask(e.target.id.slice(5));
    // if (e.target.id == 'addCommand')
    //     addCommand();

});

function searchCheked() {
    let elements = document.querySelectorAll('td > input:checked');
    let arr = [];
    for (let elem of elements) {
        console.log(elem); // "тест", "пройден"
        arr.push(elem.id.slice(5))
    }
    return arr;
}

async function sends() {
    // let users = ['466221437'];
    let arr = searchCheked()
    console.log(arr)
    let text = document.getElementById('idTextAddCommand');
    var myHeaders = new Headers();
    if (arr.length > 0) {
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ 'type': 'sendUsers', "text": text.value, "users": arr });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const { status } = await fetch("/commands", requestOptions)
            .then(response => {
                response.json();
                console.log('ttt')
                let text = document.getElementById('idTextAddCommand');
                text.value = '';
            });


    }
}


//good
function insertSmile(id) {
    let elements = getEditElements(id);
    let command = elements.smilesPanel.getAttribute('command').slice(7);

    elements = getEditElements(command);
    let text = document.getElementById('idTextAddCommand');
    let start = text.selectionStart;
    let end = text.selectionEnd;
    let finText = text.value.substring(0, start) + listSmiles[id.slice(5)] + text.value.substring(end);
    text.value = finText;
    text.focus();
    text.selectionEnd = (start == end) ? (end + listSmiles[id.slice(5)].length) : end;
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
    smilesPanel.setAttribute('command', `idTextAddCommand`);
}
//good
function moveSmilePanel(id) {
    let elements = getEditElements('smile_send');
    let ico = document.getElementById('smile_send');
    let x = ico.getBoundingClientRect().x;
    let y = ico.getBoundingClientRect().y;

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
    let { all } = await fetch("/commands", getRequestOptions('getUsers', '', ''))
        .then(response => response.json());
    all = JSON.parse(all)
    all.forEach(item => {
        console.log(item)

        let bodyt = document.getElementById('tbody');

        let tr = document.createElement('tr');
        let td = `
        <td>${item.name}</td>
        <td>${item.phone}</td>
        <td>${item.date}</td>
        <td>${item.id}</td>
        <td>${item.active}</td>
        <td>
            <input id = check${item.id} type="checkbox" class="check">
        </td>
    `;
        tr.innerHTML = td;

        bodyt.append(tr);
    });


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