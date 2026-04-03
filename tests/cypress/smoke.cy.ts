describe('JobFinder app', () => {
  it('opens jobs list', () => {
    cy.visit('http://localhost:4200/jobs');
    cy.contains('Chercher').should('exist');
  });
});
