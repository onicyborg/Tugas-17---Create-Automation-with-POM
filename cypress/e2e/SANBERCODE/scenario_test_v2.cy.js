import LoginPage from '../SANBERCODE/support/pages/login_page.cy.js';

const loginPage = new LoginPage();

describe('OrangeHRM Login Feature (POM)', () => {
  beforeEach(() => {
    loginPage.visit();
    cy.wait(1000);
  });

  it('Login dengan credential yang valid', () => {
    loginPage.fillUsername('Admin');
    loginPage.fillPassword('admin123');

    cy.intercept('GET', '/web/index.php/api/v2/dashboard/shortcuts').as('shortcuts');
    loginPage.clickLogin();

    cy.url().should('include', '/dashboard');
    cy.wait('@shortcuts').its('response.statusCode').should('eq', 200);
  });

  it('Login dengan password yang salah', () => {
    loginPage.fillUsername('Admin');
    loginPage.fillPassword('wrongpass');

    cy.intercept('POST', '/web/index.php/auth/validate').as('loginAttempt');
    loginPage.clickLogin();

    loginPage.getErrorMessage().should('contain', 'Invalid credentials');
    cy.wait('@loginAttempt').its('response.statusCode').should('eq', 302);
  });

  it('Login tanpa mengisi kolom username', () => {
    loginPage.fillPassword('admin123');
    loginPage.clickLogin();

    loginPage.getUsernameRequiredError().should('contain', 'Required');
  });

  it('Login tanpa mengisi kolom password', () => {
    loginPage.fillUsername('Admin');
    loginPage.clickLogin();

    loginPage.getPasswordRequiredError().should('contain', 'Required');
  });

  it('Login kolom username dan password dalam keadaan kosong', () => {
    loginPage.clickLogin();

    loginPage.getUsernameRequiredError().should('contain', 'Required');
    loginPage.getPasswordRequiredError().should('contain', 'Required');
  });
});
