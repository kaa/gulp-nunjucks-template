import * as gutil from 'gulp-util'
import * as through from 'through2'
import * as nunjucks from 'nunjucks'
import * as path from 'path'

export default function(template: string) {
  return through.obj(function(file:gutil.File, encoding: string, callback: (err?: Error, data?: gutil.File) => void): void {
		if (file.isNull()) {
			callback(null, file);
			return;
		}

		if (file.isStream() || !(file.contents instanceof Buffer)) {
			callback(new gutil.PluginError('gulp-guidestyle', 'Streaming not supported'));
			return;
		}

    var data = JSON.parse(file.contents.toString());

    var res = nunjucks.render(template, data);
    var basename = path.basename(file.path),
        stylename = basename.substr(0, basename.length-path.extname(basename).length);
    var resFile = file.clone({contents: false});
    resFile.path = path.join(file.base, stylename+".html");
    resFile.contents = new Buffer(data);
    callback(null, resFile);
  });
};