import d3 from 'd3'
import uuid from 'uuid'
import tpl from '../templates/chart2.hbs'

function draw(chartId, data, width, height, margin) {
  const svg = d3.select(`#${chartId}`)

  const x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1)
  const y = d3.scale.linear().range([height, 0])

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(10)

    const yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(10)

  x.domain(data.map(function(d) {
    return d.driverId
  }))

  y.domain([
    0, d3.max(data, function(d) {
      return timeToMilliseconds(d.time)
    })
  ])

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(${margin.left}, ${height})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.5em')
    .attr('dy', '.5em')
    .attr('transform', 'rotate(-30)')

  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .style('text-anchor', 'end')
    .text('Time in Milliseconds')

  svg
    .selectAll('bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) {
      return x(d.driverId) + margin.left
    })
    .attr('width', function() {
      return x.rangeBand()
    })
    .attr('y', function(d) {
      console.log("TIME " + timeToMilliseconds(d.time))
      console.log("y " + y(timeToMilliseconds(d.time)))
      return y(timeToMilliseconds(d.time))
    })
    .attr('height', function(d) {
      console.log("H " + height)
      console.log(timeToMilliseconds(d.time))
      return height - y(timeToMilliseconds(d.time))
    })
}

function timeToMilliseconds(time) {
  let min = parseInt(time.charAt(0)) * 60000
  let sec = parseInt(time.charAt(2) + time.charAt(3)) * 1000
  let millisec = parseInt(time.charAt(5) + time.charAt(6) + time.charAt(7))
  return min + sec + millisec
}

export default function(containerId, data) {
  const container = document.getElementById(containerId)
  const width = 800
  const height = 600
  const margin = {
    top: 0,
    right: 0,
    left: 55,
    bottom: 145
  }

  const viewBox = `0 0 ${width} ${height}`
  const w = width - margin.left - margin.right
  const h = height - margin.top - margin.bottom

  const id = 'chart-' + uuid.v4()
  const svg = tpl({
    id,
    viewBox
  })

  container.innerHTML = svg

  draw(id, data, w, h, margin)
}
