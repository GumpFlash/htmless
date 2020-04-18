import fs       from 'fs';
import bundle   from './bundle';

export default async function(file,success,error){
    bundle(file,false,(path)=>{
        fs.writeFileSync('./index.html',`<html><body><script>${fs.readFileSync(path).toString()}</script></body></html>`);
        success('./index.html');
    },error);
}