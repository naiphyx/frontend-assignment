import $ from 'jquery'
import page from 'page'
import fetch from 'isomorphic-fetch'
//import url from 'url'
import tplDrivers from '../templates/drivers.hbs'
import tplHome from '../templates/home.hbs'
import tplNotFound from '../templates/notfound.hbs'
import tplContact from '../templates/contact.hbs'

const apiurl = 'http://ergast.com/api/f1' // http://ergast.com/mrd/
const $content = $('#content')

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
	fetch(apiurl + '/drivers.json?limit=10')
	.then(response => {
		if(response.status >= 400) {
			console.log("error01")
		}
		return response.json()
	})
	.then(data => {
		$content.html(
			tplDrivers({
				drivers: data.MRData.DriverTable.Drivers
			}))
	})
	.catch(err => {
		console.log("errorfinal")
	})
}
