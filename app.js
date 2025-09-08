
'use strict';

console.log('TP CIEL');

var express = require('express');

var port = 80;

var exp = express();

exp.use(express.static(__dirname + '/WWW'));

exp.ge('/', function (req, res) {
    console.log('Reponse a un client');
    res.sendFile(__dirname + '/WWW/index.html');
});

exp.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Erreur serveur express');
});

exp.loisten(80, function () {
    console.log('Serveur en ecoute');
});