# 📑 readMessage()

# Definición
The readMessage() function in Easy-Yopmail allows you to read the content of a specific email within a YOPmail inbox. It provides options to retrieve the content in plain text or HTML format, and even allows you to target specific elements within the email using CSS selectors.
Parámetros de entrada
Parámetro	Tipo	Descripción
mail	String	La dirección de correo electrónico YOPmail (sin el dominio @yopmail.com).
id	String	El ID único del correo electrónico que desea leer.
options	Object	(Opcional) Un objeto con opciones adicionales para personalizar la lectura.
Opciones dentro del parámetro options:
format: (Opcional) Formato del contenido del correo electrónico. Puede ser "TXT" (texto plano) o "HTML" (HTML). Por defecto es "TXT".
selector: (Opcional) Un selector CSS para apuntar a un elemento específico dentro del cuerpo del correo electrónico HTML.
attribute: (Opcional) Si se proporciona un selector, este parámetro especifica el atributo del elemento que se va a devolver (por ejemplo, "href" para un enlace).
pathToSave: (Opcional) Ruta para guardar el HTML del correo electrónico como un archivo.
Salida
La función readMessage() devuelve una promesa que se resuelve con un objeto que contiene la siguiente información:
id: El ID del correo electrónico.
submit: El asunto del correo electrónico.
from: La dirección de correo electrónico del remitente.
date: La fecha en que se recibió el correo electrónico.
deliverability: Información sobre la entrega del correo electrónico.
format: El formato del contenido devuelto ("TXT" o "HTML").
selector: El selector CSS utilizado (si se proporciona).
eq: El índice del elemento seleccionado (si se proporciona).
attribute: El atributo del elemento seleccionado (si se proporciona).
pathToSave: La ruta donde se guardó el HTML (si se proporciona).
content: El contenido del correo electrónico en el formato especificado.
info: Una lista de advertencias o mensajes informativos.
Diagrama mermaid
sequenceDiagram
participant NodeJS
participant EasyYopmail
participant Yopmail
NodeJS->>EasyYopmail: readMessage(mail, id, options)
activate EasyYopmail
EasyYopmail->>Yopmail: Request email content by ID
Yopmail->>EasyYopmail: Return email content
deactivate EasyYopmail
NodeJS->>NodeJS: Process email content (format, selector, attribute)
alt pathToSave option provided
NodeJS->>EasyYopmail: Save email HTML to file
activate EasyYopmail
EasyYopmail->>FileSystem: Save HTML content
deactivate EasyYopmail
end
Use code with caution.
Mermaid
Casos de uso prácticos
Leer el contenido de texto plano de un correo electrónico:
easyYopmail.readMessage('mi-correo', 'id-del-correo')
.then(message => {
console.log(message.content); // Contenido del correo en texto plano
});
Use code with caution.
JavaScript
Extraer un enlace de confirmación de un correo electrónico HTML:
easyYopmail.readMessage('mi-correo', 'id-del-correo', { format: 'HTML', selector: 'a.confirmation-link', attribute: 'href' })
.then(message => {
console.log(message.content); // URL del enlace de confirmación
});
Use code with caution.
JavaScript
Guardar el contenido HTML completo de un correo electrónico en un archivo:
easyYopmail.readMessage('mi-correo', 'id-del-correo', { format: 'HTML', pathToSave: './emails' })
.then(message => {
console.log('Correo electrónico guardado como archivo HTML');
});
Use code with caution.
JavaScript
Código de ejemplo
const easyYopmail = require('easy-yopmail');

easyYopmail.getInbox('test@yopmail.com')
.then(inbox => {
const emailId = inbox.inbox[0].id;

    easyYopmail.readMessage('test@yopmail.com', emailId, { format: 'HTML' }) 
    .then(message => {
        console.log(message.content); // Contenido del correo electrónico en HTML
    });
});
Use code with caution.