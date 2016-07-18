"use strict";
const gutil = require('gulp-util');
const through = require('through2');
const nunjucks = require('nunjucks');
const path = require('path');
function default_1(template) {
    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }
        if (file.isStream() || !(file.contents instanceof Buffer)) {
            callback(new gutil.PluginError('gulp-guidestyle', 'Streaming not supported'));
            return;
        }
        var data = JSON.parse(file.contents.toString());
        var res = nunjucks.render(template, data);
        var basename = path.basename(file.path), stylename = basename.substr(0, basename.length - path.extname(basename).length);
        var resFile = file.clone({ contents: false });
        resFile.path = path.join(file.base, stylename + ".html");
        resFile.contents = new Buffer(data);
        callback(null, resFile);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=index.js.map