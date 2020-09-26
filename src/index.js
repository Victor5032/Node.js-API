const http = require('http');
const { bodyParser } = require('./lib/bodyParser');

const database = [];

function getDefaultResponse(req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.write(JSON.stringify({
        message: 'Victor José López Rivera - LR180820'
    }));
    res.end();
}

function getTaskHandler(req, res,) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(database));
    res.end();
}

async function createTaskHandler(req, res) {
    try {
        await bodyParser(req);
        
        database.push(req.body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(database));
        res.end();
    } catch (error) {
        res.writeHead(400, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify({
            error: "Datos invalidos"
        }));
        res.end();
    }
}

async function updateTaskHandler(req, res) {
    try {
        let { url } = req;
    
        let idQuery = url.split("?")[1];
        let idKey = idQuery.split("=")[0];
        let idValue = idQuery.split("=")[1];
        
        if (idKey === "id") {
            await bodyParser(req);

            database[idValue - 1] = req.body;

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(database));
            res.end();
        } else {
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify({
                error: "Consulta invalida"
            }));
            res.end();
        }
    } catch (error) {
        res.writeHead(400, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify({
            error: "Datos invalidos proveidos"
        }));
        res.end();
    }
}

async function deleteTaskHandler(req, res) {
    let { url } = req;
    
    let idQuery = url.split("?")[1];
    let idKey = idQuery.split("=")[0];
    let idValue = idQuery.split("=")[1];

    if (idKey === "id") {
        database.splice(idValue - 1);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify({
            message: "Elemento eliminado"
        }));
        res.end();
    } else {
        res.writeHead(400, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify({
            error: "Consulta invalida"
        }));
        res.end();
    }
}

const server = http.createServer((req, res) => {
    const { url, method } = req;

    // Logger
    console.log(`URL: ${url} - Method: ${method}`);
    
    switch (method) {
        case 'GET':
            if (url === "/tasks") {
                getTaskHandler(req, res);
            } else {
                getDefaultResponse(req, res);
            }
            break;
        
        case 'POST':
            if (url === "/tasks/insert") {
                createTaskHandler(req, res);
            }
            break;

        case 'PUT':
            updateTaskHandler(req, res);
            break;
        
        case 'DELETE':
            deleteTaskHandler(req, res);
            break;
    
        default:
            getDefaultResponse(req, res);
            break; 
    }
});

server.listen(3000);
console.log(`Server on port `, 3000);
