# Práctica del modulo Desarrollo backend con NODE impartido por Javier Miguel [**@jamg44**](https://github.com/jamg44) en KeepCoding

La práctica consiste en _desarrollar_ un **website SSR** que preste un servicio de venta de articulos de segunda mano llamado **Nodepop**

## Descripcion del website

## Ruta de desarrollo

1. **Scaffolding** del proyecto usando **`npx express-generator nodepop --ejs`**:

   Este comando nos crea una estructura de carpetas y archivos inciales y el **`package.json`** con las dependencias:

   - ["cookie-parser"](https://www.npmjs.com/package/cookie-parser)

     _middleware_ que nos permite acceder a las cookies enviadas por el cliente

   - ["debug"](https://www.npmjs.com/package/debug)

     _funcion_ que nos permite controlar que _logs_ mostramos usando la variable de entorno _DEBUG_

   - ["ejs"](https://www.npmjs.com/package/ejs)

     _view engine_ que nos permite insertar javascript en el _HTML_

   - ["express"](https://www.npmjs.com/package/express)

     _framework_ que, entre otras cosas, nos facilita el manejo de _rutas_ y _middlewares_

   - ["http-errors"](https://www.npmjs.com/package/http-errors)

     _funcion_ que nos facilita la creacion de _errores_

   - ["morgan"](https://www.npmjs.com/package/morgan)

     _middleware_ que nos muestra _logs_ de las _request_

   **Disclaimer** este _scaffolding_ tiene por defecto **vulnerabilities** que no han sido tratadas

2. Edito el **Script** `"start"` para arrancar el servidor usando `node --watch` y creo _Scripts_ para arrancar el servidor en modo **dev** y modo **debug**:

   - `"dev": "cross-env PORT=4444 npm start"`

   - `"debug": "cross-env PORT=5555 DEBUG=npx-express-generator-ejs:* npm start"`

   [`npm i cross-env`](https://www.npmjs.com/package/cross-env) para que las variables de entorno se lean bien en todos los sistemas

3. [`npm i standard -D`](https://www.npmjs.com/package/standard) e incluyo la _propiedad_ `"eslintConfig": { "extends": "standard" }` en el _package.json_ para configurar **standard** como herramienta para:

   - **linting**: conjunto de reglas que ayudan al control de errores mientras escribimos codigo

   - **formateo**: reglas especificas de como se ha de colocar el codigo, indentado, puntos y comas...

   Configuro el _VSCode_ para que cada vez que guardo automaticamente se apliquen los cambios provinientes de los _warnings_ de **standard**

4. Migracion de CommonJS a ES

## Paquetes NPM
