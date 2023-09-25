it('app', () => {
	cy.visit('http://localhost:5173')
	cy.get('h1').should("include.text", "branas.io");
});
