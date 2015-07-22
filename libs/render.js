import pkghub = 'pkghub'
import Promise from 'bluebird'
import compile = './compile'

let hub = new pkghub

/**
*
* A wrapper function for rendering html string by given template and data,
* Support mutilple view engines.
*
* @param {String} [template] [template's short name]
* @example
*   exports.render('mails-flat/message', {...});
*
**/
export default function renderer(template, data) {
  return new Promise((resolve, reject) => {
    if (!template) 
      return reject(new Error('Template file not found'))

    hub.load(template)
      .then((theme, file) => {
        if (!theme) 
          return reject(new Error('Theme module not found'))
        if (!theme['view engine']) 
          return reject(new Error('Template engine is required'))
        if (!file) 
          return reject(new Error('Template file not found'))

        const engine = {
          name: theme['view engine']
        }

        // Select the first file when template file does not exist.
        var dest = file.exist ? file.dir : file.availables[0]

        // Inject `Theme` locals
        data.Theme = theme

        // Replace #{static} in template with real public path.
        data.static = isURI(theme.static) ? 
          theme.static : 
          '/' + theme.name;

        try {
          engine._engine = require(engine.name)
        } catch (err) {
          return reject(new Error('Template engine is required'))
        }

        try {
          var html = compile(dest, data, engine)
        } catch (err) {
          return reject(err)
        }

        // Errors come from view engine
        if (typeof(html) === 'object')
          return reject(html)

        return resolve(html)
      })
      .catch(reject)

    function isURI(dir) {
      return dir && (dir.indexOf('http') === 0 || dir.indexOf('https') === 0)
    }
  })
}
