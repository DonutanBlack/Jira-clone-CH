describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Should create a comment successfully', () => {
        const comment = 'TEST_COMMENT';

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            cy.get('textarea[placeholder="Add a comment..."]').type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', comment);
        });
    });

    it('Should edit a comment successfully', () => {
        const previousComment = 'An old silent pond...';
        const comment = 'TEST_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', previousComment)
                .clear()
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', comment);
        });
    });

    it('Should delete a comment successfully', () => {
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete')
            .click();

        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');

        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .should('not.exist');
    });

    const textAreaAddComment = () => cy.get('textarea[placeholder="Add a comment..."]');
    const saveButton = () => cy.contains('button', 'Save');
    const assertCommentExists = (comment) => cy.get(issueComment).should('contain.text', comment);
    const confirmDeleteModalButton = () => cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete comment')
    const addCommentField = () => cy.contains('Add a comment...')
    const newComment = 'VB Test comment';
    const editedComment = 'VB Test comment edited';
    const issueComment = '[data-testid="issue-comment"]';
      
          
    it('Should create, edite and delete a comment successfully', () => {
      
        getIssueDetailsModal().should('be.visible').within(() => {
         addCommentField().click();
         textAreaAddComment().type(newComment);
         saveButton().click().should('not.exist');
         addCommentField().should('exist');
         assertCommentExists(newComment);
         cy.get(issueComment).first().contains('Edit').click().should('not.exist');
         textAreaAddComment().clear().type(editedComment);
         saveButton().click().should('not.exist');
         assertCommentExists(editedComment);
         cy.get(issueComment).first().contains('Delete').click();
         });
        confirmDeleteModalButton().click().should('not.exist');
        getIssueDetailsModal().find(editedComment).should('not.exist');
      });
});
