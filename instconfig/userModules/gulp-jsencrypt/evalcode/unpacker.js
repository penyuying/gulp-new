var P_A_C_K_E_R=require("./_unpacker/P_A_C_K_E_R"),
    Urlencoded=require("./_unpacker/Urlencoded"),
    MyObfuscate=require("./_unpacker/MyObfuscate");

function unpacker_filter(source) {
	var trailing_comments = '',
		comment = '',
		unpacked = '',
		found = false;

	do {
		found = false;
		if (/^\s*\/\*/.test(source)) {
			found = true;
			comment = source.substr(0, source.indexOf('*/') + 2);
			source = source.substr(comment.length).replace(/^\s+/, '');
			trailing_comments += comment + "\n";
		} else if (/^\s*\/\//.test(source)) {
			found = true;
			comment = source.match(/^\s*\/\/.*/)[0];
			source = source.substr(comment.length).replace(/^\s+/, '');
			trailing_comments += comment + "\n";
		}
	} while (found);

	var unpackers = [P_A_C_K_E_R, Urlencoded, MyObfuscate];
	for (var i = 0; i < unpackers.length; i++) {
		if (unpackers[i].detect(source)) {
			unpacked = unpackers[i].unpack(source);
			if (unpacked != source) {
				source = unpacker_filter(unpacked);
			}
		}
	}
	return trailing_comments + source;
}
module.exports=unpacker_filter;