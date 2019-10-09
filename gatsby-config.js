/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  pathPrefix: `/ff-timetable`,
  plugins: [
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-plugin-less`,
      options: {
        javascriptEnabled: true,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `schedule`,
        path: `${__dirname}/data/`,
      },
    },
  ],
}
