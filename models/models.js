var path = require('path');

// Postgres DATABASE_URL = postgre://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
	{ 	dialect: protocol, 
		protocol: protocol,
		port: host,
		host:host,
		storage: storage,	// S�lo SQLite (.env)
		omitNull: true		// S�lo Postgres
	}
);

// Importar la definici�n de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; // exportar definixi�n de la tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	//t hen(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count === 0) { // la tabla se inicialza s�lo si est� vac�a
			Quiz.create({ 	pregunta: 'Capital de Italia',
							respuesta: 'Roma'
							})
			.then(function(){console.log('Base de datos iniciailizada')});
		};
	});
});
