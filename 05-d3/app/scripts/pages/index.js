import d3 from 'd3'
import page from 'page'
import config from '../config'
import tplDrivers from '../templates/drivers.hbs'
import tplNotFound from '../templates/not-found.hbs'
import tplError from '../templates/error.hbs'

const content = document.getElementById('content')

let globalError = undefined

function driversByAge(drivers) {
  return drivers.map(driver => {
    const dateOfBirth = new Date(driver.dateOfBirth)
    const age = (new Date()).getFullYear() - dateOfBirth.getFullYear()
    return {
      name: `${driver.givenName} ${driver.familyName}`,
      age
    }
  })
}

function draw(data, width = 800, height = 400) {
  const format = d3.format('d')
  const svg = d3.select('#chart')
  const x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1)
  const y = d3.scale.linear().range([height, 0])
  const xAxis = d3.svg
    .axis()
    .scale(x)
    .orient('bottom')
    .ticks(10)
    .tickFormat(format)

  if (!(data instanceof Array)) {
    return
  }

  x.domain(data.map(function(d) {
    return d.name
  }))
  y.domain([
    0, d3.max(data, function(d) {
      return d.age
    })
  ])

  svg
    .select('.axis.x')
    .call(xAxis)

  const chart = svg
    .select('.rects')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('g')

  chart.append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) {
      return x(d.name)
    })
    .attr('y', function(d) {
      return y(d.age)
    })
    .attr('width', x.rangeBand())
    .attr('height', function(d) {
      return height - y(d.age)
    })

  chart.append('text')
    .attr('y', function(d) {
      if (width - x(d.age) > width / 5 * 3) {
        return width
      }
      return y(d.age)
    })
    .attr('x', function(d) {
      return x(d.name) + x.rangeBand() / 2
    })
    .attr('dx', '-0.35em')
    .attr('dy', '0.35em')
    .text(function(d) {
      return `${d.name}`
    })
}

export function drivers() {
  fetch(config.api.url + `/drivers.json?limit=10`)
    .then(response => {
      if (response.status >= 400) {
        return page('error')
      }
      return response.json()
    })
    .then(data => {
      const width = 800
      const height = 300
      content.innerHTML = tplDrivers({
        viewBox: `0 0 ${width} ${height}`,
        transformG: 'translate(0, 0)',
        transformX: `translate(0, ${height})`,
        drivers: data.MRData.DriverTable.Drivers
      })
      draw(
        driversByAge(data.MRData.DriverTable.Drivers),
        width,
        height
      )
    })
    .catch(err => {
      globalError = err
      page('/error')
    })
}

export function notFound() {
  console.log('not Found')
  content.innerHTML = tplNotFound()
}

export function internalError() {
  content.innerHTML = tplError({error: globalError})
  throw globalError
}
