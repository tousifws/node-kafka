describe("Read posts", () => {
    beforeEach(() => {
        cy.intercept("**/graphql", { fixture: "posts" }).as("getPosts");

        cy.visit("http://localhost:3000");
    });

    it("Displays list of posts by default", () => {
        cy.wait("@getPosts").its("response.statusCode").should("be.oneOf", [200]);

        cy.get("[data-test=postCard]").should((element) => {
            expect(element).to.have.length(28);
            cy.log(element);
        });
    });
});
