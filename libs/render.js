var Hub = require('pkghub'),
    errors = require('./errors'),
    compile = require('./compile'),
    hub = new Hub;

var isEngine = function(engine) {
    return typeof(engine) === 'function';
}

// 根据给定的主题名称或者文件名称渲染邮件
// 不指定引擎渲染的话会自动寻找支持的模板引擎
// e.g: exports.render('mails-flat/message', {...}, callback);
module.exports = function(template, data, callback, e) {
    if (!template) return callback(new Error(errors['404']));
    // 加载本地的模块主题
    return hub.load(template, function(err, theme, file) {
        if (err) return callback(new Error(errors['403']));
        if (!theme) return callback(new Error(errors['403']));
        if (!theme['view engine']) return callback(new Error(errors['405']));
        if (!file) return callback(new Error(errors['404']));
        // 如果匹配不到模板文件，取最相似的第一个
        var engine = {};
        var dest = file.exist ? file.dir : file.availables[0];
        engine.name = theme['view engine'];
        data.Theme = theme;
        try {
            engine._engine = isEngine(e) ? e : require(theme['view engine']);
        } catch (err) {
            return callback(new Error(errors['405']));
        }
        try {
            return compile(dest, data, engine, callback);
        } catch (err) {
            return callback(new Error(errors['404']));
        }
    });
};