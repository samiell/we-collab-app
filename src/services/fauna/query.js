export const getPageQuery = (payload) => {
    return `
      query getPage {
        getPage: findPageByName(
          name: "${payload}"
        ) {
          _id
          name
          room
          secret
          type
          content
        }
      }
    `
}