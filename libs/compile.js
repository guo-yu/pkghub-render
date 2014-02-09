var errors = require('./errors');

// 根据指定模板引擎编译 html 
module.exports = function(template, data, engine, callback) {
    var html;
    if (engine.name === 'jade') html = engine._engine.renderFile(template, data);
    if (engine.name === 'swig') html = engine._engine.compileFile(template)(data);
    if (!html) return callback(new Error(errors['406']));
    return callback(null, html, template, data, engine);
};