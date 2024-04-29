// Importa el framework Express
const express = require("express");
// Importa la librería jsonwebtoken para la gestión de tokens JWT
const jwt = require("jsonwebtoken");
// Importa el módulo de la base de datos de libros
let books = require("./booksdb.js");
// Crea un router de Express para las rutas de usuarios registrados
const regd_users = express.Router();

// Arreglo para almacenar usuarios registrados
let users = [];

// Función para verificar si un nombre de usuario es válido
const isValid = (username) => {
  // Filtra el arreglo de usuarios buscando coincidencias de nombre de usuario
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
  // Si se encuentran usuarios con el mismo nombre, devuelve true, de lo contrario, false
  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

// Función para autenticar a un usuario
const authenticatedUser = (username, password) => {
  // Filtra el arreglo de usuarios buscando coincidencias de nombre de usuario y contraseña
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Si se encuentran usuarios válidos, devuelve true, de lo contrario, false
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

// Solo los usuarios registrados pueden iniciar sesión
regd_users.post("/login", (req, res) => {
  // Obtiene el nombre de usuario y contraseña del cuerpo de la solicitud
  const username = req.body.username;
  const password = req.body.password;

  // Verifica si se proporcionaron tanto el nombre de usuario como la contraseña
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Si el usuario y la contraseña son válidos, se genera un token JWT
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Almacena el token JWT y el nombre de usuario en la sesión del usuario
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    // Si el usuario y la contraseña no son válidos, devuelve un error de inicio de sesión inválido
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Agregar una reseña de libro
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

   const username = req.session.authorization.username;
 
  // Verificar si el libro existe en la lista de libros
  if (books.hasOwnProperty(isbn)) {
    // Agregar la nueva reseña al libro
    books[isbn].reviews[username] = review;
    res.status(200).json({ message: "Review added successfully" });
  } else {
    // Si el libro no existe, devolver un mensaje de error
    res.status(404).json({ message: "Book not found" });
  }
});

// Eliminar la reseña de un libro
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  // Verificar si el libro existe en la lista de libros
  if (books.hasOwnProperty(isbn)) {
    const username = req.session.authorization.username;

    // Verificar si el usuario tiene una reseña para este libro
    if (books[isbn].reviews.hasOwnProperty(username)) {
      // Eliminar la reseña del usuario para este libro
      delete books[isbn].reviews[username];
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      // Si el usuario no tiene una reseña para este libro, devolver un mensaje de error
      res.status(404).json({ message: "User review not found for this book" });
    }
  } else {
    // Si el libro no existe, devolver un mensaje de error
    res.status(404).json({ message: "Book not found" });
  }
});


// Exporta el router de Express para las rutas de usuarios registrados
module.exports.authenticated = regd_users;
// Exporta la función isValid para validar nombres de usuario
module.exports.isValid = isValid;
// Exporta el arreglo de usuarios registrados
module.exports.users = users;
