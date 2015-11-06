import $ from 'jquery'
import page from 'page'
import fetch from 'isomorphic-fetch'
import url from 'url'
import config from '../config'
import tplHome from '../templates/home.hbs'
import tplConstructors from '../templates/constructors.hbs'
import tplConstructor from '../templates/constructor.hbs'
import tplDrivers from '../templates/drivers.hbs'
import tplDriver from '../templates/driver.hbs'
import tplResults from '../templates/results.hbs'
import tplResult from '../templates/result.hbs'
import tplContact from '../templates/contact.hbs'
import tplNotFound from '../templates/not-found.hbs'
import tplError from '../templates/error.hbs'

const $content = $('#content')
const limit = 30
let globalError

export function home() {
  $content.html(tplHome())
}

export function constructors(ctx) {
  const u = url.parse(ctx.path, true)
  const currentPage = Math.max(1, u.query.page ? u.query.page : 1)

  fetch(config.api.url + `/constructors.json?limit=${limit}&offset=${limit * (currentPage - 1)}`)
    .then(response => {
      if (response.status >= 400) {
        return currentPage('error')
      }

      return response.json()
    })
    .then(data => {
      const totalPages = Math.ceil(data.MRData.total / data.MRData.limit)

      $content.html(
        tplConstructors({
          total: totalPages,
          current: currentPage,
          prev: currentPage > 1 ? currentPage - 1 : false,
          next: currentPage < totalPages ? currentPage + 1 : false,
          constructors: data.MRData.ConstructorTable.Constructors
        }))
    })
    .catch(err => {
      globalError = err
      page('/error')
    })
}

export function constructor(ctx) {
  fetch(config.api.url + `/constructors/${ctx.params.constructor}.json`)
    .then(response => {
      if (response.status >= 400) {
        return page('error')
      }

      return response.json()
    })
    .then(data => {
      $content.html(
        tplConstructor({
          constructor: data.MRData.ConstructorTable.Constructors[0]
        }))
    })
    .catch(err => {
      globalError = err
      page('/error')
    })
}

export function drivers(ctx) {
  const u = url.parse(ctx.path, true)
  const currentPage = Math.max(1, u.query.page ? u.query.page : 1)

  fetch(config.api.url + `/drivers.json?limit=${limit}&offset=${limit * (currentPage - 1)}`)
    .then(response => {
      if (response.status >= 400) {
        return currentPage('error')
      }

      return response.json()
    })
    .then(data => {
      const totalPages = Math.ceil(data.MRData.total / data.MRData.limit)
      $content.html(
        tplDrivers({
          from: currentPage > 3 ? currentPage - 3 : 1,
          to: currentPage < totalPages - 4 ? totalPages - 4 : totalPages,
          total: totalPages,
          current: currentPage,
          prev: currentPage > 1 ? currentPage - 1 : false,
          next: currentPage < totalPages ? currentPage + 1 : false,
          drivers: data.MRData.DriverTable.Drivers
        }))
    })
    .catch(err => {
      globalError = err
      page('/error')
    })
}

export function driver(ctx) {
  fetch(config.api.url + `/drivers/${ctx.params.driver}.json`)
    .then(response => {
      if (response.status >= 400) {
        return page('error')
      }

      return response.json()
    })
    .then(data => {
      $content.html(
        tplDriver({}))
    })
    .catch(err => {
      globalError = err
      page('/error')
    })
}

export function results() {
  fetch(config.api.url + '/current.json')
    .then(response => {
      if (response.status >= 400) {
        return page('error')
      }

      return response.json()
    })
    .then(data => {
      $content.html(
        tplResults({
          races: data.MRData.RaceTable.Races
        }))
    })
    .catch(err => {
      globalError = err
      page('/error')
    })
}

export function result(ctx) {
  fetch(config.api.url + `/${ctx.params.season}/${ctx.params.index}/results.json`)
    .then(response => {
      if (response.status >= 400) {
        return page('error')
      }

      return response.json()
    })
    .then(data => {
      $content.html(
        tplResult({
          results: data.MRData.RaceTable.Races[0].Results
        }))
    })
    .catch(err => {
      globalError = err
      page('/error')
    })
}

export function contact() {
  $content.html(tplContact())
}

export function notFound() {
  console.log('not Found')
  $content.html(tplNotFound())
}

export function internalError() {
  $content.html(tplError({error: globalError}))
  throw globalError
  globalError = undefined
}
