# 📮 Easy-YOPmail
<p align="center">
    <a href="#">
        <img alt="js-packtools" src="https://gblobscdn.gitbook.com/assets%2F-MdF_xK-ItaoR0nZ_8h1%2F-Mjl185Z9hapIlRQqUgI%2F-Mjl1CqRoWAlVb8WqOgg%2FPuppy%20Training%20Tutorial%20YouTube%20Thumbnail%20(1).png" width="546">
    </a>
</p>
<p align="center">
    <a href="https://www.npmjs.com/package/easy-yopmail">
        <img alt="npm" src="https://img.shields.io/npm/v/easy-yopmail.svg?logo=npm">
    </a>
    <a href="https://app.travis-ci.com/github/jasp402/Easy-YOPmail">
        <img alt="Travis (.org)" src="https://api.travis-ci.com/jasp402/Easy-YOPmail.svg">
    </a>
</p>

>[📅 [Registros de cambios](https://jasp402.gitbook.io/easy-yopmail//changelogs): `3.0.1` | 2021.09.29 ]
---
## 💌 ¿Qué es Easy-YOPmail?
Es una librería NPM para nodeJS. Que surge de la necesidad de poder generar correos aleatorios, listar su inbox y leer los correos recibidos, sin necesidad de ingresar de manera manual a ningún sitio web. Utilizando la plataforma de YOPmail y ejecutándose de forma asíncrona. Notablemente útil para scraping, testing y automatizaciones en general.

#### Algunas de las principales funciones son:
- Generar correos electrónicos descartables
- Obtener RSS
- Obtener Inbox
- Leer correos
- Filtrar contenido dentro de un correo (Beta)

## 📦 Instalación
Puede instalar la librería mediante [NPM](https://www.npmjs.com/) o [Yarm](https://yarnpkg.com/)
```
npm i easy-yopmail
```
```
yarn add easy-yopmail
```
<p align="center">
    <a href="#">
        <img alt="js-packtools" src="https://gblobscdn.gitbook.com/assets%2F-MdF_xK-ItaoR0nZ_8h1%2F-Mjl2czgx-9-f6U8DSlG%2F-Mjl6vxELNJWqVH3-fnr%2Feasy-yopmail-install%20(1).gif" width="546">
    </a>
</p>

## 🔧 Modo de uso
``` js
const easyYOPmail = require('easy-yopmail');

easyYOPmail.getMail().then(mail => {
console.log(mail); //YourMail@yopmail.com
});
```

## 🧰 Métodos
**✉️ Correos**<br>
⚙️ [getMail()](https://app.gitbook.com/@jasp402/s/easy-yopmail/methods/mails/get-mail) <br>

**🗃️ Bandeja**<br>
⚙️ [getRSS()](https://app.gitbook.com/@jasp402/s/easy-yopmail/methods/inbox/get-rss) <br>
⚙️ [getInbox()](https://app.gitbook.com/@jasp402/s/easy-yopmail/methods/inbox/get-inbox) <br>
⚙️ [emptyInbox()](https://app.gitbook.com/@jasp402/s/easy-yopmail/methods/inbox/get-rss) <br>

**📑Mesajes**<br>
⚙️ [readMessage()](https://app.gitbook.com/@jasp402/s/easy-yopmail/methods/inbox/get-rss) <br>
⚙️ [sendMessage()](https://app.gitbook.com/@jasp402/s/easy-yopmail/methods/inbox/get-rss) <br>
⚙️ [deleteMessage()](https://app.gitbook.com/@jasp402/s/easy-yopmail/methods/inbox/get-rss) <br>

> ⚠️ **IMPORTANTE:** Para más detalles visite la documentación completa en: https://app.gitbook.com/@jasp402/s/easy-yopmail/