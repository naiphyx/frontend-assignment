import page from 'page'
import * as pages from './pages'

page('/', '/drivers')
page('/drivers', pages.drivers)

page('/error', pages.internalError)
page('*', pages.notFound)

page()
