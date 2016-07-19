"use strict";
const gutil = require('gulp-util');
const through = require('through2');
const nunjucks = require('nunjucks');
const path = require('path');
const PLUGIN_NAME = "gulp-nunjucks-template";
function default_1(template, options) {
    options = Object.assign({}, options);
    let nunjucksOptions = Object.assign({ noCache: true }, options.nunjucks);
    nunjucks.configure(nunjucksOptions);
    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }
        if (file.isStream() || !(file.contents instanceof Buffer)) {
            return this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }
        var data = JSON.parse(file.contents.toString());
        let result;
        try {
            result = nunjucks.render(template, data);
        }
        catch (err) {
            return callback(new gutil.PluginError(PLUGIN_NAME, err, { fileName: template }));
        }
        var basename = path.basename(file.path), stylename = basename.substr(0, basename.length - path.extname(basename).length);
        var resultFile = file.clone({ contents: false });
        resultFile.path = path.join(file.base, options.fileName || (stylename + ".html"));
        resultFile.contents = new Buffer(result);
        callback(null, resultFile);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=index.js.map