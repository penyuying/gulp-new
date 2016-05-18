'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var objectAssign = require('object-assign');
var file = require('vinyl-file');
var revHash = require('rev-hash');
var revPath = require('rev-path');
var sortKeys = require('sort-keys');
var modifyFilename = require('modify-filename');
var fs = require('fs');

function getJson(dir) {//取JSON文件对象
    /// <summary>
    /// 取JSON文件对象
    /// </summary>
    /// <param name="dir">JSON文件路径</param>
    /// <returns type="obj">返回对象</returns>
    var folder_exists = fs.existsSync(dir);
    var _pkg = {};
    if (folder_exists) {
        var data = fs.readFileSync(dir, 'utf-8');
        try {
            _pkg=JSON.parse(data);
        } catch (e) {
            console.log(dir+"格式转换错误：" + e.message);
            _pkg = {};
        }
    }
    return _pkg;
}

function relPath(base, filePath) {
	if (filePath.indexOf(base) !== 0) {
		return filePath.replace(/\\/g, '/');
	}

	var newPath = filePath.substr(base.length).replace(/\\/g, '/');

	if (newPath[0] === '/') {
		return newPath.substr(1);
	}

	return newPath;
}

function getManifestFile(opts, cb) {
	file.read(opts.path, opts, function (err, manifest) {
		if (err) {
			// not found
			if (err.code === 'ENOENT') {
				cb(null, new gutil.File(opts));
			} else {
				cb(err);
			}

			return;
		}

		cb(null, manifest);
	});
}

function transformFilename(file,type) {
	// save the old path for later
	file.revOrigPath = file.path;
	file.revOrigBase = file.base;
	file.revHash = revHash(file.contents);
    file.nameType=type;
	file.path = modifyFilename(file.path, function (filename, extension) {
		var extIndex = filename.indexOf('.');

		filename = extIndex === -1 ?
			revPath(filename, file.revHash,type) :
			revPath(filename.slice(0, extIndex), file.revHash,type) + filename.slice(extIndex);

		return filename + extension;
	});
}

var plugin = function (obj) {
	var sourcemaps = [];
	var pathMap = {};
    obj=obj||{};
    obj.type=obj.type||"name";
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-rev', 'Streaming not supported'));
			return;
		}

		// this is a sourcemap, hold until the end
		if (path.extname(file.path) === '.map') {
			sourcemaps.push(file);
			cb();
			return;
		}

		var oldPath = file.path;
		transformFilename(file,obj.type);
		pathMap[oldPath] = file.revHash;

		cb(null, file);
	}, function (cb) {
		sourcemaps.forEach(function (file) {
			var reverseFilename;

			// attempt to parse the sourcemap's JSON to get the reverse filename
			try {
				reverseFilename = JSON.parse(file.contents.toString()).file;
			} catch (err) {}

			if (!reverseFilename) {
				reverseFilename = path.relative(path.dirname(file.path), path.basename(file.path, '.map'));
			}

			if (pathMap[reverseFilename]) {
				// save the old path for later
				file.revOrigPath = file.path;
				file.revOrigBase = file.base;

				var hash = pathMap[reverseFilename];
				file.path = revPath(file.path.replace(/\.map$/, ''), hash,obj.type) + '.map';
			} else {
				transformFilename(file);
			}

			this.push(file);
		}, this);

		cb();
	});
};

plugin.manifest = function (pth, opts) {
	if (typeof pth === 'string') {
		pth = {path: pth};
	}

	opts = objectAssign({
		path: 'rev-manifest.json',
		merge: false,
		dest:""
	}, opts, pth);
	var manifest = {};

	return through.obj(function (file, enc, cb) {
		// ignore all non-rev'd files
		if (!file.path || !file.revOrigPath) {
			cb();
			return;
		}

		var revisionedFile = relPath(file.base, file.path);
		var originalFile = path.join(path.dirname(revisionedFile), path.basename(file.revOrigPath)).replace(/\\/g, '/');
        
//		manifest[originalFile] = revisionedFile;
        if(file.nameType=="part"){
            manifest[originalFile] = originalFile + '?v=' + file.revHash;
        }else{
            manifest[originalFile] = revisionedFile;
        }
		

		cb();
	}, function (cb) {
		// no need to write a manifest file if there's nothing to manifest
		if (Object.keys(manifest).length === 0) {
			cb();
			return;
		}

		getManifestFile(opts, function (err, manifestFile) {
			if (err) {
				cb(err);
				return;
			}
			
			if (opts.merge && !manifestFile.isNull()) {
				var oldManifest = {};

				try {
					oldManifest = JSON.parse(manifestFile.contents.toString());
				} catch (err) {}

				manifest = objectAssign(oldManifest, manifest);
			}else if(opts.merge){
				var dest=path.normalize(opts.dest+opts.path).replace(/\\/g,"/");
					manifest = objectAssign(getJson(dest), manifest);
			}

			manifestFile.contents = new Buffer(JSON.stringify(sortKeys(manifest), null, '  '));
			this.push(manifestFile);
			cb();
		}.bind(this));
	});
};

module.exports = plugin;
