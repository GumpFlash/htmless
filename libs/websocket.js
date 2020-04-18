import websocket from 'ws';

export default async () => {
    return new Promise((resolve,error)=>{
        const wss = new websocket.Server({ port: 3002 });

        wss.reloadPages = () => {
            wss.clients.forEach((client) => {
                client.send("reload");
            });
        };

        resolve(wss);
    });
}