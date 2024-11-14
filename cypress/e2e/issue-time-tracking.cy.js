const openIssue = () => cy.get(backLogList).should('be.visible').contains(issueTitle).click();
const issueDescription = 'VB test time traking - time can be added and modified';
const issueTitle = 'VB test Time traking';
const issueCreatedConfirmation = 'Issue has been successfully created.';
const backLogList = '[data-testid="board-list:backlog"]';
const inputFieldTime = 'input[placeholder="Number"]';
const estimatedTime = '10';
const estimatedTimeText = 'h estimated';
const estimatedTimeUpdated = '20';
const noTimeLogged = () => cy.contains('No time logged');
const timeTrackingButton = '[data-testid="icon:stopwatch"]';
const timeTrackingModal = '[data-testid="modal:tracking"]';
const loggedTime = '2';
const remainingTime = '5';
const loggedTimeUpdated = '3';
const remainingTimeUpdated = '4';
const loggedTimeText = 'h logged';
const remainingTimeText = 'h remaining';

describe("Time tracking functionality testing", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.url()
        .should("eq", `${Cypress.env("baseUrl")}project/board`)
        .then((url) => {
          cy.visit(url + '/board?modal-issue-create=true');
          cy.get('[data-testid="modal:issue-create"]')
          .within(() => {
              cy.get('[data-testid="select:type"]').click();
              cy.get('[data-testid="select-option:Bug"]').click();
              cy.get(".ql-editor").type(issueDescription);
              cy.get('input[name="title"]').type(issueTitle);
              cy.get('[data-testid="select:userIds"]').click();
              cy.get('[data-testid="select-option:Pickle Rick"]').click();
              cy.get('button[type="submit"]').click();
          });
      cy.contains(issueCreatedConfirmation).should('be.visible');
      openIssue();
        });
    });
    
    it('Should successfully add, update and remove estimated time', () => {
        noTimeLogged().should('be.visible');

        cy.get(inputFieldTime).type(estimatedTime);
        cy.get(inputFieldTime).should('have.value', estimatedTime);
        cy.contains(`${estimatedTime}${estimatedTimeText}`).should('be.visible');
        cy.get('[data-testid="icon:close"]').first().click();
        cy.reload();
        openIssue();
        cy.contains(`${estimatedTime}${estimatedTimeText}`).should('be.visible');

        cy.get(inputFieldTime).clear().type(estimatedTimeUpdated);
        cy.get(inputFieldTime).should('have.value', estimatedTimeUpdated);
        cy.contains(`${estimatedTimeUpdated}${estimatedTimeText}`).should('be.visible');
        cy.get('[data-testid="icon:close"]').first().click();
        cy.reload();
        openIssue();
        cy.contains(`${estimatedTimeUpdated}${estimatedTimeText}`).should('be.visible');

        cy.get(inputFieldTime).clear();
        cy.contains(`${estimatedTime}${estimatedTimeText}`).should('not.exist');
        cy.contains(`${estimatedTimeUpdated}${estimatedTimeText}`).should('not.exist');
        noTimeLogged().should('be.visible');
        cy.get('[data-testid="icon:close"]').first().click();
        cy.reload();
        openIssue();
        noTimeLogged().should('be.visible');
    });

    it('Should successfully add, update and remove logged time values', () => {
        cy.get(inputFieldTime).type(estimatedTime);
        cy.get(inputFieldTime).should('have.value', estimatedTime);
        cy.contains(`${estimatedTime}${estimatedTimeText}`).should('be.visible');

        noTimeLogged().should('be.visible');
        cy.get(timeTrackingButton).click();
        cy.get(timeTrackingModal).should('be.visible')
            .within(() => {
                cy.get(inputFieldTime).eq(0).type(loggedTime);
                cy.get(inputFieldTime).eq(1).type(remainingTime);

                cy.contains('button', 'Done').click();
            });

        cy.get(timeTrackingModal).should('not.exist');

        cy.contains(`${loggedTime}${loggedTimeText}`).should('be.visible');
        cy.contains(`${remainingTime}${remainingTimeText}`).should('be.visible');
        cy.contains(`${estimatedTime}${estimatedTimeText}`).should('not.exist');

        // Add editing logged and remaining times
        cy.get(timeTrackingButton).click();
        cy.get(timeTrackingModal).should('be.visible')
            .within(() => {
                cy.get(inputFieldTime).eq(0).type(loggedTimeUpdated);
                cy.get(inputFieldTime).eq(1).type(remainingTimeUpdated);

                cy.contains('button', 'Done').click();
            });

        cy.get(timeTrackingModal).should('not.exist');

        cy.contains(`${loggedTimeUpdated}${loggedTimeText}`).should('be.visible');
        cy.contains(`${remainingTimeUpdated}${remainingTimeText}`).should('be.visible');
        cy.contains(`${estimatedTime}${estimatedTimeText}`).should('not.exist');

        noTimeLogged().should('not.exist');

        cy.get(timeTrackingButton).click();
        cy.get(timeTrackingModal).should('be.visible')
            .within(() => {
                cy.get(inputFieldTime).eq(0).clear();
                cy.get(inputFieldTime).eq(1).clear();
                cy.contains('button', 'Done').click();
            });

        noTimeLogged().should('be.visible');
        cy.contains(`${loggedTime}${loggedTimeText}`).should('not.exist');
        cy.contains(`${remainingTime}${remainingTimeText}`).should('not.exist');
        cy.contains(`${estimatedTime}${estimatedTimeText}`).should('be.visible');
    });
});