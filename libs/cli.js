import opn              from 'opn';
import chalk            from 'chalk';
import bundle           from './bundle';
import server           from './server';
import {version}        from '../package.json';
import websocket        from './websocket';
import exportFile       from './export';

export async function cli(args){
    const method = args[2] ? args[2] : "";
    const file   = args[3] ? args[3] : "index.js";

    switch(method.toLowerCase()){
        case 'export':
            infoMsg("Compiling into a HTML file...");
            exportFile(file,(path)=>{
                infoMsg("Your application has exported!","Your 'index.html' has been generated!");
                opn(path);
            },errorMsg);
        break;
        case 'run':
            var firstRun = true;
            var wss = null;
            bundle(file,true,(path)=>{
                infoMsg("Compiling...");
                if(firstRun){
                    server(path).then(()=>{
                        websocket().then((_wss)=>{
                            wss = _wss;
                            opn("http://localhost:3001");
                            infoMsg("Your application is working!","Running on http://localhost:3001");
                        }).catch(errorMsg);
                    }).catch(errorMsg);
                    firstRun = false;
                }else{
                    wss.reloadPages();
                    infoMsg("Your application is working!","Running on http://localhost:3001");
                }
            }, errorMsg);
        break;
        default:
            console.log(chalk.whiteBright(`\nHTMLess V${version} By GumpFlash`));
            console.log("\nUsage: htmless <run/export> <.js file>\n");
        break;
    }
}

function infoMsg(info,info2){
    console.clear();
    if(info2)
        console.log(chalk.blueBright(info));
    console.log(chalk.blue(info2 ? info2 : info));
}

function errorMsg(err){
    console.clear();
    console.log(chalk.redBright("Your application is not working :("));
    console.log(chalk.red(err));
}