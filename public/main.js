const socket = io();

// Productos
const prodsForm = document.querySelector('#productosForm');
const prodsContainer = document.querySelector('#productosContainer');
const inputTitle = document.querySelector('#inputTitle');
const inputPrice = document.querySelector('#inputPrice');
const inputThumbnail = document.querySelector('#inputThumbnail');

prodsForm.addEventListener('submit', e => {
    e.preventDefault();
    const producto = {
        title: inputTitle.value,
        price: inputPrice.value,
        thumbnail: inputThumbnail.value
    }
    socket.emit('productosUpdate', producto);
    prodsForm.reset();
})

const tablaHTML = productos => {
    return fetch('views/table.hbs')
        .then(res => res.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos });
            return html;
        })
}

socket.on('productos', productos => {
    tablaHTML(productos).then(html => {
        prodsContainer.innerHTML = html;
    })
});

// Mensajes
const messageForm = document.querySelector('#mensajesForm');
const messageContainer = document.querySelector('#mensajesContainer');
const inputMail = document.querySelector('#inputMail');
const inputMessage = document.querySelector('#inputMessage');
const btnSendMessage = document.querySelector('#btnSendMessage');

inputMail.addEventListener('input', () => {
    const hayMail = inputMail.value.length;
    const hayMensaje = inputMessage.value.length;
    inputMessage.disabled = !hayMail;
    btnSendMessage.disabled = !hayMail || !hayMensaje;
})

inputMessage.addEventListener('input', () => {
    const hayMensaje = inputMessage.value.length;
    btnSendMessage.disabled = !hayMensaje;
})

messageForm.addEventListener('submit', e => {
    btnSendMessage.disabled = true;
    e.preventDefault();
    socket.emit('mensajesUpdate', { mail: inputMail.value, message: inputMessage.value });
    messageForm.reset();
    inputMessage.focus();
})

const mensajesHTML = mensajes => {
    return mensajes.map(mensaje => {
        return (`
                <div>
                    <span class='message-mail'>${mensaje.mail}</span>
                    [<span class='message-fyh'>${mensaje.fyh}</span>] : 
                    <span class='message-text'>${mensaje.message}</span>
                </div>
        `)
    }).join(' ');
}

socket.on('mensajes', mensajes => {
    const html = mensajesHTML(mensajes);
    messageContainer.innerHTML = html;
    messageContainer.scrollTop = messageContainer.scrollHeight;
})