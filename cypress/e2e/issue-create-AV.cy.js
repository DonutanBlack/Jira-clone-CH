describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get(".ql-editor").type("TEST_DESCRIPTION");
      cy.get(".ql-editor").should("have.text", "TEST_DESCRIPTION");

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type("TEST_TITLE");
      cy.get('input[name="title"]').should("be.visible").type("TEST_TITLE");

      // Open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:story"]').should("be.visible");

      // Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Select Baby Yoda from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]', { timeout: 60000 })
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("TEST_TITLE")
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
            cy.get('[data-testid="icon:story"]').should("be.visible");
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains("TEST_TITLE")
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
        cy.get('[data-testid="icon:story"]').should("be.visible");
      });
  });

  it("Should validate title is required field if missing", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should(
        "contain",
        "This field is required"
      );
    });
  });
});

it.only("Test Case 1: Create Custom Issue", () => {
  const issueDetails = {
    title: "Bug",
    description: "My bug description",
    type: "Bug",
    priority: "Highest",
    reporter: "Pickle Rick",
    assignee: "Lord Gaben",
  };

  cy.get('[data-testid="modal:issue-create"]')
    .within(() => {
      cy.get(".ql-editor")
        .type(issueDetails.description)
        .should("have.text", issueDetails.description);
      cy.get('input[name="title"]')
        .type(issueDetails.title)
        .should("have.value", issueDetails.title);
      cy.get('[data-testid="select:type"]').click();
      cy.contains(issueDetails.type).click();
      cy.get('[data-testid="select:reporterId"]').click();
      cy.contains(issueDetails.reporter).click();
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.contains(issueDetails.assignee).click();
      cy.get('[data-testid="select:priority"]').click();
      cy.contains(issueDetails.priority).click();
      cy.get('button[type="submit"]').click();
    });

  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");
  cy.reload();

  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .within(() => {
      cy.contains(issueDetails.title)
        .should("be.visible")
        .within(() => {
          cy.get('[data-testid="avatar:Lord Gaben"]').should("exist");
          cy.get('[data-testid="icon:bug"]').should("exist");
          cy.get('[data-testid="icon:arrow-up"]').should("exist");
        });
    });
});

it("Test Case 2: Static Data Issue Creation", () => {
  const issueDetails = {
    title: "Static Title",
    description: "This is a static description for the issue creation test.",
    type: "Task",
    priority: "Low",
    reporter: "Baby Yoda",
  };

  cy.get('[data-testid="create-issue-button"]', { timeout: 15000 })
    .should("be.visible")
    .click();

  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get(".ql-editor").type(issueDetails.description);
    cy.get(".ql-editor").should("have.text", issueDetails.description);
    cy.get('input[name="title"]').type(issueDetails.title);
    cy.get('input[name="title"]').should("have.value", issueDetails.title);
    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="select-option:Task"]').click();
    cy.get('[data-testid="select:reporterId"]').click();
    cy.get('[data-testid="select-option:Baby Yoda"]').click();
    cy.get('[data-testid="select:priority"]').click();
    cy.get('[data-testid="select-option:Low"]').click();
    cy.get('button[type="submit"]').click();
  });

  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");

  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .within(() => {
      cy.contains(issueDetails.title).should("be.visible");
    });
});
