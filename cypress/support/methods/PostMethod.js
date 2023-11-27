import AllMethods from "./AllMethods";

class PostMethod extends AllMethods {
    constructor() {
        super();
        this.variables.postId;
    }




    failPostCreation() {
        cy.request({
            method: 'POST',
            failOnStatusCode: false,
            url: '/664/posts'
        }).then(response => {
            expect(response.status).to.eq(401);
        });
    }

    createEmptyPost(accessToken) {

        cy.request({
            method: 'POST',
            url: '/664/posts',
            headers: {"Authorization": `Bearer ${accessToken}`}
        }).then(response => {
            expect(response.status).to.eq(201)
            this.variables.postId = response.body.id;
        }).then(() => {
            cy.request({
                method: 'GET',
                url: `/posts/${this.variables.postId}`
            }).then(response => {
                expect(response.status).to.eq(200);
                expect(response.body.id).to.eq(this.variables.postId);
            })
        })
    }

    createPostWithContent(accessToken, postTitle, postBody) {
        return cy.request({
            method: 'POST',
            url: '/posts',
            headers: {"Authorization": `Bearer ${accessToken}`}, body: {
                "title": postTitle,
                "body": postBody
            }
        }).then(response => {
            this.variables.postId = response.body.id;
            expect(response.status).to.eq(201);
        }).then(() => {
                return cy.request({
                        method: 'GET',
                    url: `/posts?id=${this.variables.postId}`,
                    }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.body[0].title).to.eq(postTitle);
                    expect(response.body[0].body).to.eq(postBody);
                    expect(response.body[0].id).to.eq(this.variables.postId);
                    return this.variables.postId;
                })
            });
    }

}

export default new PostMethod();