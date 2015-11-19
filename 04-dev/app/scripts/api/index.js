import $ from 'jquery'
import page from 'page'
import fetch from 'isomorphic-fetch'
//import url from 'url'
import tplDrivers from '../templates/drivers.hbs'
import tplDriver from '../templates/driver.hbs'
import tplHome from '../templates/home.hbs'
import tplNotFound from '../templates/notfound.hbs'
import tplContact from '../templates/contact.hbs'
import tplError from '../templates/error.hbs'

const apiurl = 'http://ergast.com/api/f1' // http://ergast.com/mrd/
const $content = $('#content')
let globalError

export function home() {
  $content.html(tplHome())
}

export function notFound() {
	$content.html(tplNotFound())
}

export function contact() {
	$content.html(tplContact())
}

export function drivers() {
	fetch(`${apiurl}/drivers.json`)
	.then(response => {
		if(response.status >= 400) {
			return page('error')
		}
		return response.json()
	})
	.then(data => {
		const driversData =  data.MRData.DriverTable.Drivers

		$content.html(
			tplDrivers(
			{
				drivers: driversData
			}
			))
	})
	.catch(err => {
		globalError = err
      	page('/error')
	})
}

export function driver(ctx) {
	fetch(`${apiurl}/drivers/${ctx.params.driver}.json`)
	.then(response => {
		if(response.status >= 400) {
			return page('error')
		}
		return response.json()
	})
	.then(data => {
		const driverData = data.MRData.DriverTable.Drivers[0]
		$content.html(
			tplDriver({
				driver: driverData
			}))
	})
	.catch(err => {
		globalError = err
      	page('/error')
	})
}
