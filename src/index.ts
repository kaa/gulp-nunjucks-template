import * as gutil from 'gulp-util'
import * as through from 'through2'
import * as nunjucks from 'nunjucks'
import * as path from 'path'

const PLUGIN_NAME = "gulp-nunjucks-template";

export default function(template: string, options?: any) {
  options = Object.assign({}, options);
  let nunjucksOptions = Object.assign({noCache: true}, options.nunjucks);
  var env = nunjucks.configure(nunjucksOptions);
  env.addFilter("nunjucks", (t,data) => nunjucks.renderString(t, data));
  Object.keys(options.filters || {}).forEach(key => {
    env.addFilter(key, options.filters[key])
  });
  Object.keys(options.globals || {}).forEach(key => {
    env.addFilter(key, options.globals[key])
  });

  return through.obj(function(file:gutil.File, encoding: string, callback: (err?: Error, data?: gutil.File) => void): void {
		if (file.isNull()) {
			return callback(null, file);
		}

		if (file.isStream() || !(file.contents instanceof Buffer)) {
			return this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
		}

    var data = JSON.parse(file.contents.toString());

    let result: string;
    try {
      result = nunjucks.render(template, data);
    } catch(err) {
      return callback(new gutil.PluginError(PLUGIN_NAME, err, {fileName: template}));
    }
    var basename = path.basename(file.path),
        stylename = basename.substr(0, basename.length-path.extname(basename).length);
    var resultFile = file.clone({contents: false});
    resultFile.path = gutil.replaceExtension(file.path, ".json");
    resultFile.contents = new Buffer(result);
    callback(null, resultFile);
  });
};