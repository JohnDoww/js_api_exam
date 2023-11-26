import {faker} from "@faker-js/faker";
let userPassword = 'passsword11';
// let userEmail = faker.internet.email();

export function gettingAuthToken() {
    let userEmail = faker.internet.email();
    return cy.request({
        method: 'POST',
        url: '/register',
        body: {
            "email": userEmail,
            "password": userPassword
        }
    }).then(() => {

        return cy.request({
            method: 'POST',
            url:   '/login',
            body: {
                "email": userEmail,
                "password": userPassword
            }
        })
    }).then(response => {
        return response.body.accessToken;
    })
}
