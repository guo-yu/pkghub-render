import path from 'path'
import should from 'should'
import swig from 'swig'
import compile from '../dist/compile'
import render from '../dist/render'

describe('compile', () => {
  it('#compile(): should NOT compile a unexist template', done => {
    compile('fakeURI-of-file').then(html => {
      done(new Error('WTF?'))
    }).catch(err => done())
  })
  it('#compile(): should compile a exist template', done => {
    compile(path.resolve(__dirname, '../node_modules/mails-flat/message.html'), {
      footer: {
        text: 'http://abc.com'
      }
    }).then(html => {
      done()
    }).catch(done)
  })
})

describe('renderer', () => {
  it('#compile(): should compile a exist template from a exist module', done => {
    render('mails-flat/message', {
      footer: {
        text: 'http://abc.com'
      }
    }).then(html => {
      done()
    }).catch(done)
  })

  it('#compile(): should NOT compile a unexist template from a exist module', done => {
    render('mails-flat/no-this-file', {
      title: 'Im a title'
    }).then(html => {
      done(new Error('WTF?'))
    }).catch(err => done())
  })
})
