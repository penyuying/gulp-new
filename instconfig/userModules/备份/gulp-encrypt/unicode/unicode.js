var thenCode = {  
        ToUnicode: function (str) {  
            return escape(str).toLocaleLowerCase().replace(/%u|%/gi, '\\u');  
        },
        ToGB2312: function (str) {  
            return unescape(str.replace(/\\u/gi, '%u'));  
        }  
    };

    

function toUnicode(str){
    str=str+"";
    if(!str){
        return str;
    }
    var res="",
        _str="",
        strArr=str.split("");
    for(var i=0,_length=strArr.length;i<_length;i++){
        _str=strArr[i];
        if(_str){
            if(_str==thenCode.ToUnicode(_str) || _str.toLowerCase()==thenCode.ToUnicode(_str).toLowerCase()){
                res=res + "\\u"+parseInt(_str.charCodeAt()).toString(16);
            }else{
                res=res + thenCode.ToUnicode(_str);
            }
        }
    }
    return res;
}

function toGB2312(str){
    var val=str,
        res=val.replace(/\s/g,""),
        resArr=[],
        _resArrItem="",
        _res="";
        
        
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
            res=res.replace(/\%u|\\u/gi,",\\u").replace(/^[,]/,"");
        }
        if(res){
            resArr=res.split(",");
        }
        
        for(var i=0,_length=resArr.length;i<_length;i++){
            _resArrItem=resArr[i];

            if(_resArrItem && _resArrItem.split("").length==4){
                var _ii=parseInt(_resArrItem.substring(2,_resArrItem.length),16);
                _res=_res + (String.fromCharCode(_ii)||"");
            }else{
                _res=_res + (_resArrItem && thenCode.ToGB2312(_resArrItem)||"");
            }
        }

        return _res;
        
    }

module.exports={
    toUnicode:toUnicode,
    toGB2312:toGB2312
}