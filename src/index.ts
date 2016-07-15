import * as gutil from 'gulp-util'
import * as through from 'through2'
import * as nunjucks from 'nunjucks'

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
    var resFile = file.clone({contents: false});
    resFile.contents = new Buffer(data);
    resFile.extname = ".html";
    callback(null, resFile);
  });
};