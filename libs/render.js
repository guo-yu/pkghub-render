var Hub = require('pkghub');
var errors = require('./errors');
var compile = require('./compile');
var hub = new Hub;

module.exports = renderer;

// 根据给定的主题名称或者文件名称渲染邮件
// 不指定引擎渲染的话会自动寻找支持的模板引擎
// e.g: exports.render('mails-flat/message', {...}, callback);
function renderer(template, data, callback, e) {
  if (!template) 
    return callback(new Error(errors['404']));

  // 加载本地的模块主题
  hub.load(template, function(err, theme, file) {
    if (err) 
      return callback(err);
    if (!theme) 
      return callback(new Error(errors['403']));
    if (!theme['view engine']) 
      return callback(new Error(errors['405']));
    if (!file) 
      return callback(new Error(errors['404']));

    // 如果匹配不到模板文件，取最相似的第一个
    var engine = {};
    var dest = file.exist ? file.dir : file.availables[0];
    engine.name = theme['view engine'];
    // 主题相关信息
    data.Theme = theme;
    // 渲染页面时要进行 #{static} 变量的替换，这里就是替换成相应主题在 public 下的目录
    data.static = isUri(theme.static) ? theme.static : '/' + theme.name;

    try {
      engine._engine = isFunction(e) ? e : require(theme['view engine']);
    } catch (err) {
      return callback(new Error(errors['405']));
    }

    try {
      return compile(dest, data, engine, callback);
    } catch (err) {
      return callback(err);
    }
  });
}

function isFunction(fn) {
  return typeof(fn) === 'function';
}

function isUri(dir) {
  return dir && (dir.indexOf('http') === 0 || dir.indexOf('https') === 0);
}
