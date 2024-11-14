describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
          .trigger('mouseover')
          .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  
  it("Bonus Task 1: Checking the dropdown “Priority”", () => {
    const expectedLength = 5;
    let priorityArray = [];
    cy.get('[data-testid="select:priority"]')
      .invoke("text")
      .then((initialPriority) => {
        priorityArray.push(initialPriority.trim());
        cy.log("Initial priority:", initialPriority);
      });
    cy.get('[data-testid="select:priority"]').click();
    cy.get('[data-testid^="select-option:"]')
      .each(($el) => {
        const priorityText = $el.text().trim();
        priorityArray.push(priorityText);
        cy.log("Added priority:", priorityText);
        cy.log("Array length:", priorityArray.length);
      })
      .then(() => {
        expect(priorityArray).to.have.length(expectedLength);
      });
  });

  it("Bonus Task 2: checks that the reporter’s name contains only alphabetic characters", () => {
    cy.get('[data-testid="select:reporter"]').click();
    cy.get('[data-testid^="select-option:"]').each(($el) => {
      const reporterName = $el.text().trim();
      cy.log("Reporter Name:", reporterName);
      const nameRegex = /^[A-Za-z\s]+$/;
      expect(reporterName).to.match(
        nameRegex,
        "Reporter name contains only alphabetic characters and spaces"
      );
    });
  });
  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
});
