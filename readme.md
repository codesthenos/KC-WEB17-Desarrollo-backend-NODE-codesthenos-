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

   3.05 [Script `resetDB`](#creo-script-que-resetea-la-base-de-datos-a-unos-valores-iniciales)

   3.06 [App basica](#primera-version-basica-de-la-app)

   3.07 [Manejo de sesion](#manejo-de-sesion)

   3.08 [Login y logout](#implementacion-del-login-y-logout)

   3.09 [CRUD Productos](#creacion-y-borrado-de-productos-opcional-update-de-producto-todo)

   3.10 [Filtros y paginacion](#opctional-incluir-filtros-paginacion-update-etc)

   3.11 [Ejemplo llamada](#ejemplo-de-llamada-final)

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
      ```js
      const debug = require('debug')('npx-express-generator-ejs:server')
      ```
    - **Ahora** dos lineas:
      ```js
      import debugLib from 'debug'
      const debug = debugLib('npx-express-generator-ejs:server')
      ```

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

  2. Creo la funcion `connectDB` usando la funcion [mongoose.connect(MONGODB_URI)](https://mongoosejs.com/docs/connections.html) para conectar la **app** a la **base de datos**

  3. Llamo a la funcion `connectDB` en el archivo `www` justo antes del `server.listen(port)`

  4. Creo un **log** y manejo de **errores** para comprobar si la _conexion_ ha sido satisfactoria

- ### Creo los modelos User y Product

  1. Creo **userSchema** y **productSchema** usando la funcion [Schema](https://mongoosejs.com/docs/guide.html) de [mongoose](https://mongoosejs.com/)
     ```js
     const <nameSchema> = new Schema({<properties and constraints>})
     ```
  2. Exporto modelos **User** y **Product** usando la funcion [model](https://mongoosejs.com/docs/models.html) de [mongoose](https://mongoosejs.com/)

     ```js
     const <modelName> = model(<collectionName>, <nameSchema>)
     ```

  3. Instalo [bcrypt](https://github.com/kelektiv/node.bcrypt.js) usando [`npm i bcrypt`](https://www.npmjs.com/package/bcrypt) para crear en el _modelo_ **User** un _metodo de Schema_ para **encriptar** la **password** y un _metodo de Instancia_ para **comparar passwords**

     ```js
     userSchema.statics.hashPassword = (rawPassword) =>
       bcrypt.hash(rawPassword, 10)

     userSchema.methods.comparePassword = function (rawPassword) {
       return bcrypt.compare(rawPassword, this.password)
     }
     ```

  4. En el _modelo_ **Product** la _propiedad_ **owner** es una _referencia_ al _modelo_ **User**
     ```js
     owner: { type: Schema.Types.ObjectId, ref: 'User' }
     ```

- ### Creo script que resetea la base de datos a unos valores iniciales

  1. Importo [createInterface](https://nodejs.org/api/readline.html#readlinecreateinterfaceoptions) desde ['node:readline'](https://nodejs.org/api/readline.html) para poder interactuar por consola

     ```js
     import { createInterface } from 'node:readline'
     ```

  2. Creo funcion **ask** para antes de _resetear_ la base de datos a los valores por **defecto** preguntar si estamos seguros

  3. Creo las funciones para **borrar** todos los registros e **insertar** los registros por _defecto_ tanto en **User** como en **Product**

  4. Creo conexion a la base de dato **MongoDB**

  5. Pregunto usando **ask** si estamos seguros del reseteo

     ```js
     if (answer !== 'yes') {
       console.log('RESET ABORTED')
       process.exit()
     }
     ```

  6. Reseteo primero **User** ya que el campo **owner** de **Product** es una _referencia_ a **User**

  7. Reseteo **Product** y termino el proceso con `process.exit()`

  8. Creo **script** en el **package.json** para _ejecutar_ el archivo **resetDB.js**

     `"resetDB": "node resetDB"`

- ### Primera version basica de la App

  1. Borro la carpeta **routes** ya que no voy a usar `import { Router } from 'express'`

  2. Creo carpeta **controllers** en la que creo el archivo **homeController**

  3. Creo y exporto **middleware** que importare y usare en **app.js** para la _ruta home_ `'/'`

  4. El **middleware** crea las _variables locales_ que necesita la **vista** que va a **renderizar**

  5. Cambio **index.ejs** de nombre a **home.ejs** y lo modifico para mostrar un listado de los **productos**

- ### Manejo de sesion

  Instalo [express-session](https://github.com/expressjs/session) y [connect-mongo](https://github.com/jdesboeufs/connect-mongo) usando [`npm i express-session`](https://www.npmjs.com/package/express-session) y [`npm i connect-mongo`](https://www.npmjs.com/package/connect-mongo)

  Creo **sessionManager.js** en el que _declaro_ y _exporto_ 3 funciones

  1.  `sessionMiddleware` encargado de **generar** la _cookie_ con la informacion de la **sesion** y guardarla en la **MongoDB**

      Creado _llamando_ a la funcion `session` de `express-session` y en cuyo parametro **store** _llamamos_ a la funcion `MongoStore.create()`

  2.  `setSessionLocalsMiddleware` encargado de colocar la informacion de la **session** en las variables **locales** para que las _vistas_ puedan acceder a la informacion

  3.  `isLogged` encargado de **autentificar** si estamos _logueados_ o no, se usara en los _endpoints_ de los **productos**

  4.  Uso los **middlewares** de los puntos 1 y 2 en **app.js** justo antes del _routing_

      ```js
      app.use(sessionMiddleware, setSessionLocalsMiddleware)
      ```

  5.  En **homeController.js** ahora solo creo la _variable local_ **products** si estoy logueado y los productos que busco en la MongoDB son los del **usuario** logueado

  6.  En **home.ejs** el renderizado de la lista de **productos** es condicional a si existe un `session.userId` en la _sesion_ actual

- ### Implementacion del login y logout

  1. Defino la rutas **GET** y **POST** _'/login'_ y **ALL** _'/logout'_ en **app.js**

     ```js
     app.get('/login', getLogin)
     app.post('/login', postLogin)
     app.all('/logout', logoutController)
     ```

  2. Creo `getLogin` y `postLogin` en **loginController.js**

     2.1 Creo `setupLoginLocals` en **config.js** para ahorrarme repetir codigo a lo largo de este documento

     2.2 En `getLogin` si hay usuario logueado, **redirecciono** a la _home_ y retorno, si no, defino las variables locales renderizo la vista **login.ejs**

     2.2 En `postLogin`, en este orden

     1. Recupero los _email_ y _password_ del **formulario**

     2. Normalizo el _email_ `email.toLowerCase().trim()`
     3. Busco un usuario en la **MongoDB** con el _email_ recuperado

        ```js
        const user = await User.findOne({ email: normalizedEmail })
        ```

     4. Si no hay usuario, creo las _variable locales_ de **login.ejs**, con el **error** incluido, y renderizo de nuevo **login.ejs**

     5. Si hay usuario, compruebo si la _password_ recuperada coincide con la del **usuario** encontrado

        ```js
        const passwordMatch = await user.comparePassword(password)
        ```

     6. Si no coincide, hago lo **mismo** que en el punto **4**

     7. Si coincide, creo la informacion de la **sesion** y redirecciono a la **home**

        ```js
        req.session.userId = user._id
        req.session.email = user.email
        res.redirect('/')
        ```

     8. Si ocurre algun error, llamo a `next(error)`

  3. Creo la vista **login.ejs**, _formulario_ sencillo que muestra un **error** si fallamos en el login, y tiene un link a la **home**

  4. Creo `index` en **logoutController.js** que usa [regenerate](https://expressjs.com/en/resources/middleware/session.html) de `express-session`, borra la info de la sesion actual y crea una nueva **sin usuario logueado** y nos redirecciona a la _home_

  5. En **header.ejs** el `href` del link que hay de forma condicional no lleva a _'/logout', '/login' o '/'_ dependiendo si estoy renderizando **home.ejs** o **login.ejs** y si hay o no _usuario logueado_

- ### Creacion y borrado de productos OPCIONAL update de producto TODO

  1. creo los middlewares de los endpoints en productsController.js

     1. Creo funcion GET products

     2. funcion POST product cambio un el name de los checkbox e incluyo un value para poder acceder a los tags facilmente. mirar funcion hecha

     3. DELETE product mirar funcion, pongo anchor en el home.ejs

  2. Creo endpoints en app.js, usando isLogged y los middlewares creados

  3. Creo vista para crear producto

  4. Creo boton para eliminar producto y para ir a la vista de crear producto

---

## OPTIONAL TODO

- ### OPCIONAL USAR `zod` PARA VALIDAR

- ### OPCIONAL REGISTRO

  - Obtengo los datos del **req.body**

  - Compruebo si el _usuario_ ya existe para lanzar un error de **bad request**
  - Encripto la _password_ antes de enviarla a la **base de datos** usando la funcion _bcrypt_ importada del modulo [`npm i bcryptjs`](https://www.npmjs.com/package/bcryptjs)
  - Creo nuevo _usuario_ con los datos del **req.body**
  - utilizo el `.save()` de _mongoose_ para guardar el registro en la **base de datos**
  - Creo **token** usando la funcion _jwt_ importada de [`npm i jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken)
  - Creo una **cookie** usando `res.cookie('token', token)`, funcion de _express_ con la info del **token**
  - Devuelvo los datos que necesitare en la **view** con `res.status(200).json(<data>)` funcion de _express_

  - ### OPCTIONAL incluir filtros, paginacion update etc TODO

  - ### ejemplo de llamada final: TODO

    GET /?**tag**=_mobile_&**name**=_ip_&**price**=_50-_&**skip**=_0_&**limit**=_2_&**sort**=_price_

  - ### OPCIONAL ESTILAR LAS WEBS PARA QUE SE VEAN BONITAS No se ven bonitas, pero estan estiladas

## Paquetes NPM
