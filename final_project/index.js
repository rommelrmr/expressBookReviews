// Importa el framework Express
const express = require("express");
// Importa la librería jsonwebtoken para la autenticación basada en tokens JWT
const jwt = require("jsonwebtoken");
// Importa el módulo de sesión de Express para el manejo de sesiones de usuario
const session = require("express-session");
// Importa las rutas para los clientes autenticados y las rutas generales
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

// Crea una instancia de la aplicación Express
const app = express();

// Configura Express para parsear JSON en las solicitudes entrantes
app.use(express.json());

// Configura el middleware de sesión de Express para las rutas bajo '/customer'
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware para autenticar las solicitudes a las rutas bajo '/customer/auth/*'
app.use("/customer/auth/*", function auth(req, res, next) {
  // Aquí se debe implementar el mecanismo de autenticación
  // Write the authentication mechanism here
  // Verifica si hay una sesión de autorización establecida
  if (req.session.authorization) {
    // Obtiene el token de acceso de la sesión
    token = req.session.authorization["accessToken"];
    // Verifica el token JWT utilizando la clave "access"
    jwt.verify(token, "access", (err, user) => {
      // Si no hay errores en la verificación, pasa al siguiente middleware
      if (!err) {
        req.user = user;
        next();
      } else {
        // Si hay un error en la verificación, devuelve un error de no autenticado
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    // Si no hay sesión de autorización, devuelve un error de no autenticado
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Puerto en el que el servidor Express escuchará las solicitudes
const PORT = 5000;

// Usa las rutas definidas para clientes autenticados bajo '/customer'
app.use("/customer", customer_routes);
// Usa las rutas generales definidas bajo la ruta raíz '/'
app.use("/", genl_routes);

// Inicia el servidor Express en el puerto especificado y muestra un mensaje en la consola cuando esté listo
app.listen(PORT, () => console.log("Server is running"));
