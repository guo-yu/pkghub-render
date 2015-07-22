import fs from 'fs'

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
export default function compile(template, data, engine) {
  const name = engine.name
  const _engine = engine._engine

  let html

  if (name === 'jade') 
    html = _engine.renderFile(template, data)
  if (name === 'swig') 
    html = _engine.compileFile(template)(data)
  if (name === 'ejs') 
    html = _engine.render(fs.readFileSync(template), data)

  if (!html) 
    throw new Error('Template engine is not supported yet')

  return html
}
