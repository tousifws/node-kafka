/// <reference types="cypress" />

describe("Read posts", function () {
    beforeEach(() => {
        cy.intercept("**/graphql", { fixture: "posts" }).as("getPosts");

        cy.visit("/");
    });

    it("Displays list of posts by default", function () {
        cy.wait("@getPosts").its("response.statusCode").should("be.oneOf", [200]);
        cy.findAllByTestId("postTitle").should((element) => {
            expect(element.length).toEqual(28);
            expect(element[0].innerText.length).greaterThan(1);
        });
    });
});
