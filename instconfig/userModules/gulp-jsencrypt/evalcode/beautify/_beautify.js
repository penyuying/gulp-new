var html_beautify=require("./beautify-html");
var js_beautify=require("./beautify");
var css_beautify=require("./beautify-css");
var the = {
//        use_codemirror: (!window.location.href.match(/without-codemirror/)),
        beautify_in_progress: false,
        editor: null // codemirror editor
    };


function beautify(code,_type) {
//    if (the.beautify_in_progress) return;
    _type=_type+"";
    the.beautify_in_progress = true;

    var source = code,
        output,
        opts = {};

    opts.indent_size = 4;//缩进空格数量
    opts.indent_char = opts.indent_size == 1 ? '\t' : ' ';
    opts.max_preserve_newlines = 5;//最大保留换行符(5行)
    opts.preserve_newlines = opts.max_preserve_newlines !== "-1";
    opts.keep_array_indentation = false;//是否保持缩进
    opts.break_chained_methods =false;//
    opts.indent_scripts ="normal";
    opts.brace_style = 'collapse';
    opts.space_before_conditional = true;//Space before conditional: "if(x)" / "if (x)"
    opts.unescape_strings =false;
    opts.jslint_happy = false;
    opts.end_with_newline = false;
    opts.wrap_line_length = false;
    opts.indent_inner_html = false;
    opts.comma_first = false;
    opts.e4x = false;
    opts.space_after_anon_function = true;
    
    if(_type && _type.toLowerCase()=="css"){
        output = css_beautify(source, opts);
    }else{
        if (looks_like_html(source)) {
            output = html_beautify(source, opts);
        } else {
            output = js_beautify(source, opts);
        }
    }

    the.beautify_in_progress = false;
    return output;
//    if(callback && callback instanceof Function){
//        callback(output);
//    }
}

function looks_like_html(source) {
    // <foo> - looks like html
    var trimmed = source.replace(/^[ \t\n\r]+/, '');
    return trimmed && (trimmed.substring(0, 1) === '<');
}

module.exports=beautify;