/// <reference types="cypress" />
// const autoRecord = require("cypress-autorecord");

describe("Read posts", function () {
    // autoRecord();
    beforeEach(() => {
        cy.intercept("**/graphql", { fixture: "posts" }).as("getPosts");

        cy.visit("/");
    });

    it("Displays list of posts by default", function () {
        cy.wait("@getPosts").its("response.statusCode").should("be.oneOf", [200]);
        cy.findAllByTestId("postTitle").should((element) => {
            expect(element).to.have.length(28);
        });
    });
});
