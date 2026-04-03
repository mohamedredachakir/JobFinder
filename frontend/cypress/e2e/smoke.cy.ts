describe('JobFinder smoke', () => {
  it('loads landing page', () => {
    cy.visit('/');
    cy.contains('JobFinder').should('exist');
  });
});
