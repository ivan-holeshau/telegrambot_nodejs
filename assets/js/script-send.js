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


//good
function insertSmile(id) {
    let elements = getEditElements(id);
    console.log(id)
    let textarea = document.getElementById('idTextAddCommand');
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    let finText = textarea.value.substring(0, start) + listSmiles[id.slice(5)] + textarea.value.substring(end);
    textarea.value = finText;
    textarea.focus();
    textarea.selectionEnd = (start == end) ? (end + listSmiles[id.slice(5)].length) : end;
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
    console.log(object.id)
    let smilesPanel = moveSmilePanel(object.id);
    smilesPanel.className = 'smiles show';
    smilesPanel.setAttribute('command', `${object.id}`);
}
//good
function moveSmilePanel(id) {
    console.log(id)
    let elements = document.getElementById(id);
    iconSmile = document.getElementById(id);
    let smilesPanel = document.getElementById('smiles');
    let x = iconSmile.getBoundingClientRect().x;
    let y = iconSmile.getBoundingClientRect().y;
    smilesPanel.style = `top: calc(${y}px - 160px);    left: ${x}px;`;
    return smilesPanel;
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




function createElement(item) {
    const textSend = item.text;
    const date = item.date;
    const id = item.id;
    const list = document.getElementById("save_sends");
    let li = document.createElement('li');
    li.className = 'shadow p-3 mb-5 bg-white rounded';
    li.id = `li${id}`;
    let liElementHtml = `
    <div class="list_commands">
    <div class="text"><textarea class="material_border save_text" placeholder="Write a message..." id="text${id}"  disabled="">${textSend}</textarea>
    </div>
    <div class="button edit color">
        <div id="" class="show" style="display: flex;flex-direction: row;font-size: 16px;">

            <div id='date${id}' style="width: 130px;"> ${date}</div>

        </div>
    </div>
</div>`;
    li.innerHTML = liElementHtml;
    // list.append(li);
    return li;
}



async function onLoadList() {

    let { all } = await fetch("/commands", getRequestOptions('getAllSend', '', ''))
        .then(response => response.json());
    all = JSON.parse(all);
    const list = document.getElementById("save_sends");
    all.forEach(item => {


        let li = createElement(item);
        list.append(li);
        //     const command = item.id;
        //     const textSend = item.text;
        //     const date = item.date;
        //     const id = item.id;
        //     console.log(item.id + " " + item.date + item.text)
        //     const list = document.getElementById("save_sends");
        //     let li = document.createElement('li');
        //     li.className = 'shadow p-3 mb-5 bg-white rounded';
        //     li.id = `li${id}`;
        //     let liElementHtml = `
        //     <div class="list_commands">
        //     <div class="text"><textarea class="material_border save_text" placeholder="Write a message..." id="text${id}"  disabled="">${textSend}</textarea>
        //     </div>
        //     <div class="button edit color">
        //         <div id="" class="show" style="display: flex;flex-direction: row;font-size: 16px;">

        //             <div id='date${id}' style="width: 130px;"> 1${date}</div>

        //         </div>
        //     </div>
        // </div>`;
        //     li.innerHTML = liElementHtml;
        //     list.append(li);
        scrollBottom();
    });
}


function scrollBottom() {
    var block = document.getElementById("save_sends");
    block.scrollTop = block.scrollHeight;
}

function getCurrentDate() {
    let date = new Date();
    let returnDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}`
    return returnDate;
}

async function addCommand() {
    let text = document.getElementById("idTextAddCommand").value;
    let date = getCurrentDate();
    const list = document.getElementById("save_commands");
    let id = await sendAddLetter(text, date);
    console.log(id)
    if (id != 'error') {
        const list = document.getElementById("save_sends");
        let item = {
            text: text,
            date: date
        }

        let li = createElement(item);
        list.append(li);
        $('.modal').modal('hide');
        $('.modal').modal('toggle');
        scrollBottom();
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
    let command = document.getElementById(`
            idCommand${ id }
            `);
    let textarea = document.getElementById(`
            idText${ id }
            `);
    let smile = document.getElementById(`idSmile${ id }
            `);
    let idButtonActive = document.getElementById(`
            idButtonActive${ id }
            `);
    let idButtonDisabled = document.getElementById(`
            idButtonDisable${ id }
            `);
    let smilesPanel = document.getElementById(`
            smiles `);
    let iconSmile = document.getElementById(`
            ${ id }
            `);
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
        let li = document.getElementById(`
            li$ { id }
            `);
        li.remove();
    } else {

    }
}

//good
async function sendAddLetter(text, date) {

    console.log('send go')
    const { id } = await fetch("/commands", getRequestOptions('addSend', text, date))
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
function getRequestOptions(type, id, date) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ 'type': type, "text": id, 'date': date });
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