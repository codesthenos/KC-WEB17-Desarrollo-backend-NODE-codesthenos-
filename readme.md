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

   3.1 [Inicio del proyecto](#comienzo-el-proyecto-cargando-el-scaffolding-final)

   3.2 [Base de datos](#creo-base-de-datos-en-local)

   3.3 [Modelos](#creo-los-modelos-user-y-product)

   3.4 [Script base de datos](#creo-script-que-resetea-la-base-de-datos-a-unos-valores-iniciales)

   3.5 [Version basica](#hacer-primera-version-basica-ej-get-que-devuelva-todos-los-productos-sin-filtros)

   3.6 [Login](#hacer-register-login-y-logout)

   3.7 [CRUD](#creacion-y-borrado-de-productos-opcional-update-de-producto)

   3.8 [Filtros y paginacion](#opctional-incluir-filtros-paginacion-update-etc)

   3.9 [Ejemplo llamada](#ejemplo-de-llamada-final)

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

- ### Creo base de datos en local

- ### Conecto la app con la base de datos instalo mongoose

- ### Creo los modelos User y Product

- ### Creo script que resetea la base de datos a unos valores iniciales

- ### Hacer primera version basica, ej, GET que devuelva todos los productos sin filtros

- ### Hacer register, login y logout

- ### Creacion y borrado de productos OPCIONAL update de producto

- ### OPCTIONAL incluir filtros, paginacion update etc

- ### ejemplo de llamada final:
  GET /?**tag**=_mobile_&**name**=_ip_&**price**=_50-_&**skip**=_0_&**limit**=_2_&**sort**=_price_

---

## REVISAR TODO

2. Instalo en mi ordenador [MongoDB Community Server](https://www.mongodb.com/try/download/community-kubernetes-operator) y creo una conexion
3. Instalo [**mongoose**](https://mongoosejs.com/) usando [`npm i mongoose`](https://www.npmjs.com/package/mongoose):

   - Creo una _async funcion_ para conectar la **base de datos** usando `mongoose.connect('<URI>')`

   - La importo en el archivo **www** y la uso justo antes del `server.listen(PORT)`

4. Creo **userSchema** usando `mongoose.Schema({<properties and constraints>})` y exporto el modelo `mongoose.model('User', userSchema)`

5. Creo **auth.routes.js** dentro de _routes_ donde voy a definir las rutas con **autenticacion**, tanto la de _registro_ como la de _login_

6. Uso el **router** the _auth.routes.js_ an **app.js** `app.use('/api', authRouter)`

7. Defino las funciones de **registro** y **login** en la carpeta _controllers_:

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
   - Encripto la _password_ antes de enviarla a la **base de datos** usando la funcion _bcrypt_ importada del modulo [`npm i bcryptjs`](https://www.npmjs.com/package/bcryptjs)
   - Creo nuevo _usuario_ con los datos del **req.body**
   - utilizo el `.save()` de _mongoose_ para guardar el registro en la **base de datos**
   - Creo **token** usando la funcion _jwt_ importada de [`npm i jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken)
   - Creo una **cookie** usando `res.cookie('token', token)`, funcion de _express_ con la info del **token**
   - Devuelvo los datos que necesitare en la **view** con `res.status(200).json(<data>)` funcion de _express_

   **LogOut**:

   - Obtengo los datos del **req.body**

   - Encripto la _password_ antes de enviarla a la **base de datos** usando la funcion _bcrypt_ importada del modulo [`npm i bcryptjs`](https://www.npmjs.com/package/bcryptjs)
   - Creo nuevo _usuario_ con los datos del **req.body**
   - utilizo el `.save()` de _mongoose_ para guardar el registro en la **base de datos**
   - Creo **token** usando la funcion _jwt_ importada de [`npm i jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken)
   - Creo una **cookie** usando `res.cookie('token', token)`, funcion de _express_ con la info del **token**
   - Devuelvo los datos que necesitare en la **view** con `res.status(200).json(<data>)` funcion de _express_

## Paquetes NPM
