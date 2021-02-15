/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    {
            resolve: "gatsby-source-graphql",
            options: {
              // This type will contain remote schema Query type
              typeName: "LOLLIES",
              // This is field under which it's accessible
              fieldName: "getLollies",
              // Url to query from
              url: "https://jinrzo2cubch3dgaoanndiquqa.appsync-api.us-east-1.amazonaws.com/graphql",
              headers: {
                "x-api-key": "da2-mmnqk7d775cl5bdvjtjgdacoee"
              }
            },
          },
  ],
}
