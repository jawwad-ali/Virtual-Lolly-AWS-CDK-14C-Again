const path = require("path")
exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions

    const result = await graphql(`
        query MyQuery{
            getLollies {
                listLolly {
                    c1, c2, c3, rec, sender, message,path
                }
            }
        }
    `)
    console.log(JSON.stringify(result))
    result.data.getLollies.listLolly.map((data) => {
        createPage({
            path: `lolly/${data.path}`,
            component: path.resolve("./src/Template/Template.tsx"),
            context: {
                data: data
            }
        })
    })
}


exports.onCreatePage = async ({ page, actions }) => {
    const { createPage } = actions;

    // page.matchPath is a special key that’s used for matching pages

    // only on the client.

    if (page.path.match(/^\/lollies/)) {
        page.matchPath = "/lollies/*";

        // Update the page.

        createPage(page);
    }
};