/**
 * Created by RAML on 14/01/2016.
 */
/******************************************************************************
 * NOMBRE
 *   restEaspayb.js
 *
 * DESCRIPCION
 *
 *   Contiene el server de la aplicacion EASPAYB
 *   Contiene los servicios rest que comunican datos a EASPAYB por medio de un
 *   servicio, así que se crea un server apuntando al puerto 8001
 *
 *****************************************************************************/
var util = require('util'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    oracledb = require('oracledb'),
    events = require('events'),
    localStorage = require('localStorage'),
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    async = require('async'),
    dbConfig = require('./dbconfig.js'),
    staticServlet = require('./utilsServer');

var PORT_PRINCIPAL = 8000;
var auth = require('basic-auth');
var staticServletIntance = new staticServlet();

var connectionOracle = null;
conectarOracle();
function conectarOracle() {
    oracledb.getConnection(
        {
            user: dbConfig.user,
            password: dbConfig.password,
            connectString: dbConfig.connectString
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            connectionOracle = connection;
        });
}
var restEaspayb = function () {
    var rest = this;
    rest.crearServidorPrincipal = function (argv) {
        new HttpServerEaspayb({
            'GET': createServletEaspayb(),
            'HEAD': createServletEaspayb()
        }).start(PORT_PRINCIPAL);
    },
        rest.crearServidor = function () {
            var app = express();
            app.use(express.static(path.join(__dirname, '/app')));
            app.use(bodyParser.json());
            var allowCrossDomain = function (req, res, next) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-auth-token');
                res.header('Access-Control-Allow-Credentials', true);
                next();
            };
            app.use(allowCrossDomain);
            app.post('/obtenerInformacion', function (req, res, next) {
                req.body.nodo = localStorage.getItem('informacionNodoEaspayb');
                req.body.dominio = localStorage.getItem('dominio');
                res.end(JSON.stringify(req.body));
                next();
            });
            app.post('/borrarInformacion', function (req, res, next) {
                localStorage.setItem("informacionNodoEaspayb", JSON.stringify('{}'));
                req.body.dominio = localStorage.getItem('dominio');
                res.end(JSON.stringify(req.body));
                next();
            });
            var server = http.createServer(app);
            server.listen(8001);
            return server;
        };
};


function obtenerInformacionNodo(dominioOrigen, res, req, callback) {
    connectionOracle.execute(
        "BEGIN PQ_WS_ACCESO.validarAccesoIndex(:pcDominio, :pcLicenciamiento, :pcLogo, :pnIdNodo, :pnNumAccesos, :pnNumAccesosEjecucion); END;",
        {  // bind variables
            pcDominio: dominioOrigen,
            pcLicenciamiento: {dir: oracledb.BIND_OUT, type: oracledb.STRING},
            pcLogo: {dir: oracledb.BIND_OUT, type: oracledb.STRING},
            pnIdNodo: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
            pnNumAccesos: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
            pnNumAccesosEjecucion: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
        },
        function (err, result) {
            if (err) {
                var error = "" + err;
                var inicio = error.indexOf("ORA");
                var fin = error.indexOf("ORA", inicio + 1);
                var tError = "";
                if (inicio > 0) {
                    if (fin > 0) {
                        tError = error.substring(inicio + 1, fin);
                    } else {
                        tError = error;
                    }
                    var inicioD = tError.indexOf(" ");
                    tError = tError.substring(inicioD + 1);
                } else {
                    tError = "" + error;
                }
                res.writeHead(403, {
                    'Content-Type': 'text/html'
                });
                if (req.method === 'HEAD') {
                    res.end();
                    return;
                }
                res.write('<!doctype html>\n');
                res.write('<style>\n');
                res.write('  ol { list-style-type: none; font-size: 1.2em; } h1 {background-color: #5674AE; padding: 5px 10px 5px 10px; color: white; margin: 2px; font-family: Roboto-Bold !important; font-size: 10.5pt; border-bottom: 4px solid #CD1B3A;}\n');
                res.write('</style>\n');
                res.write('<title>' + 'Error: Licenciamiento invalido' + '</title>\n');
                res.write('<h1>' + 'Acceso denegado' + '</h1>');
                res.write('<ol>');
                res.write('<h4>' + tError + '</h4>');
                res.write('</ol>');
                res.end();
                return;
            }
           if (result.outBinds.pcLicenciamiento != null) {
                localStorage.setItem("validaInformacion", true);
            }
            else {
                localStorage.setItem("validaInformacion", false);
            }
            localStorage.setItem("informacionNodoEaspayb", JSON.stringify(result.outBinds));

            callback(null, 1);
            return true;
        });
};
/******************************************************************************
 * NOMBRE
 *   HttpServerEaspayb
 *
 * DESCRIPCION
 *   Despachador HTTP con todos los metodos respectivos de Easpayb
 *
 *****************************************************************************/
