var thenCode = {  
        ToUnicode: function (str,preFix) { 
            if(typeof preFix =="undefined"){
                preFix="\\u";
            }                
            return escape(str).toLocaleLowerCase().replace(/%u|%/gi, preFix);  
        },
        ToGB2312: function (str) {
            //if(typeof preFix =="undefined"){
            //    preFix="\\u";
            //}
            //    preFix="\\u";
            //var _reg=new RegExp(preFix,"gi");
            return unescape(str.replace(/\\u/gi, '%u'));             
        }  
    };

    

function toUnicode(str,preFix){
    str=str+"";
    if(typeof preFix =="undefined"){
        preFix="\\u";
    }

    if(!str){
        return str;
    }
    var res="",
        _str="",
        strArr=str.split("");
    for(var i=0,_length=strArr.length;i<_length;i++){
        _str=strArr[i];
        if(_str){
            if(_str==thenCode.ToUnicode(_str,preFix) || _str.toLowerCase()==thenCode.ToUnicode(_str,preFix).toLowerCase()){
                res=res + preFix +parseInt(_str.charCodeAt()).toString(16);
            }else{
                res=res + thenCode.ToUnicode(_str,preFix);
            }
        }
    }
    return res;
}

/**
 * unicode码转成GB2312
 * @param   {String} str 转码的unicode文本
 * @param   {number} [maxLength=4] 最长位数
 * @param   {Function} callBack 回调函数
 * @returns {String} 返回转码好的字符
 */
function toGB2312(str,maxLength,callBack){
    var val=str,
        res=val.replace(/\s/g,""),
        resArr=[],
        _resArrItem="",
        _res="";
    maxLength=maxLength||4;

    if(res && res.split("").length>1){
        if(!/^\$/.test(res)){
            if(/^u/.test(res)){
                res="\\"+res;
            }

            if(!/^\\u/.test(res) && !/^\%/.test(res)){
                if(/^\\/.test(res)){
                    res="\\u"+res.substring(1,res.length);
                }else{
                    res="\\u"+res;
                }
            }
            if(/^\%/.test(res)){
                if(!/^\%u/.test(res)){
                    res="\%u"+res.substring(1,res.length);
                }
            }
        }
    }

    if(res){
        res=res.replace(/\%u([^\\\%]*)|\\u([^\\\%]*)|\\(?!u)([^\\]*)/gi,function(p,p1,p2,p3){
            var _res="",
                _param=p1||p2||p3||"";

            if(p=="\\"){
                return p;
            }
            if(_param){
                var _paramArr=_param.split(""),
                    _reg=RegExp("([^\\\%]{"+maxLength+"})","gi");
                if(_paramArr.length>maxLength){
                    _param=_param.replace(_reg,function($,$1){
                        return $1+",\\u";
                    });
                }
                
            }
            _res=",\\u"+(_param||"");
            return _res;
        }).replace(/^[,]/,"");
    }

    if(res){
        resArr=res.split(",");
        if(resArr && resArr.length>0 && resArr[resArr.length-1]==="\\u"){
            resArr.splice(resArr.length-1,1);
        }
    }
    if(callBack instanceof Function && callBack && resArr){
        callBack(resArr.join("")||"");
    }
    for(var i=0,_length=resArr.length;i<_length;i++){
        _resArrItem=resArr[i];
        //if(_resArrItem!=="\\u"){
            if(_resArrItem && _resArrItem.split("").length==4){
                var _ii=parseInt(_resArrItem.substring(2,_resArrItem.length),16);
                _res=_res + (String.fromCharCode(_ii)||"");
            }else{
                _res=_res + (_resArrItem && thenCode.ToGB2312(_resArrItem)||"");
            }
        //}
    }

    return _res;
}

module.exports={
    toUnicode:toUnicode,
    toGB2312:toGB2312
}