'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

/**
*
* Render html string by given tempate and data
* Built-in template engine: ['swig']
*
* @param {String(Path)} [template] [the template abs path]
* @param {Object} [data] [the template locals]
* @param {Object} [engine] [the view engine's object, contains `engine.name`, `engine._engine`]
*
**/
exports['default'] = compile;

var _fs = require('fs');

var _fs2 = _interopRequireWildcard(_fs);

function compile(template, data, engine) {
  var name = engine.name;
  var _engine = engine._engine;

  var html = undefined;

  if (name === 'jade') html = _engine.renderFile(template, data);
  if (name === 'swig') html = _engine.compileFile(template)(data);
  if (name === 'ejs') html = _engine.render(_fs2['default'].readFileSync(template), data);

  if (!html) throw new Error('Template engine is not supported yet');

  return html;
}

module.exports = exports['default'];
//# sourceMappingURL=compile.js.map