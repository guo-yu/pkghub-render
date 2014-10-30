var fs = require('fs');

module.exports = compile;

/**
*
* Render html string by given tempate and data
* Built-in template engine: ['swig', 'jade']
*
* @param {[String(Path)]} [template] [the template abs path]
* @param {[Object]} [data] [the template locals]
* @param {[Object]} [engine] [the view engine's object, contains `engine.name`, `engine._engine`]
*
**/
function compile(template, data, engine) {
  var html;
  var name = engine.name;
  var _engine = engine._engine;

  if (name === 'jade') 
    html = _engine.renderFile(template, data);

  if (name === 'swig') 
    html = _engine.compileFile(template)(data);

  if (name === 'ejs') 
    html = _engine.render(fs.readFileSync(template), data);

  if (!html) 
    throw new Error(406);

  return html;
}
