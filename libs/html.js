module.exports = () =>{
    const HTMLElements = require("./HTMLElements");
    var elems = {};

    const createElement = (type,inner) => {
        const elm = document.createElement(type);
        
        if(inner){
            if(typeof(inner) == "string") elm.innerText = inner;
            else elm.appendChild(inner);
        }

        elm.attr = (options) =>{
            if(options){
                const keys = Object.keys(options);
                keys.forEach(key=>{
                    elm.setAttribute(key,options[key]);
                })
            }
            return elm;
        }
        
        return elm;
    }

    elems['body'] = (inner) =>{
        const body = document.body;

        body.attr = (options) =>{
            if(options){
                const keys = Object.keys(options);
                keys.forEach(key=>{
                    body.setAttribute(key,options[key]);
                })
            }
            return body;
        }

        if(inner){
            if(typeof(inner) == "string") body.innerText = inner;
            else body.appendChild(inner);
        }

        return body;
    }

    HTMLElements.forEach(elem=>{
        elems[elem] = (inner) =>{ return createElement(elem,inner) }
    })

    return elems;
}