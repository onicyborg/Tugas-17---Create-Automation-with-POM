describe("Reqres.in API Automation Test", () => {
  const headers = {
    "x-api-key": "reqres-free-v1",
  };

  it("GET list users", () => {
    cy.request({
      method: "GET",
      url: "https://reqres.in/api/users?page=2",
      headers,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  it("GET single user", () => {
    cy.request({
      method: "GET",
      url: "https://reqres.in/api/users/2",
      headers,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property("id", 2);
    });
  });

  it("POST create user", () => {
    cy.request({
      method: "POST",
      url: "https://reqres.in/api/users",
      headers,
      body: {
        name: "morpheus",
        job: "leader",
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("name", "morpheus");
    });
  });

  it("PUT update user", () => {
    cy.request({
      method: "PUT",
      url: "https://reqres.in/api/users/2",
      headers,
      body: {
        name: "morpheus",
        job: "zion resident",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq("morpheus");
      expect(response.body.job).to.eq("zion resident");
    });
  });

  it("PATCH update user", () => {
    cy.request({
      method: "PATCH",
      url: "https://reqres.in/api/users/2",
      headers,
      body: {
        name: "morpheus",
        job: "zion resident",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq("morpheus");
      expect(response.body.job).to.eq("zion resident");
    });
  });

  it("DELETE user", () => {
    cy.request({
      method: "DELETE",
      url: "https://reqres.in/api/users/2",
      headers,
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });

  it("POST login - success", () => {
    cy.request({
      method: "POST",
      url: "https://reqres.in/api/login",
      headers,
      body: {
        email: "eve.holt@reqres.in",
        password: "cityslicka",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");
    });
  });

  it("POST login - failed", () => {
    cy.request({
      method: "POST",
      url: "https://reqres.in/api/login",
      failOnStatusCode: false,
      headers,
      body: {
        email: "peter@klaven",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error");
    });
  });

  it("GET single user not found", () => {
    cy.request({
      method: "GET",
      url: "https://reqres.in/api/users/23",
      failOnStatusCode: false,
      headers,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("GET list <RESOURCE>", () => {
    cy.request({
      method: "GET",
      url: "https://reqres.in/api/unknown",
      headers,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  it("GET single <RESOURCE>", () => {
    cy.request({
      method: "GET",
      url: "https://reqres.in/api/unknown/2",
      headers,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property("id", 2);
    });
  });

  it("GET single <RESOURCE> not found", () => {
    cy.request({
      method: "GET",
      url: "https://reqres.in/api/unknown/23",
      failOnStatusCode: false,
      headers,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("POST register - success", () => {
    cy.request({
      method: "POST",
      url: "https://reqres.in/api/register",
      headers,
      body: {
        email: "eve.holt@reqres.in",
        password: "pistol",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("token");
    });
  });

  it("POST register - failed", () => {
    cy.request({
      method: "POST",
      url: "https://reqres.in/api/register",
      failOnStatusCode: false,
      headers,
      body: {
        email: "sydney@fife",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error");
    });
  });

  it("GET delayed response", () => {
    cy.request({
      method: "GET",
      url: "https://reqres.in/api/users?delay=3",
      headers,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.be.an("array");
      // tambahkan validasi untuk memeriksa waktu respons
      const responseTime = response.duration;
      expect(responseTime).to.be.greaterThan(3000); // waktu respons lebih dari 3 detik
    });
  });
});
