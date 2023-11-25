///<reference types="cypress"/>
import {faker} from '@faker-js/faker';
import {gettingAccessToken} from "../support/helpersFunctions";

export {gettingAccessToken} from '../support/helpersFunctions'

// let locll = 'http://localhost:3000';


describe('Api', () => {

    it('1. Get only first 10 posts', () => {
        cy.request({
            method: 'GET',
            url: '/posts',
        }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.headers).to.have.property('content-type', "application/json; charset=utf-8");
        })
    });

    it('2. Get only first 10 posts', () => {
        cy.request({
            method: 'GET',
            url: '/posts?_start=0&_end=10',
        }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.body.length).to.eq(10)

            expect(response.body[0].id).to.eq(1);
            expect(response.body[1].id).to.eq(2);
            expect(response.body[2].id).to.eq(3);
            expect(response.body[3].id).to.eq(4);
            expect(response.body[4].id).to.eq(5);
            expect(response.body[5].id).to.eq(6);
            expect(response.body[6].id).to.eq(7);
            expect(response.body[7].id).to.eq(8);
            expect(response.body[8].id).to.eq(9);
            expect(response.body[9].id).to.eq(10);
        })
    });

    it('3. Get posts with id:55 and id:60', () => {
        cy.request({
            method: 'GET',
            url: '/posts?id=55&id=60',
        }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.body.length).to.eq(2)
            expect(response.body[0].id).to.eq(55);
            expect(response.body[1].id).to.eq(60);
        })
    });

    it('4. Create a post. Get 401 status code', () => {
        cy.request({
            method: 'POST',
            failOnStatusCode: false,
            url: '/664/posts'
        }).then(response => {
            expect(response.status).to.eq(401);
        })
    });

    let accessToken;
    let userPassword = 'passsword11';
    let userEmail = faker.internet.email();
    let postId;

    it('5.', () => {
        cy.request({
            method: 'POST',
            url: '/register',
            body: {
                "email": userEmail,
                "password": userPassword
            }
        }).then(() => {
            cy.request({
                method: 'POST',
                url:  '/login',
                body: {
                    "email": userEmail,
                    "password": userPassword
                }
            }).then(response => {
                accessToken = response.body.accessToken;
            }).then(() => {

                cy.request({
                    method: 'POST',
                    url:  '/664/posts',
                    headers: {"Authorization": `Bearer ${accessToken}`}
                }).then(response => {
                    expect(response.status).to.eq(201)
                    postId = response.body.id;
                }).then(() => {
                    cy.request({
                        method: 'GET',
                        url:  `/posts/${postId}`
                    }).then(response => {
                        expect(response.status).to.eq(200);
                        expect(response.body.id).to.eq(postId);
                    })
                })
            })
        })
    })

    it('6. ', () => {

        let accessToken2 = gettingAccessToken();
        // cy.log(gettingAccessToken());
        cy.log(accessToken2)
    });

    let postTitle = faker.animal.dog();
    let postBody = faker.lorem.lines(1);

    it('6.1 ', () => {
        let userEmail = faker.internet.email();

        cy.request({
            method: 'POST',
            url: '/register',
            body: {
                "email": userEmail,
                "password": userPassword
            }
        }).then(() => {
            cy.request({
                method: 'POST',
                url: '/login',
                body: {
                    "email": userEmail,
                    "password": userPassword
                }
            }).then(response => {
                accessToken = response.body.accessToken;
            })
                .then(() => {
                    cy.request({
                        method: 'POST',
                        url: '/posts',
                        headers: {"Authorization": `Bearer ${accessToken}`},
                        body: {
                            "title": postTitle,
                            "body": postBody
                        }
                    }).then(response => {
                        postId = response.body.id;
                        expect(response.status).to.eq(201);
                    })
                }).then(() => {
                cy.request({
                    method: 'GET',
                    url: `/posts?id=${postId}`,
                }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.body[0].title).to.eq(postTitle);
                    expect(response.body[0].body).to.eq(postBody);
                    expect(response.body[0].id).to.eq(postId);
                })
            });


        })
    })

    it.only('7', ()=>{
        cy.request({
            method: 'PUT',
            failOnStatusCode: false,
            url: '/posts/664',
            body: {
                "title": postTitle,
                "body": postBody
            }
        }).then(response => {
            expect(response.status).to.eq(404);
        })

    })

    it.only('8', ()=>{
        cy.request({
            method: 'PUT',
            failOnStatusCode: false,
            url: '/posts/664',
            body: {
                "title": postTitle,
                "body": postBody
            }
        }).then(response => {
            expect(response.status).to.eq(404);
        })

    })



})