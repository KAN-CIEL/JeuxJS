
'use strict';

console.log('TP CIEL');

var express = require('express');

var question = '?';
var bonneReponse = 0;

var exp = express();

exp.use(express.static(__dirname + '/WWW'));

exp.get('/', function (req, res) {
    console.log('Reponse a un client');
    res.sendFile(__dirname + '/WWW/textchat.html');
});

exp.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Erreur serveur express');
});



/*  *************** serveur WebSocket express *********************   */
// 
var expressWs = require('express-ws')(exp);

// Connexion des clients à la WebSocket /qr et evenements associés 
// Questions/reponses 
exp.ws('/qr', function (ws, req) {
    console.log('Connection WebSocket %s sur le port %s',
        req.connection.remoteAddress, req.connection.remotePort);
    NouvelleQuestion();

    ws.on('message', TraiterReponse);

    ws.on('close', function (reasonCode, description) {
        console.log('Deconnexion WebSocket %s sur le port %s',
            req.connection.remoteAddress, req.connection.remotePort);
    });


    //function TraiterReponse(message) {
    //    console.log('De %s %s, message :%s', req.connection.remoteAddress,
    //        req.connection.remotePort, message);
    //    if (message == bonneReponse) {
    //        NouvelleQuestion();
    //    }
    //}

    function TraiterReponse(message) {
        console.log('De %s %s, message :%s', req.connection.remoteAddress,
            req.connection.remotePort, message);

        if (parseInt(message) === bonneReponse) {
            ws.send('Bonne reponse !');
        } else {
            ws.send('Mauvaise reponse !');
        }

        // Attendre 3 secondes avant d’envoyer une nouvelle question
        setTimeout(() => {
            NouvelleQuestion();
        }, 3000);
    }


    function NouvelleQuestion() {
        var x = GetRandomInt(256);
        //var y = GetRandomInt(11);
        question = x + ' en base 2';
        bonneReponse = x.toString(2);
        aWss.broadcast(question);
    }

    function GetRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

}); 

/*  ****************** Broadcast clients WebSocket  **************   */
var aWss = expressWs.getWss('/echo'); 
var WebSocket = require('ws');
aWss.broadcast = function broadcast(data) {
    console.log('Broadcast aux clients navigateur : %s', data);
    aWss.clients.forEach(function each(client) {
        if (client.readyState == WebSocket.OPEN) {
            client.send(data, function ack(error) {
                console.log('    -  %s-%s', client._socket.remoteAddress,
                    client._socket.remotePort);
                if (error) {
                    console.log('ERREUR websocket broadcast : %s', error.toString());
                }
            });
        }
    });
};



/*  ****** Serveur web et WebSocket en ecoute sur le port 80  ********   */
//  
var portServ = 80;
exp.listen(portServ, function () {
    console.log('Serveur en ecoute');
});