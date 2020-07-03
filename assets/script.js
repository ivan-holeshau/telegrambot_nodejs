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
let listSmiles = ['😊', '🔥', '❤', '😁', '👍', '😎', '😉', '😇', '🎉', '🙌', '🌸', '🌹', '✅', '❌', '▶', '🙈', '❗', '🚙', '🚕', '🚩', '🚲', '🚶', '⌛', '☕', '🎁', '🎊'];


function insertSmile(id) {

    let smiles = document.getElementById(`smiles`);
    let smile = document.getElementById(id);
    let command = smiles.getAttribute('command').slice(7);
    let txtarea = document.getElementById(`idText${command}`);



    //text.value = text.value + listSmiles[id.slice(5)];
    // var txtarea = document.getElementById(id);
    //ищем первое положение выделенного символа
    var start = txtarea.selectionStart;
    //ищем последнее положение выделенного символа
    var end = txtarea.selectionEnd;
    // текст до + вставка + текст после (если этот код не работает, значит у вас несколько id)
    var finText = txtarea.value.substring(0, start) + listSmiles[id.slice(5)] + txtarea.value.substring(end);
    // подмена значения
    txtarea.value = finText;
    // возвращаем фокус на элемент
    txtarea.focus();
    //txtarea.selectionStart = start;
    // возвращаем курсор на место - учитываем выделили ли текст или просто курсор поставили
    txtarea.selectionEnd = (start == end) ? (end + listSmiles[id.slice(5)].length) : end;


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



function showSmile(id) {

    let iconSmile = document.getElementById(`${id.id}`);
    let smile = document.getElementById(`smiles`);

    smile.className = 'smiles show';
    let x = iconSmile.getBoundingClientRect().x;
    let y = iconSmile.getBoundingClientRect().y;
    // alert(y)
    smile.style = `top: calc(${y}px - 160px);    left: ${x}px;`;
    smile.setAttribute('command', `${id.id}`);
    // smile.remove();
    // smiles invisible
}

function hideSmile(id) {

    let iconSmile = document.getElementById(`${id.id}`);
    let smile = document.getElementById(`smiles`);

    smile.className = 'smiles invisible';
    let x = iconSmile.getBoundingClientRect().x;
    let y = iconSmile.getBoundingClientRect().y;
    // alert(y)
    smile.style = `top: calc(${y}px - 160px);    left: ${x}px;`;
    // smile.remove();
    // smiles invisible
}


function cancelEditElement(id) {
    hideEditElement(id);
    //alert('1324');
    onLoadList();
    const list = document.getElementById("save_commands");
    list.innerHTML = '';

}

function saveEditElement(id) {
    const command = document.getElementById(`idText${id}`);
    const text = document.getElementById(`idCommand${id}`);
    sendUpdateCommand(command.value, text.value);
    hideEditElement(id);

}




var t = 0;
onLoadList();

async function onLoadList() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ 'type': 'getAll', "command": '', 'text': '' });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    let { all } = await fetch("/commands", requestOptions)
        .then(response => response.json());

    all = JSON.parse(all)
    console.log(all)

    all.forEach(item => {
        console.log(item);
    });

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
        div32.innerHTML = `<a id="idSmile${id}" class="mdi mdi-panda menu-icon invisible smile color" onmouseout = "hideSmile(this)"  onmouseover = "showSmile(this)"><i class="icon icon-emoji"></i></a>
        
        `;
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


function hideEditElement(id) {
    let input = document.getElementById(`idCommand${id}`);
    input.disabled = true;
    let textarea = document.getElementById(`idText${id}`);
    textarea.disabled = true;
    let smile = document.getElementById(`idSmile${id}`);
    smile.className = "mdi mdi-panda menu-icon invisible smile";
    let idButtonActive = document.getElementById(`idButtonActive${id}`);
    idButtonActive.className = 'activete';
    let idButtonDisabled = document.getElementById(`idButtonDisable${id}`);
    idButtonDisabled.className = 'invisible';
}

function showEditElement(id) {

    let input = document.getElementById(`idCommand${id}`);
    input.disabled = false;
    let textarea = document.getElementById(`idText${id}`);
    textarea.disabled = false;
    let smile = document.getElementById(`idSmile${id}`);
    smile.className = "mdi mdi-panda menu-icon activete smile";
    let idButtonActive = document.getElementById(`idButtonActive${id}`);
    idButtonActive.className = 'invisible';
    let idButtonDisabled = document.getElementById(`idButtonDisable${id}`);
    idButtonDisabled.className = 'activete';


}

function updateCommand(id) {
    showEditElement(id);
    // sendUpdateCommand(id);


    //add smile

}






function deleteCommand(id) {

    sendDeleteCommand(id);
    let li = document.getElementById(`li${id}`);
    li.remove();
}

function loadCommand() {}



async function sendAddCommand(command, textCommandAdd) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ 'type': 'addCommand', "command": command, 'text': textCommandAdd });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    const { id } = await fetch("/commands", requestOptions)
        .then(response => response.json());

    if (id == 'error') {
        console.log(id);
        return 'error'
    } else
        return id;
}

async function sendDeleteCommand(command) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ 'type': 'deleteCommand', "command": command, 'text': '' });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    const { id } = await fetch("/commands", requestOptions)
        .then(response => response.json());
    if (id == 'error')
        console.log('error')
    return id;
}

async function sendUpdateCommand(command, text) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ 'type': 'updateCommand', "command": command, 'text': text });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    const { id } = await fetch("/commands", requestOptions)
        .then(response => response.json());
    if (id == 'error')
        console.log('error')
    return true;

}