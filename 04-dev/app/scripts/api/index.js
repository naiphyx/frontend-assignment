import $ from 'jquery'
import page from 'page'
import fetch from 'isomorphic-fetch'
//import url from 'url'
import tplDrivers from '../templates/drivers.hbs'
import tplHome from '../templates/home.hbs'
import tplNotFound from '../templates/notfound.hbs'
import tplContact from '../templates/contact.hbs'

const url = 'http://ergast.com/api/f1' // http://ergast.com/mrd/
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

export function drivers(ctx) {
	fetch(url + `/drivers.json`)
	.then(response => {
		return response.json()
	})
	.then(data => {
		$content.html(
			tplDrivers({}))
	})
	.catch(err =>{
		console.log("error")
	})
}
