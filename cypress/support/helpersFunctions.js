import {faker} from "@faker-js/faker";
let userPassword = 'passsword11';
let userEmail = faker.internet.email();

export function gettingAccessToken() {

    let accessToken;

    return cy.request({
        method: 'POST',
        url: '/register',
        body: {
            "email": userEmail,
            "password": userPassword
        }
    }).then(() => {

         cy.request({
            method: 'POST',
            url:   '/login',
            body: {
                "email": userEmail,
                "password": userPassword
            }
        }).then(response => {
            accessToken = response.body.accessToken;
            cy.log(accessToken);
            return
        })
    })
}