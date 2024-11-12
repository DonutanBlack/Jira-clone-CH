const issueTitle = "This is an issue of type: Task.";
const confirmation1 = "Are you sure you want to delete this issue?";
const confirmation2 = "Once you delete, it's gone for good";

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.contains(issueTitle).click();
      });
  });

  it("Test that you can detelte the issue created", () => {
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should("be.visible");
    cy.get('[data-testid="modal:confirm"]').contains(confirmation1);
    cy.get('[data-testid="modal:confirm"]').contains(confirmation2);
    cy.get('[data-testid="modal:confirm"]').contains("Delete issue").click();
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="board-list:backlog"]')
      .contains(issueTitle)
      .should("not.exist");
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.get('[data-testid="list-issue"]').should("have.length", 3);
    });
  });
  it("Test that you can cancel the deletion of the issue created", () => {
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should("be.visible");
    cy.get('[data-testid="modal:confirm"]').contains(confirmation1);
    cy.get('[data-testid="modal:confirm"]').contains(confirmation2);
    cy.get('[data-testid="modal:confirm"]').contains("Cancel").click();
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="board-list:backlog"]')
      .contains(issueTitle)
      .should("exist");
    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.get('[data-testid="list-issue"]').should("have.length", 4);
    });
  });
});
