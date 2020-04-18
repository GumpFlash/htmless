import fs   from 'fs';
import http from 'http';

export default async function(path){
    return new Promise((resolve,error)=>{
        http.createServer(function (req, res) {
            if(req.url == "/bundle") res.write(fs.readFileSync(path));
            else if(req.url == "/websocket") res.write(`const ws = new WebSocket('ws://localhost:3002'); ws.onmessage = (msg)=>{if(msg.data == 'reload') window.location.reload();}`);
            else res.write(`<html><body><script src='/websocket'></script><script src='/bundle'></script></body></html>`);
            res.end();
        }).listen(3001)
        .on("listening",resolve)
        .on("error",error);
    })
}