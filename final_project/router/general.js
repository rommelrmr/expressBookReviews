// Importa el framework Express
const express = require("express");
// Importa el objeto que contiene la información sobre los libros
let books = require("./booksdb.js");
// Importa la función isValid y el arreglo de usuarios desde el archivo de usuarios autenticados
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
// Crea un router de Express para las rutas públicas
const public_users = express.Router();

// Ruta para registrar un nuevo usuario
public_users.post("/register", (req, res) => {
  // Obtiene el nombre de usuario y contraseña del cuerpo de la solicitud
  const username = req.body.username;
  const password = req.body.password;

  // Verifica si tanto el nombre de usuario como la contraseña están presentes
  if (username && password) {
    // Verifica si el nombre de usuario ya está registrado
    if (!isValid(username)) {
      // Si el nombre de usuario no está registrado, se agrega a la lista de usuarios
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      // Si el nombre de usuario ya está registrado, devuelve un error
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Si el nombre de usuario o la contraseña están ausentes, devuelve un error
  return res.status(404).json({ message: "Unable to register user." });
});

// Ruta para obtener la lista de libros disponibles en la tienda
public_users.get("/", function (req, res) {
  // Simular una demora de 5 segundos utilizando una Promesa
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Resuelve la Promesa después de 5 segundos
        resolve(JSON.stringify(books, null, 4));
      } catch (error) {
        // Si hay un error, rechazar la Promesa con el error
        reject(error);
      }
    }, 2000); // 5000 milisegundos = 5 segundos
  })
    .then((booksJSON) => {
      // Una vez que la Promesa se resuelve, enviar la lista de libros disponibles
      res.send(booksJSON);
    })
    .catch((error) => {
      // Si la Promesa es rechazada, manejar el error y enviar un mensaje de error al cliente
      res.status(500).json({ message: "Internal server error" });
    });
});

// Ruta para obtener los detalles de un libro basado en su ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Obtener el ISBN del parámetro de la URL
  // Obtener el ISBN del parámetro de la URL
  const isbn = req.params.isbn;

  // Simular una demora de 5 segundos utilizando una Promesa
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Verificar si el libro existe en la base de datos
        if (books.hasOwnProperty(isbn)) {
          // Si el libro existe, resolver la Promesa con los detalles del libro
          resolve(books[isbn]);
        } else {
          // Si el libro no existe, rechazar la Promesa con un mensaje de error
          reject(new Error("Book not found"));
        }
      } catch (error) {
        // Si hay un error, rechazar la Promesa con el error
        reject(error);
      }
    }, 2000); // 5000 milisegundos = 5 segundos
  })
    .then((bookDetails) => {
      // Una vez que la Promesa se resuelve, enviar los detalles del libro
      res.send(bookDetails);
    })
    .catch((error) => {
      // Si la Promesa es rechazada, manejar el error y enviar un mensaje de error al cliente
      res.status(500).json({ message: "Internal server error" });
    });
});

// Ruta para obtener los detalles de los libros basados en el autor
public_users.get("/author/:author", function (req, res) {
  // Simular una demora de 5 segundos utilizando una Promesa
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Obtener los detalles de los libros basados en el autor
        let result = Object.values(books).filter((book) =>
          book.author.toLowerCase().includes(req.params.author.toLowerCase())
        );
        // Resuelve la Promesa después de 5 segundos
        resolve(result);
      } catch (error) {
        // Si hay un error, rechaza la Promesa
        reject(error);
      }
    }, 2000); // 5000 milisegundos = 5 segundos
  })
    .then((result) => {
      // Una vez que la Promesa se resuelve, enviar los detalles de los libros
      res.send(result);
    })
    .catch((error) => {
      // Si la Promesa es rechazada, maneja el error
      res.status(500).json({ message: "Internal server error" });
    });
});

// Ruta para obtener todos los libros basados en el título
public_users.get("/title/:title", function (req, res) {
  // Simular una demora de 5 segundos utilizando una Promesa
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Obtener todos los libros basados en el título
        let result = Object.values(books).filter((book) =>
          book.title.toLowerCase().includes(req.params.title.toLowerCase())
        );
        // Resuelve la Promesa después de 5 segundos
        resolve(result);
      } catch (error) {
        // Si hay un error, rechaza la Promesa
        reject(error);
      }
    }, 2000); // 5000 milisegundos = 5 segundos
  })
    .then((result) => {
      // Una vez que la Promesa se resuelve, enviar los detalles de los libros
      res.send(result);
    })
    .catch((error) => {
      // Si la Promesa es rechazada, maneja el error
      res.status(500).json({ message: "Internal server error" });
    });
});

// Ruta para obtener la reseña de un libro
public_users.get("/review/:isbn", function (req, res) {
  // Escribir el código para obtener la reseña de un libro
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Maneja una solicitud PUT a la ruta '/:email'
public_users.put("/:isbn", function (req, res) {
  // Obtiene el correo electrónico del amigo de los parámetros de la solicitud
  const isbn = req.params.isbn;
  // Obtiene el amigo correspondiente al correo electrónico proporcionado
  let book = books[isbn];

  // Verifica si el amigo existe en la lista de amigos
  if (book) {
    // Si existe, obtiene el valor del campo DOB del cuerpo de la solicitud
    let author = req.body.author;
    let title = req.body.title;
    // Verifica si el campo DOB está presente en el cuerpo de la solicitud
    if (author) {
      // Si el campo DOB está presente, actualiza el valor del campo DOB del amigo
      book["author"] = author;
    }

    if (title) {
      book["title"] = title;
    }

    //guarda el objeto al array
    books[isbn] = book;

    // Devuelve un mensaje indicando que el amigo ha sido actualizado correctamente
    res.send(`Book with the isbn ${isbn} updated.`);
  } else {
    // Si no se encuentra el amigo, devuelve un mensaje indicando que no se pudo encontrar al amigo
    res.send("Unable to find Book!");
  }
});

public_users.delete("/:isbn", (req, res) => {
  // Obtiene el correo electrónico del amigo de los parámetros de la solicitud
  const isbn = req.params.isbn;
  // Verifica si se proporciona un correo electrónico
  if (isbn) {
    // Si se proporciona, elimina al amigo correspondiente del objeto friends
    delete books[isbn];
  }
  // Envía una respuesta al cliente indicando que el amigo ha sido eliminado
  res.send(`Book with the isbn ${isbn} deleted.`);
});

// Exporta el router de Express para las rutas públicas
module.exports.general = public_users;
