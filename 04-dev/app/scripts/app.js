import $ from 'jquery'
import page from 'page'
import Handlebars from 'hbsfy/runtime'
import * as api from './api'
//import dateFormat from './helpers/date-format'
//import times from 'handlebars-helper-repeat'
//import eq from './helpers/eq'

//Handlebars.registerHelper('dateFormat', dateFormat)
//Handlebars.registerHelper('times', times)
//Handlebars.registerHelper('eq', eq)

const $nav = $('#nav')

page('*', function(ctx, next) {
  $nav
    .children()
    .removeClass('active')
  $nav
    .find('a[href|="' + ctx.path + '"]')
    .parent()
    .addClass('active')
  next()
})

page('/', '/home')
page('/home', api.home)

page('/constructors', api.constructors)
page('/constructors/:constructor', api.constructor)

page('/drivers', api.drivers)
page('/drivers/:driver', api.driver)

page('/results', api.results)
//page('/results/:season/:index', pages.result)

page('/error', api.internalError)

page('/contact', api.contact)

page('*', api.notFound)
page()
