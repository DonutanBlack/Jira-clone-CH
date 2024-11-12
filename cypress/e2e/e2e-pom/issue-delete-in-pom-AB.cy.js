/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal";

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .wait(30000)
      .should("eq", `${Cypress.env("baseUrl")}project/board/`)
      .then((url) => {
        //open issue detail modal with title from line 16
        cy.contains(issueTitle).click();
      });
  });

  const issueTitle = "This is an issue of type: Task.";

  it("Should delete issue successfully", () => {
    const Numberissues = 3;
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    // function to count issues was added in IssueModal page
    IssueModal.BacklogIssueNumbervalidation(Numberissues);
  });

  it("Should cancel deletion process successfully", () => {
    const Numberissues = 4;
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
    // function to count issues was added in IssueModal page
    IssueModal.BacklogIssueNumbervalidation(Numberissues);
  });
});
