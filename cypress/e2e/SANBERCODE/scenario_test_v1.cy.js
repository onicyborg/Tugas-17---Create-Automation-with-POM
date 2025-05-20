describe('OrangeHRM Login Feature', () => {
  // visit web
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.wait(1000); // Tunggu login page load
  });

  // login dengan credential yang valid
  it('Login dengan credential yang valid', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // penambahan intercept untuk memeriksa response dari API
    cy.intercept('GET', '/web/index.php/api/v2/dashboard/shortcuts').as('shortcuts');

    cy.url().should('include', '/dashboard');

    // menunggu response dari API
    cy.wait('@shortcuts').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  // login dengan credential yang invalid
  it('Login dengan password yang salah', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('wrongpass');

    // penambahan intercept untuk memeriksa response dari API
    cy.intercept('POST', '/web/index.php/auth/validate').as('loginAttempt');

    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');

    // menunggu response dari API
    cy.wait('@loginAttempt').then((interception) => {
      expect(interception.response.statusCode).to.equal(302);
    });
  });

  // login dengan username yang kosong
  it('Login tanpa mengisi kolom username', () => {
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get(':nth-child(2) > .oxd-input-group > .oxd-text').should('contain', 'Required');
  });

  // login dengan password yang kosong
  it('Login tanpa mengisi kolom password', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('button[type="submit"]').click();
    cy.get(':nth-child(3) > .oxd-input-group > .oxd-text').should('contain', 'Required');
  });

  // login dengan username dan password yang kosong
  it('Login kolom username dan password dalam keadaan kosong', () => {
    cy.get('button[type="submit"]').click();
    cy.get(':nth-child(2) > .oxd-input-group > .oxd-text').should('contain', 'Required');
    cy.get(':nth-child(3) > .oxd-input-group > .oxd-text').should('contain', 'Required');
  });
});
