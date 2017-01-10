var Packer=require("./Packer"),
    beautify=require("./beautify/_beautify"),
    unpacker=require("./unpacker");
// var a=62; 
// function encode(code) { 
//     if(!code){
//         return code;
//     }
//     code = code.replace(/[\r\n]+/g, ''); 
//     code = code.replace(/'/g, "\\'");
//     var tmp = code.match(/\b(\w+)\b/g),
//         dict = [],
//         i,
//         t = '',
//         res=""; 

//      tmp.sort(); 

//     for(var i=0; i<tmp.length; i++) { 
//         if(tmp[i] != t){
//             dict.push(t = tmp[i]);
//         }
//     } 
//     var len = dict.length,
//         ch; 

//     for(i=0; i<len; i++) { 
//         ch = num(i); 
//         code = code.replace(new RegExp('\\b'+dict[i]+'\\b','g'), ch); 
//         if(ch == dict[i]){
//             dict[i] = '';
//         } 
//     }

//     res = "eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}(" + "'"+code+"',"+a+","+len+",'"+ dict.join('|')+"'.split('|'),0,{}))"; 
//     return res;
// } 
// function num(c) { 
//     return(c<a?'':num(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36)); 
// }

// function decode(code) {//旧
//     if(!code){
//         return code;
//     }
//     code = code.replace(/^eval/, ''); 
//     return eval(code);
// }

function encode(code) { 
    if(!code){
        return code;
    }
    var packer=new Packer;
    return packer.pack(code, 1, 0);
}


function decode(code) {
    if(!code){
        return code;
    }
    return beautify(unpacker(code));
}

module.exports={
    decode:decode,
    encode:encode
//    beautify:beautify
}