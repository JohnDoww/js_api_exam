import AllMethods from "./AllMethods";

class PutMethod extends AllMethods {

    failPostUpdating(postTitle, postBody){
        cy.request({
            method: 'PUT', failOnStatusCode: false, url: '/posts/664', body: {
                "title": postTitle, "body": postBody
            }
        }).then(response => {
            expect(response.status).to.eq(404);
        })

    }

    putNewPostTitle(postId, newTitle){
          cy.request({
            method: 'PUT',
            url: `/posts/${postId}`,
            body: {
                "title": newTitle
            }
        }).then(response => {
            expect(response.status).to.eq(200);
        })
    }



}
export default new PutMethod();