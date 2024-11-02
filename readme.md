# Práctica del modulo Desarrollo backend con NODE impartido por Javier Miguel [**@jamg44**](https://github.com/jamg44) en KeepCoding

La práctica consiste en _desarrollar_ un **website SSR** que permita **registro** y **login** de _usuarios_, y que un usuario logueado pueda **crear**, **borrar** y **ver** _productos_ que pone a la venta llamado **Nodepop**

## Inidice

1. [Scaffolding por defecto](#scaffolding-creado-por-defecto-con-npx-express-generator----viewejs)

   1.1 [Estructura](#estructura-de-carpetas)

   1.2 [Descripcion](#descripcion-de-carpetas-y-archivos)

   1.3 [Dependencias npm](#dependencias-de-npm-instaladas)

2. [Scaffolding final](#scaffolding-final)

   2.1 [Actualizacion `npm`](#actualizacion)

   2.2 [Scripts](#edicion-de-scripts)

   2.3 [Linter `standard`](#configuracion-standard)

   2.4 [Migracion `commonJS` a `EcmaScript`](#migracion-de-commonjs-modules-a-ecmascript-modules)

3. [Ruta de desarrollo](#ruta-de-desarrollo)

   3.01 [Inicio del proyecto](#comienzo-el-proyecto-cargando-el-scaffolding-final)

   3.02 [Base de datos](#creo-base-de-datos-mongodb-en-local)

   3.03 [Conecto base de datos](#conecto-la-app-con-la-base-de-datos)

   3.04 [Modelos](#creo-los-modelos-user-y-product)

   3.05 [Script base de datos](#creo-script-que-resetea-la-base-de-datos-a-unos-valores-iniciales)

   3.06 [Version basica](#hacer-primera-version-basica-ej-get-que-devuelva-todos-los-productos-sin-filtros)

   3.07 [Login](#hacer-register-login-y-logout)

   3.08 [CRUD](#creacion-y-borrado-de-productos-opcional-update-de-producto)

   3.09 [Filtros y paginacion](#opctional-incluir-filtros-paginacion-update-etc)

   3.10 [Ejemplo llamada](#ejemplo-de-llamada-final)

## Scaffolding creado por defecto con [`npx express-generator . --view=ejs`](https://github.com/expressjs/generator)

- ### _Estructura_ de **carpetas**

      root/
        |
        |--bin/
        |   |--www
        |
        |--public/
        |     |--stylesheets/
        |             |--style.css
        |
        |--routes/
        |     |--index.js
        |     |--users.js
        |
        |--views/
        |     |--error.ejs
        |     |--index.ejs
        |
        |--app.js
        |--package.json

- ### _Descripcion_ de **carpetas** y **archivos**

  - `root/`: Raiz del proyecto

  - `bin/`: Contiene el archivo `www` en el que importamos `app.js` y que usamos como **inicio** de la app
  - `public/`: Contiene archivos `.html` `.css` `.js` que se sirven de forma **estatica**
  - `routes/`: Contiene archivos `.js` en el que defino como son las **rutas**
  - `views/`: Contiene archivos `.ejs` en el que defino las **vistas**
  - `app.js`: Archivo en el que usamos los **middlewares** de _express_, las rutas de `routes/` y el **middleware** de _error_
  - `package.json`: Archivo que contiene la informacion del proyecto de las _dependencias_ de [`npm`](https://www.npmjs.com/) que usa

- ### _Dependencias_ de `npm` instaladas

  - [`cookie-parser`](https://www.npmjs.com/package/cookie-parser)

    _middleware_ que nos permite acceder a las cookies enviadas por el cliente

  - [`debug`](https://www.npmjs.com/package/debug)

    _funcion_ que nos permite controlar que _logs_ mostramos usando la variable de entorno _DEBUG_

  - [`ejs`](https://www.npmjs.com/package/ejs)

    _view engine_ que nos permite insertar javascript en el _HTML_

  - [`express`](https://www.npmjs.com/package/express)

    _framework_ que, entre otras cosas, nos facilita el manejo de _rutas_ y _middlewares_

  - [`http-errors`](https://www.npmjs.com/package/http-errors)

    _funcion_ que nos facilita la creacion de _errores_

  - [`morgan`](https://www.npmjs.com/package/morgan)

    _middleware_ que nos muestra _logs_ de las _request_

## [Scaffolding final](https://github.com/codesthenos/express-generator-standard-template)

- ### Actualizacion

  **Actualizo** las dependencias de `npm` para tratar las **vulnerabilities** que el [anterior _scaffolding_](#scaffolding-creado-por-defecto-con-npx-express-generator----viewejs) tenia

- ### Edicion de scripts

  Edito el **script** `"start"` para arrancar el servidor usando `node --watch` y creo _scripts_ para arrancar el servidor en modo **dev** y modo **debug**:

  - `"dev": "cross-env PORT=4444 npm start"`

  - `"debug": "cross-env PORT=5555 DEBUG=npx-express-generator-ejs:* npm start"`

  Instalo **cross-env** usando [`npm i cross-env`](https://www.npmjs.com/package/cross-env) para que las variables de entorno se lean bien en todos los sistemas

- ### Configuracion [`standard`](https://standardjs.com/)

  Incluyo la _propiedad_ `"eslintConfig": { "extends": "standard" }` en el _package.json_ e instalando la dependencia usando [`npm i standard -D`](https://www.npmjs.com/package/standard), como herramienta para:

  - **linting**: conjunto de reglas que ayudan al control de errores mientras escribimos codigo

  - **formateo**: reglas especificas de como se ha de colocar el codigo, indentado, puntos y comas...

  Creo **script** `"lint": "standard"` para obtener en consola el resultado del lintado detallado

  Configuro el _VSCode_ para que cada vez que guardo automaticamente se apliquen los cambios provinientes de los _warnings_ de **standard**

- ### Migracion de **CommonJS Modules** a **ECMASCRIPT Modules**:

  - Incluyo la propiedad `"type": "module"` en el _top level_ del **package.json**

  - Cambio `__dirname` por `import.meta.dirname` en **app.js**
  - Cambio todos los `require` y `module.exports` por `import` `from` y `export` `export default`
  - La sintaxis de usar la _libreria_ **debug** cambia:

    - **Antes** una sola linea:

           const debug = require('debug')('npx-express-generator-ejs:server')

    - **Ahora** dos lineas:

           import debugLib from 'debug'
           const debug = debugLib('npx-express-generator-ejs:server')

## Ruta de desarrollo

- ### Comienzo el proyecto cargando el [scaffolding final](#scaffolding-final)

  1. Clono el [repo](https://github.com/codesthenos/express-generator-standard-template) en la carpeta **PRACTICA**

  2. Cambio el `"name"` en el **package.json** y en el **package-lock.json**
  3. Hago `npm i` para instalar las dependencias

- ### Creo base de datos MongoDB en local

  1. Descargo en instalo [MongoDB Community Server](https://www.mongodb.com/try/download/community-kubernetes-operator) y creo una conexion

  2. Instalo la extension [MongoDB for VS Code](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode) en _Visual Studio Code_ para ir comprobando los cambios en la **base de datos**

  3. Instalo la extension [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) para hacer peticiones **post** y **put** comodamente

- ### Conecto la app con la base de datos

  1. Instalo [**mongoose**](https://mongoosejs.com/) usando [`npm i mongoose`](https://www.npmjs.com/package/mongoose)

  2. Creo la funcion `connectDB` usando la funcion `mongoose.connect(MONGODB_URI)` para conectar la **app** a la **base de datos**

  3. Llamo a la funcion `connectDB` en el archivo `www` justo antes del `server.listen(port)`

  4. Creo un **log** y manejo de **errores** para comprobar si la _conexion_ ha sido satisfactoria

- ### Creo los modelos User con el metodo de schema y el metodo de instancia y el modelo Product linkeado a User

- ### Creo script que resetea la base de datos a unos valores iniciales

- ### Hacer primera version basica, ej, GET que devuelva todos los productos sin filtros cambio la carpeta rutas por la carpeta controllers, y en vez de usar el router de express, creo un middleware en el que declaro las variables locales y renderizo la vista que quiero, en el caso de homeController, la home. Creo version basica de home que muestra todos los productos en una lista con enlaces <a> a sus imagenes

- ### Hacer login y logout. OPCIONAL register TODO

- ### Hacer sistema de sesiones para tener rutas autenticadas TODO

- ### Creacion y borrado de productos OPCIONAL update de producto TODO

- ### OPCTIONAL incluir filtros, paginacion update etc TODO

- ### ejemplo de llamada final: TODO
  GET /?**tag**=_mobile_&**name**=_ip_&**price**=_50-_&**skip**=_0_&**limit**=_2_&**sort**=_price_

---

## REVISAR TODO

4. Creo **userSchema** usando `mongoose.Schema({<properties and constraints>})` y exporto el modelo `mongoose.model('User', userSchema)`

5. Defino las funciones **login**, **logout** y **registro** en la carpeta _controllers_:

   **Registro**:

   - Obtengo los datos del **req.body**

   - Compruebo si el _usuario_ ya existe para lanzar un error de **bad request**
   - Encripto la _password_ antes de enviarla a la **base de datos** usando la funcion _bcrypt_ importada del modulo [`npm i bcryptjs`](https://www.npmjs.com/package/bcryptjs)
   - Creo nuevo _usuario_ con los datos del **req.body**
   - utilizo el `.save()` de _mongoose_ para guardar el registro en la **base de datos**
   - Creo **token** usando la funcion _jwt_ importada de [`npm i jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken)
   - Creo una **cookie** usando `res.cookie('token', token)`, funcion de _express_ con la info del **token**
   - Devuelvo los datos que necesitare en la **view** con `res.status(200).json(<data>)` funcion de _express_

   **LogIn**:

   - Obtengo los datos del **req.body**

   - Compruebo si el _usuario_ ya existe para lanzar un error de **bad request**
   - Comparo la _password_ enviarda con la de la **base de datos** usando la funcion _bcrypt.compare()_ importada del modulo [`npm i bcryptjs`](https://www.npmjs.com/package/bcryptjs)
   - Creo **token** usando la funcion _jwt_ importada de [`npm i jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken)
   - Creo una **cookie** usando `res.cookie('token', token)`, funcion de _express_ con la info del **token**
   - Devuelvo los datos que necesitare en la **view** con `res.status(200).json(<data>)` funcion de _express_

   **LogOut**:

   - Limpiamos el la cookie **token** usando `res.clearCookie('token')`

## Paquetes NPM
