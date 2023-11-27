import {faker} from '@faker-js/faker';
import {gettingAuthToken} from "../support/helpersFunctions";
import getMethod from "../support/methods/GetMethod";
import postMethod from "../support/methods/PostMethod";
import putMethod from "../support/methods/PutMethod";
import deleteMethod from "../support/methods/DeleteMethod";

let newTitle = faker.internet.email();
let postId;
let postTitle = faker.animal.dog();
let postBody = faker.lorem.lines(1);
let searchPost1;
let searchPost2;


describe('Api tests', () => {


    it('1. Get all posts', () => {
        getMethod.getAllPosts().then(response => {
            expect(response.status).to.eq(200);
            expect(response.headers).to.have.property('content-type', "application/json; charset=utf-8");
        })
        cy.log('Got all posts');
    });


    it('2. Get only first 10 posts', () => {
        getMethod.getFirst10Posts().then(response => {
            expect(response.status).to.eq(200);
            expect(response.body.length).to.eq(10);
            expect(response.body.map(item => item.id)).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        })
        cy.log('Got first 10 posts');
    });


    it('3. Get posts with id:55 and id:60', () => {
        searchPost1 = 55;
        searchPost2 = 60;

        getMethod.getAnyTwoPosts(searchPost1, searchPost2).then(response => {
            expect(response.status).to.eq(200);
            expect(response.body.length).to.eq(2)
            expect(response.body[0].id).to.eq(searchPost1);
            expect(response.body[1].id).to.eq(searchPost2);
        })

        cy.log(`Got posts ${searchPost1} and ${searchPost2}`);
    });


    it('4. Getting 401 status when create postMethod', () => {
        postMethod.failPostCreation();
        cy.log(`Got 401 status code when tried to create post`);
    })


    it('5. Create a postMethod', () => {
        gettingAuthToken().then(token => {
            cy.log('Got authorization token' );

            postMethod.createEmptyPost(token);
            cy.log('Created empty post' );
        })
    })


    it('6. Create a postMethod with body ', () => {
        gettingAuthToken().then(token => {
            cy.log('Got authorization token' );

            postMethod.createPostWithContent(token, postTitle, postBody)
            cy.log('Created post with title and body' );
        })
    });


    it('7. Getting 404 status when update non-existing postMethod ', () => {

        putMethod.failPostUpdating(postTitle, postBody);
        cy.log(`Got 404 status code when tried to update non-existing post`);
    })


    it('8. Update created postMethod', () => {
        newTitle = faker.internet.email();
        postTitle = faker.animal.dog();
        postBody = faker.lorem.lines(1);

        gettingAuthToken().then(token => {
            cy.log('Got authorization token' );

            postMethod.createPostWithContent(token, postTitle, postBody).then(postId => {
                cy.log('Created post with title and body');

                putMethod.putNewPostTitle(postId, newTitle);
                cy.log('Update creating post. Left there only new title');

                getMethod.getPostById(postId).then(res => {
                    cy.log('Verify that post was changed correctly');
                    expect(res.status).to.eq(200);
                    expect(res.body[0].title).to.not.eq(postTitle);
                    expect(res.body[0].title).to.eq(newTitle);
                    expect(res.body[0]).to.not.eq('body')
                    expect(res.body[0].id).to.eq(postId);
                })
            })
        })
    })


    it('9. Getting 404 status when DELETE non-existing postMethod', () => {
        postId = '664';

        deleteMethod.postDeletion(postId).then(response => {
            expect(response.status).to.eq(404);
            cy.log(`Got 404 status code when tried to delete non-existing post`);
        })
    })


    it('10. Create, update and delete postMethod', () => {
        newTitle = faker.internet.email();
        postTitle = faker.animal.dog();
        postBody = faker.lorem.lines(1);

        gettingAuthToken().then(token => {
            cy.log('Got authorization token' );

            postMethod.createPostWithContent(token, postTitle, postBody).then(postId => {
                cy.log('Created post with title and body');

                putMethod.putNewPostTitle(postId, newTitle);
                cy.log('Update creating post. Left there only new title');

                getMethod.getPostById(postId).then(response => {
                    cy.log('Verify that post was changed correctly');
                    expect(response.status).to.eq(200);
                    expect(response.body[0].title).to.not.eq(postTitle);
                    expect(response.body[0].title).to.eq(newTitle);
                    expect(response.body[0]).to.not.eq('body')
                    expect(response.body[0].id).to.eq(postId);
                })

                deleteMethod.postDeletion(postId).then(response => {
                    cy.log('Delete the post');
                    expect(response.status).to.eq(200);
                })

                deleteMethod.postDeletion(postId).then(response => {
                    cy.log('Double check. Post is deleted or not');
                    expect(response.status).to.eq(404);
                })
            })
        })
    })


})