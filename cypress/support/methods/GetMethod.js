import AllMethods from "./AllMethods";

class GetMethod extends AllMethods {

    getAllPosts(){
        return cy.request({
            method: 'GET',
            url: '/posts',
        }).then(response => {
           return response;
       })
    }

    getFirst10Posts(){
        return  cy.request({
            method: 'GET',
            url: '/posts?_start=0&_end=10',
        }).then(response => {
            return response;
        })
    }

    getAnyTwoPosts(id1, id2){
        return  cy.request({
            method: 'GET',
            url: `/posts?id=${id1}&id=${id2}`,
        }).then(response => {
            return response;
        })
    }

    getPostById(postId){
        return  cy.request({
            method: 'GET',
            url: `/posts?id=${postId}`,
        }).then(response => {
            return response;
        })
    }

}
export default new GetMethod();