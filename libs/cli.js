import {version}        from '../package.json';
import fs               from 'fs';
import tmp              from 'tmp';
import http             from 'http';
import browserify       from 'browserify';
import chokidar         from 'chokidar';
import websocket        from 'ws';
import opn              from 'opn';

export function cli(args){
    args[2] = args[2] ? args[2] : "";
    args[3] = args[3] ? args[3] : "index.js";
    switch(args[2].toLowerCase()){
        case 'export':
            exportIndex(args[3]);
        break;
        case 'run':
            bundle(args[3]);
        break;
        default:
            console.log(`\nHTMLess V${version} By GumpFlash`);
            console.log("\nUsage: htmless <run/export> <.js file>\n");
        break;
    }
}

function exportIndex(file){
    console.log("Building the HTML file...");
    var tmpObj = tmp.file({ prefix: 'htmless-', postfix: '.js', keep: true}, async function (err, path, fd, cleanupCallback) {
        if (err) throw err;

        var bundleFs = await fs.createWriteStream(path);

        var b = await browserify();
        await b.add(file);
        await b.bundle().pipe(bundleFs).on("finish",()=>{
            console.log("HTML file builded!")
            fs.writeFileSync('./index.html',`<html><body><script>${fs.readFileSync(path).toString()}</script></body></html>`);
        });
    });
}

function bundle(file){
    var tmpObj = tmp.file({ prefix: 'htmless-', postfix: '.js', keep: true}, async function (err, path, fd, cleanupCallback) {
        if (err) throw err;

        var bundleFs = fs.createWriteStream(path);

        var b = await browserify();
        await b.add(file);
        await b.bundle().pipe(bundleFs);

        const wss = new websocket.Server({ port: 3002 });

        wss.on('connection', function connection(ws) {
            chokidar.watch('.',{ignored: ["node_modules", ".git"]}).on('all', async (event, path2) => {
                if(!["addDir","add"].includes(event)){
                    console.clear();
                    console.log("Compiling...");
                    var bundleFs = await fs.createWriteStream(path);
                    var b = await browserify();
                    await b.add(file);
                    await b.bundle().pipe(bundleFs);
                    ws.send('reload');
                    console.log("Running on http://localhost:3001");
                }
            });
        });

        http.createServer(function (req, res) {
            if(req.url == "/bundle") res.write(fs.readFileSync(path));
            else if(req.url == "/websocket") res.write(`const ws = new WebSocket('ws://localhost:3002'); ws.onmessage = (msg)=>{if(msg.data == 'reload') window.location.reload();}`);
            else res.write(`<html><body><script src='/websocket'></script><script src='/bundle'></script></body></html>`);
            res.end();
        }).listen(3001).on("listening",()=>{
            console.log("Running on http://localhost:3001");
            opn("http://localhost:3001");
        });
    });
}