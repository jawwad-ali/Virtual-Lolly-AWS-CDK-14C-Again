const path = require("path")
// exports.createPages = async ({ graphql, actions }) => {
//     const { createPage } = actions

//     const result = await graphql(`
//         query MyQuery{
//             getLollies {
//                 listLolly {
//                     c1, c2, c3, rec, sender, message,path
//                 }
//             }
//         }
//     `)
//     console.log(JSON.stringify(result))
//     result.data.getLollies.listLolly.map((data) => {
//         createPage({
//             path: `lolly/${data.path}`,
//             component: path.resolve("./src/Template/Template.tsx"),
//             context: {
//                 data: data
//             }
//         })
//     })
// }

exports.createPages = async function ({ graphql, actions }) {
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

    result.data.getLollies.listLolly.map((d) => {
        createPage({
            path: `${d.path}`,
            component: path.resolve("./src/Template/Template.tsx"),
            context: {
                d: d
            }
        })
    })
    console.log("End of Gatsby Node File");
}