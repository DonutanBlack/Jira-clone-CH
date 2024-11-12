describe("Issue Deletion", () => {
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });

    getIssueDetailsModal().should("be.visible");
  });

  it("Test Case 1: Deletes an issue and verifies successful removal from the board", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    });

    cy.get('[data-testid="modal:confirm-deletion"]').within(() => {
      cy.contains("Delete").click();
    });

    cy.get('[data-testid="modal:confirm-deletion"]').should("not.exist");
    getIssueDetailsModal().should("not.exist");

    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains("This is an issue of type: Task.").should("not.exist");
    });
  });


  it("Test Case 2: Cancels issue deletion and confirms the issue remains visible on the board", () => {
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("button", "Cancel").click();
    });
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains("This is an issue of type: Task.").should("be.visible");
    });
  });
});