//CONSTRUCTORES
function HttpServerEaspayb(handlers) {
    this.handlers = handlers;
    this.server = http.createServer(this.handleRequest_.bind(this));
}
HttpServerEaspayb.prototype.start = function (port) {
    this.port = port;
    this.server.listen(port);
    util.puts('Http Server running at http://localhost:' + port + '/');
    conectarOracle();
};

HttpServerEaspayb.prototype.parseUrl_ = function (urlString) {
    var parsed = url.parse(urlString);
    parsed.pathname = url.resolve('/', parsed.pathname);
    return url.parse(url.format(parsed), true);
};
function createServletEaspayb() {
    var servlet = staticServletIntance.obtenerServlet();
    return servlet.handleRequest.bind(servlet);
}
HttpServerEaspayb.prototype.start = function (port) {
    this.port = port;
    this.server.listen(port);
    util.puts('Http Server running at EASPAYB http://localhost:' + port + '/');
};
HttpServerEaspayb.prototype.handleRequest_ = function (req, res) {
   var dominioOrigen = null;
    if (req.headers.referer != undefined && req.headers.referer != null) {
        dominioOrigen = req.headers.referer.split('/')[2];
    }
    var aaa = this;
    if (dominioOrigen != null && dominioOrigen != req.headers.host) { //validación del origen
        localStorage.setItem("datosCargados", dominioOrigen);
        localStorage.setItem("dominio", dominioOrigen);
        async.series({
                informacion: function (callback) {
                    localStorage.setItem("validaInformacion", false);
                    obtenerInformacionNodo(dominioOrigen, res, req, callback);
                },
                redireccionar: function (callback) {
                    //obtenemos de sesion
                    var validar = localStorage.getItem("validaInformacion");
                    if (validar == 'true') {
                        staticServletIntance.afuera(req, aaa, res);
                        callback(null, 2);
                    }
                    else {
                        localStorage.setItem("informacionNodoEaspayb", JSON.stringify('{}'));
                        var credentials = auth(req);
                        if (!credentials || credentials.name !== 'eAspayb' || credentials.pass !== 'eAspayb-config') {
                            res.statusCode = 401;
                            res.setHeader('WWW-Authenticate', 'Basic realm="Autenticacion a eAspayb"');
                            res.end('Access denied');
                        }
                        else {
                            var logEntry = req.method + ' ' + req.url;
                            if (req.headers['user-agent']) {
                                logEntry += ' ' + req.headers['user-agent'];
                            }
                            util.puts(logEntry);
                            staticServletIntance.afuera(req, aaa, res);
                        }
                    }
                }
            },
            function (err, results) {
            });
    } else {

        if(req.headers.referer == undefined){
            var credentials = auth(req);
            if (!credentials || credentials.name !== 'eAspayb' || credentials.pass !== 'eAspayb-config') {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic realm="Autenticacion a eAspayb"');
                res.end('Access denied');
            }
            else {
                var logEntry = req.method + ' ' + req.url;
                if (req.headers['user-agent']) {
                    logEntry += ' ' + req.headers['user-agent'];
                }
                util.puts(logEntry);
                staticServletIntance.afuera(req, aaa, res);
            }
        }
        else{
            var logEntry = req.method + ' ' + req.url;
            if (req.headers['user-agent']) {
                logEntry += ' ' + req.headers['user-agent'];
            }
            util.puts(logEntry);
            staticServletIntance.afuera(req, aaa, res);
        }

    }
};
module.exports = restEaspayb;
