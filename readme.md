# Práctica del modulo Desarrollo backend con NODE impartido por Javier Miguel [**@jamg44**](https://github.com/jamg44) en KeepCoding

La práctica consiste en _desarrollar_ un **website SSR** que permita **registro** y **login** de _usuarios_, y que un usuario logueado pueda **crear**, **borrar** y **ver** _productos_ que pone a la venta llamado **Nodepop**

## Como usar app en tu ordenador

Necesitas tener isntalado en tu ordenador [GIT](https://git-scm.com/downloads), [NODE](https://nodejs.org/en/) y [MONGO](https://www.mongodb.com/try/download/community) el proyecto fue creado con la version **20.18** de NODE

1. Abre una consola de comando y navega hasta la carpeta donde quieras copiar el proyecto y escribe el comando `git clone https://github.com/codesthenos/KC-WEB17-Desarrollo-backend-NODE-codesthenos-.git` para copiar el proyecto

2. En la consola de comandos, navega hasta la carpeta que se ha creado y escribe `npm i` para instalar las _dependendias_
3. Para poder hacer el siguiente paso, necesitas crear una conexion en mongodb y para poder usar la app, una vez tengas creada la conexion, puede ser en localhost o con [atlasMongoDB](Cj0KCQiA0MG5BhD1ARIsAEcZtwTU0IB1Mt9RkItYd8ZtDOZPeo6dN4HKRJITd1jPQe4NcqvY0BZtmHEaAnLYEALw_wcB), en los archivos del proyecto, busca `/lib/connectDB.js` y donde pone **MONGO_URI** poner la `connection string` que has creado.

   Ademas en el proyecto navega hasta `/lib/sessionManager.js` y donde pone **MONGO_URI** poner la `connection string` y donde pone **SESSION_SECRET** pon una cadena de texto cualquiera

4. Ahora, estamos listos para, en la consola de comandos escribir `npm run resetDB` y poblar la base de datos que has creado con 2 usuarios con unos 50 productos cada uno, para poder usar esos usuarios para usar la app, puedes mirar su info en **resetDB.js** (tiene muchas lineas, pero porque los 100 prodcutos ocupan mucho), se encuentran facil usando control+f, si no, igualmente puedes registrar un usuario nuevo y usar la app
5. Para ver la app, podemos usar `npm run dev` para arrancar la app en el **PORT** _4444_ sin la variable de entorno **DEBUG** o usar `npm run debug` para arracar en el **PORT** _5555_ y con la variable de entorno **DEBUG** para ver logs de errores y mensajes mas largos y detalladados de error en la app
6. Una vez veas la app, los nombres de los botones hacen bastante intuitivo como usar las funcionalidades de la app

## Como funcionan los endpoints y los query params en home

1. / homepage query params:

   1. skip limit --> paginacion

   2. sort --> orden
   3. name --> filtrar por name
   4. tag --> filtrar por tag
   5. price --> filtrar por precio pattern (123-456) solo accesible por url
   6. priceMin priceMax --> filtrar por precio minimo o maximo o ambos
   7. priceExact --> filtrar por precio exacto

Ejemplo --> /?skip=&limi=t&sort=&name=&tag=&price=&priceMin=&priceMax=&priceExact=

2. /login con formulario para loguearse
3. /logout para desloguearse
4. /register para registrarse que hace login automatico
5. /create-product/:id con formulario para crear producto si estas logueado
6. /delete-product/:id borra producto y redirecciona a la homepage / solo si estas logueado
7. /update-product/:id con formulario relleno con los datos actuales del producto solo siestas logueado

## Inidice de desarrollo

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

   3.09 [CRUD Productos](#creacion-borrado-y-editado-de-productos)

   3.10 [Zod schemas y middlewares](#zod-schemas-y-middlewares)

   3.11 [Register](#register)

   3.12 [Filtros y paginacion](#filtros-y-paginacion)

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

     3. Valido el `req.body` usando la funcion `parse` de [zod](https://www.npmjs.com/package/zod) en el `loginSchema` que he creado usando _zod_ en **validatorSchemas.js**

        ```js
        loginSchema.parse(req.body)
        ```

     4. Busco un usuario en la **MongoDB** con el _email_ recuperado

        ```js
        const user = await User.findOne({ email: normalizedEmail })
        ```

     5. Si no hay usuario, creo las _variable locales_ de **login.ejs**, con el **error** incluido, y renderizo de nuevo **login.ejs**

     6. Si hay usuario, compruebo si la _password_ recuperada coincide con la del **usuario** encontrado

        ```js
        const passwordMatch = await user.comparePassword(password)
        ```

     7. Si no coincide, hago lo **mismo** que en el punto **4**

     8. Si coincide, creo la informacion de la **sesion** y redirecciono a la **home**

        ```js
        req.session.userId = user._id
        req.session.email = user.email
        res.redirect('/')
        ```

     9. Manejo errores provinientes de la _validacion_ con **zod** usando la funcion `handleLoginValidationError` que he creado en **zodErrorHandlers.js**

        ```js
        if (error instanceof z.ZodError) {
          handleLoginValidationError(title, error, res, req.body.email)
        }
        ```

     10. Si ocurre algun otro error, llamo a `next(error)`

  3. Creo la vista **login.ejs**, _formulario_ sencillo que muestra un **error** si fallamos en el login, y tiene un link a la **home**, el boton `submit` hace una peticion **POST** a `/login`

  4. Creo `index` en **logoutController.js** que usa [regenerate](https://expressjs.com/en/resources/middleware/session.html) de `express-session`, borra la info de la sesion actual y crea una nueva **sin usuario logueado** y nos redirecciona a la _home_

  5. En **header.ejs** el `href` del link que hay de forma condicional no lleva a _'/logout', '/login' o '/'_ dependiendo si estoy renderizando **home.ejs** o **login.ejs** y si hay o no _usuario logueado_

- ### Creacion, borrado y editado de productos

  1.  Creo los **middlewares** en **productsController.js** para manejar las rutas de _product_

      1.  En `getCreateProduct` defino las **locals** que necesito para renderizar **create-product.ejs**

      2.  En `postNewProduct` en este orden

          1. Guardo en _variables_ los datos del _formulario_ usando el **req.body**

          2. Guardo la variable _userId_ usando el **req.session.userId**

          3. Valido el `req.body` usando la funcion `parse` de [zod](https://www.npmjs.com/package/zod) en el `productSchema` que he creado usando _zod_ en **validatorSchemas.js**

          ```js
          productSchema.parse(req.body)
          ```

          4. Guardo en la variable _newProduct_ un `new Product` con los datos obtenidos en el paso `1.` y usando `await newProduct.save()` lo guardo en la **MongoDB**

          5. Redireciono a `'/'`

          6. Manejo errores provinientes de la _validacion_ con **zod** usando la funcion `handleProductValidationError` que he creado en **zodErrorHandlers.js**

          ```js
          if (error instanceof z.ZodError) {
            handleProductValidationError(
              CREATE_PRODUCT_TITLE,
              error,
              res,
              name,
              price,
              image,
              tags
            )
          }
          ```

          7. Llamo a `next(error)` en caso de otro tipo de error

      3.  En `deleteProduct` en este orden

          1. Guardo la variable _productId_ leyendo los parametros de ruta usando **req.params.id**

          2. Guardo el _userId_ como en `postNewProduct`, leyendo la sesion **req.session.userId**

          3. Busco con un _producto_ con el _productId_ en la **MongoBD** usando `await Product.findById(productId)`

          4. Si no existe un _producto_ en la **MongoDB** con ese \__id_ muestro un warn en consola, llamo a `next(createError(404))` [createError info](https://github.com/jshttp/http-errors) y salgo de la funcion

          5. Si el _userId_ obetindo de la sesion en el paso `2.` no coincide con el `product.owner.toString()` quiere decir que el usuario que esta intentando borrar el producto, no es el dueño del producto, asi que lanzamos `next(createError(401))` y salgo de la funcion

          6. En caso contrario, elimino el _producto_ de la **MongoDB** usando `await Product.deleteOne({ _id: productId })`

          7. Redireciono a `'/'`

          8. Llamo a `next(error)` en caso de cualquier otro error

      4.  En `getUpdateProduct` en este orden

          1. Leo de los parametros de ruta `req.params` el _id_ del producto y lo guardo en la varible `id`

          2. Leo de la sesion `req.session.userId` el _id_ del usuario y lo guardo en la variable `userId`

          3. Busco el producto con el `id` y guardo su informacion en _variables_

             ```js
             const { name, price, image, tags, owner } = await Product.findById(
               id
             )
             ```

          4. Compruebo si existe un producto en la _base de datos_, si no lanzo `next(createError(404))`

          5. Compruebo si el `userId` y el `id` coinciden, si no lanzo `next(createError(401))`

          6. Preparo las `res.locals` usando la funcion `setLocals` que he creado en **config.js** para que el formulario salga directamente con la info del producto

          7. Renderizo **create-product.ejs** si no ha habido fallo y si no, llamo a `next(error)`

      5.  En `postUpdateProduct` en este orden

          1. Guardo en variables los datos del _body_ de la _request_ `req.body`

          2. Guardo en la variable _id_ el id del producto obetindo de los parametros de ruta `req.params`

          3. Guardo en la variable _userId_ el id del usuario logueado usando `req.session.userId`

          4. Guardo en la variable _producto_ el resultado de `await Product.findById(id)`

          5. Checkeo si el _producto_ existe, si no lanzo error `next(createError(404))`

          6. Checkeo si el _id_ del usuario coincide con el _owner_ del producto, si no, lanzo error `next(createError(401))`

          7. (Ahora, validaria con zod, igual que en login, register y createProduct, pero al final, para validar, he creado un _middleware_ y lo paso por la ruta despues del middleware de sesion y antes del controller)

          8. Guardo en la variable _updatedProduct_ el resultado de `await Product.findByIdAndUpdate(id, <productData>)`

          9. Redirecciono a la home si todo va bien

          10. En caso de error, si el error es por duplicacion de _name_ renderizo otra vez **create-product.ejs** con las locals y un error

          11. Si el error es cualquier otro, llamo uso `next(error)`

  2.  Creo las rutas relacionadas con _product_ en **app.js**, usando primero el _middleware_ **isLogged** para comprobar _autenticacion_ y seguido, los _middlewares_ creados

      ```js
      app.get('/create-product', isLogged, getCreateProduct)
      app.post('/create-product', isLogged, postNewProduct)
      app.get('/delete-product/:id', isLogged, deleteProduct)
      ```

  3.  Creo _vista_ **create-product.ejs** para crear producto, en todos los checkboxes para los **tags** uso el mismo `name="tag"` e incluyo `value=<tagName>` para poder acceder a los tags facilmente en el servidor

  4.  Creo dos enlaces, `<a>` uno en el **header.ejs** que hace una peticion **GET** a `/create-product` y otro en **home.ejs** que hace una peticion **GET** a `/delete-product/<productId>` para eliminar producto

  5.  El boton `submit` de la vista **create-product.ejs** hace una peticion **POST** a `/create-product`

### Zod schemas y middlewares

En vez de usar la funcion _parse_ de _zod_ directamente en los controladores, creo en el archivo **validatorSchemas.js** la funcion de orden superior `validatorMiddleware = ({...}) => (req, res, next) => {}` en la que uso _parse_ y manejo el error con el _errorHandler_ que es una de las funciones de **zodErrorHandlers.js**, esta funcion me va a servir para crear los _middleware de validacion_ para las peticiones **POST** en `/login` y `/register`

Tambien creo `validatorProductMiddleware = ({...}) => (req, res, next) => {}` en la que uso _parse_ y en el manejo de errores el _errorHandler_ recibe distintos atributos al _errorHandler_ `validatorMiddleware` esta esta pensada para crear los _middleware de validacion_ para las peticiones **POST** en `/create-product` y `/updateProduct/:id`

Como es de las primeras veces que uso este tipo de funciones, para `/login` y `/register` la uso directamente en **app.js**
de un modo parecido en ambas rutas

```js
app.post(
  '/login',
  validatorMiddleware({
    title: LOGIN_TITLE,
    schema: loginSchema,
    errorHandler: handleLoginValidationError
  }),
  postLogin
)
```

En el caso de las rutas `/create-product` y `/updateProduct/:id` opto por en **validatorSchemas.js** crear los middlewares especificos de ambas rutas, ambos muy parecidos

```js
export const createProductValidatorMiddleware = validatorProductMiddleware({
  title: CREATE_PRODUCT_TITLE,
  schema: productSchema,
  errorHandler: handleProductValidationError
})
```

Y en **app.js** usar estos middlewares directamente

```js
app.post(
  '/create-product',
  isLogged,
  createProductValidatorMiddleware,
  postCreateProduct
)
```

Para dejar huella de como lo hacia al pricipio, he comentado en los controllers las partes de la validacion en vez de borrarlas

### Register

1. Defino la rutas **GET** y **POST** _'/register'_ en **app.js**

   ```js
   app.get('/register', getRegister)
   app.post(
     '/register',
     validatorMiddleware({
       title: REGISTER_TITLE,
       schema: loginSchema,
       errorHandler: handleLoginValidationError
     }),
     postRegister
   )
   ```

2. Creo `getRegister` y `postRegister` en **registerController.js**

   1. En `getRegister` si hay usuario _logueado_ redirecciono a `'/'`, si no, hago set up de las _locals_ y renderizo `login-register.ejs`
      ```js
      export const getRegister = (req, res) => {
        if (req.session.userId) return res.redirect('/')
        setLocals(res, { title })
        res.render('login-register')
      }
      ```
   2. En `postRegister` en este orden

      1. Recupero el _email_ y la _password_ del _req.body_

         ```js
         const { email, password } = req.body
         ```

      2. Normalizo el _email_

         ```js
         const normalizedEmail = email.toLowerCase().trim()
         ```

      3. Compruebo si hay ya un usuario en la _MongoDB_ con ese _email_ y si lo hay manejo el error

         ```js
         const user = await User.findOne({ email: normalizedEmail })
         if (user) {
           setLocals(res, {
             title,
             email,
             error: '   ERROR: This email is already REGISTERED'
           })
           res.render('login-register')
           return
         }
         ```

      4. Creo el _user_ que voy a _insertar_ en la _MongoDB_, usando el metodo `userSchema.statics.hashPassword` para que en la base de datos la _password_ se guarde _encriptada_

         ```js
         const newUser = new User({
           email: normalizedEmail,
           password: await User.hashPassword(password)
         })
         ```

      5. Guardo el nuevo usuario en la _MongoDB_

         ```js
         const savedUser = await newUser.save()
         ```

      6. Hago que al hacer el registro de usuario, se haga _login_ y redirecciono a `'/'`

         ```js
         req.session.userId = savedUser._id
         req.session.email = savedUser.email
         res.redirect('/')
         ```

      7. Manejo posibles errores no manejados llamando a `next(error)`

### Filtros y paginacion

No voy a poder realizar una descripcion objetiva exacta de como he llegado al resultado final, ya que al principio hice la paginacion, y mientras hacia el sorting, me di cuenta de cosas que tenia que cambiar en la paginacion y lo mismo con los filtros, el caso es que ha ido evolucionando el codigo.

#### homeController.js

Si no hay usuario logueado, hace render de **home.ejs**, que si no tiene usuario es una pagina muy simple que usa pocas _locals_

Si hay usuario loguado, en este orden

1. Inicio las _locals_ del `href` del boton _Logout_ y del `children` (el texto del boton)

2. Creo la variable `owner` con el valor del `req.session.userId`

3. Creo las variables `skip, limit, sort, name, price, tag, priceMin, priceMax, priceExact` con los valores obtenidos de `req.query` (query params)

4. Inicio la variable `const options = {}` que es el objeto que le voy a pasar a _mongoose_ para **paginar** y **ordenar**

5. Inicio las _locals_ de los `href` de los botones que manejan la navegacion de **ordenar** (nombre y precio, ascendente y descendente), **desordenar** y **resetear** los _filtros_ (nombre, precioMin/precioMax, precioExact, tag), para ello uso la _funcion_ **normalizeURL** que he creado en **config.js**

6. Para que no haya cosas raras en la paginacion, si en la _URL_, solo existen **skip** o **limit**, una de las dos de forma obligatoria (son los query params encargados de la paginacion), en el caso de que solo haya uno, redirecciono a una _URL_ que **elimina** ambos, devolviendo la misma _URL_ pero sin **skip** ni **limit**

   ```js
   if ((!limit && skip) || (limit && !skip)) {
     res.redirect(
       normalizeURL({ ...currentParams, skip: undefined, limit: undefined })
     )
     return
   }
   ```

7. Si tengo **skip** y **limit** entonces hago los calculos necesarios para crear los `href` de los _botones_ que manejan la **paginacion** (nextPage, previousPage y showAll)

8. Tanto si tengo **skip** y **limit** como si no, inicio la _locals_ del `href` del boton `show 2 by 2` que sirve para ver la lista paginada

9. Inicio la variable `const filters = { owner }`

10. Si tengo **name** meto en _filters.name_ `new RegExp()` e inicio la `res.locals.name = name`

11. Si tengo **tag** meto en `normalizedTag` el resultado de usar `validateQueryTag(tag)` una _funcion_ que he creado en **config.js** que valida y normaliza el tag y en el caso de no seguir un patron `regexp` concreto lanza un error especifico

12. Si no ha habido error, meto en _filters.tag_ `normalizedTag` e inicio `res.locals.tag = normalizedTag`

13. Si tengo **sort** intento `res.locals.sort = validateQuerySort(sort)` que es una _funcion_ para validar _sort_ y lanzar un error especifico en el caso de no seguir un patron `regexp` concreto

14. Si no ha sucedido error, meto en _options.sort_ `normalizeSortMongo(sort)` una _funcion_ para normalizar **sort** a una forma que `mongoose` entienda para poder ordenar

15. Para el **price**, como he querido al principio no complicarme, use el _query param_ **price** que proponia Javier, uno que siguiese el patron numero-numero y cree toda la estructura para que funcionase el filtro con ese query param, pero luego a la hora de hacer las vistas, si quiero que el usuario tenga las opciones de usar el filtro que he creado (usar solo mayor que, o solo menor que, o ambos, o usar precio exacto) solo se me ocurria teniendo mas query params, asi que al final, ha quedado una estructura muy compleja, de forma innecesaria, pero que me ha ayudado a aprender un monton!! Por cierto Javier si has llegado hasta leer esto GRACIAS MIL GRACIAS

16. La idea detras de lo que voy a explicar es que el usuario tiene forma a traves de un formulario de poder poner un precio minimo o maximo, o ambos, y a traves de otro poner un precio exacto, he intentado pensar en todos los detalles, desactivar un formulario si el otro esta en uso para que no entre en conflito, asi como el **price** solo se puede poner directamente en la url, pero si lo intentas poner cuando hay alguno de los otros activo, elimina los otros (relativos al precio) y usa el **price**, asi como si existe **price** en la url y quieres usar el formulario del precio exacto o del min/max, lo que hace es no deolver el **price** quedandose solo con el que haya enviado y los otros que hubiese que no sean del precio.

17. Ademas de que he pensado en todos los casos de error que se me han ocurrido tanto en formularios como en los query params directamente en la url manejando todos de forma especifica para que te manden mensajes de error en un sitio u otro de la pantalla, o que eliminen query params.

18. Haya vamos con la explicacion del codigo relativo a esto

19. Primera comprobacion, si en los _query params_ tengo **price** y ademas tengo uno de los siguientes **priceMin**, **priceMax** o **priceExact**
    ```js
    res.redirect(
      normalizeURL({
        ...currentParams,
        priceMin: '',
        priceMax: '',
        priceExact: ''
      })
    )
    ```
20. Siguiente, si tengo **price**, uso `validateQueryPrice(price)` una funcion creada en **config.js** que valida price usando una `regexp` que si no pasa lanza un error especifico, inicio las _res.locals.price_ y _res.locals.priceView_

21. Meto en _filters.price_ `normalizePriceMongo(price)` una _funcion_ para normalizar **price** a una forma que `mongoose` entienda para poder _filtrar_

22. Si no tengo **price** y tengo alguno de los siguientes **priceMin**, **priceMax** o **priceExact**, inicio las _res.locals.priceMin_, _res.locals.priceMax_ y _res.locals.priceExact_

23. Creo `const validatedPrice = normalizedPrice({ priceMin, priceMax, priceExact })` usando la _funcion_ `normalizedPrice` que creo en **config.js** y que primero valida el unico error posible a traves del formulario que seria poner un valor negativo y lanza error especifico, luego valida si ha sido una entrada no numerica (solo se podria tocando en la url directamente) y lanza un error distinto al anterior, y si pasa las validaciones, devuelve una cadena de texto que mi funcion `normalizePriceMongo` entiende

24. Si pasa la validacion, meto en _filters.price_ el resultado de llamar a `normalizePriceMongo(validatedPrice)` para crear el **filtro** que usa mi funcion de _mongoose_

25. FINALMENTE (aparentemente) incio las _locals_ y renderizo **home.ejs**

    ```js
    res.locals.productsLength = await Product.countDocuments(filters)
    res.locals.products = await Product.list({ filters, options })
    res.render('home')
    ```

26. Manejo de errores, antes del ultimo refactor, esto eran 150 lineas de codigo LOL

27. Justo despues del `catch(error)` uso la funcion `setLocals` creada en **config.js** para iniciar las _res.locals_ comunes en todos los errores (este fue el refactor)

28. Inicio arbol de _if_ y _else if_ para manejar los distintos casos de error, y poder lanzar un mensaje o incluso colocar el mensaje en un sitio distinto, dependiendo del error identificado

29. Como he ido validando y lanzando yo los errores con _mensajes_ especificos, puedo identificar los errores a traves del `error.message`, iniciar la _res.local.error_ o _res.local.errorURL_ y renderizar **home.ejs**

    ```js
    } else if (error.message === '400 BAD REQUEST | ERROR in URL: TAG query param should match <motor|lifestyle|mobile|work> pattern') {
    res.locals.errorURL = 'IF YOU WANNA PLAY DIRECTLY WITH THE URL QUERY PARAMS\ntag MUST MATCH ONE OF THE FOLLOWING PATTERNS\n  motor | lifestyle | mobile | work'
    res.render('home')
    return
    ```

30. Para finalizar, las vistas son bastante simplonas, todo **handMade** usando _vanilla_ **HTML** y **CSS**, podria haber hecho mucho mejor las cosas de frontend, pero este no era el modulo para ello.

MUCHAS GRACIAS POR LAS CLASES JAVIER
