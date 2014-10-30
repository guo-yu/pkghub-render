var Hub = require('pkghub');
var errors = require('./errors');
var compile = require('./compile');
var hub = new Hub;

module.exports = renderer;

/**
*
* A wrapper function for rendering html string by given template and data,
* Support mutilple view engines.
*
* @param {[String]} [template] [template's short name]
* @example
*   exports.render('mails-flat/message', {...}, callback);
*
**/
function renderer(template, data, callback) {
  if (!template) 
    return callback(new Error(errors['404']));

  hub.load(template, loadTemplate);

  function loadTemplate(err, theme, file) {
    if (err) 
      return callback(err);
    if (!theme) 
      return callback(new Error(errors['403']));
    if (!theme['view engine']) 
      return callback(new Error(errors['405']));
    if (!file) 
      return callback(new Error(errors['404']));

    var engine = {};
    engine.name = theme['view engine'];

    // Select the first file when template file does not exist.
    var dest = file.exist ? file.dir : file.availables[0];

    // Inject `Theme` locals
    data.Theme = theme;

    // Replace #{static} in template with real public path.
    data.static = isUri(theme.static) ? 
      theme.static : 
      '/' + theme.name;

    try {
      engine._engine = require(engine.name);
    } catch (err) {
      return callback(new Error(errors['405']));
    }

    try {
      var html = compile(dest, data, engine);
    } catch (err) {
      return callback(errors[err.message] || err);
    }

    // Errors come from view engine
    if (typeof(html) === 'object')
      return callback(html);

    return callback(null, html);
  }
}

function isUri(dir) {
  return dir && (dir.indexOf('http') === 0 || dir.indexOf('https') === 0);
}
