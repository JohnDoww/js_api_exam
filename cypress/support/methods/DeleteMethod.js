import AllMethods from "./AllMethods";

class DeleteMethod extends AllMethods {

    postDeletion(postId) {
        return cy.request({
            method: 'DELETE',
            failOnStatusCode: false,
            url: `/posts/${postId}`

        }).then(response => {
            return response;
        });
    }

}
export default new DeleteMethod();