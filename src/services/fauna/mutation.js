export const updatePageMutation = (payload) => {
    return `
      mutation updatePublicPage{
        updatePage(
          id: "${payload._id}"
          data: {
            content:"${payload.content}"
            name: "${payload.name}"
            room: "${payload.room}"
            type: ${payload.type}
          }
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