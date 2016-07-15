"use strict";
const gutil = require('gulp-util');
const through = require('through2');
const nunjucks = require('nunjucks');
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
        var resFile = file.clone({ contents: false });
        resFile.contents = new Buffer(data);
        resFile.extname = ".html";
        callback(null, resFile);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=index.js.map