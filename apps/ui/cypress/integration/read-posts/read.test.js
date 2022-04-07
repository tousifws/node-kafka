/// <reference types="cypress" />

describe("Read posts", () => {
    beforeEach(() => {
        cy.intercept("**/graphql", { fixture: "posts" }).as("getPosts");

        cy.visit("/");
    });

    it("Displays list of posts by default", () => {
        cy.wait("@getPosts").its("response.statusCode").should("be.oneOf", [200]);
        cy.findAllByTestId("postTitle").should((element) => {
            expect(element).to.have.length(28);
        });
    });
});
