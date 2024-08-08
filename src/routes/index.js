const authRoute = require('./auth.route')
const placesRoute = require('./places.route')
const usersRoute = require('./users.route')
const categoriesRoute = require('./categories.route')
const eventsRoute = require('./events.route')
const cartsRoute = require('./carts.route')
const favoritesRoute = require('./favorites.route')
const bannersRoute = require('./banners.route')
const testimonialsRoute = require('./testimonials.route')
const contactsRoute = require('./contacts.route')
const searchRoute = require('./search.route')

module.exports = [authRoute, placesRoute, usersRoute, categoriesRoute, eventsRoute, cartsRoute, favoritesRoute, bannersRoute, testimonialsRoute, contactsRoute, searchRoute]