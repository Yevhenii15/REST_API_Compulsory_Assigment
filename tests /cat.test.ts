import { test, expect } from "@playwright/test";

export default function catTestCollection() {
  /**
   *
   */
  test("Workflow - register, login, create cat and verify", async ({
    request,
  }) => {
    test.setTimeout(10_000);

    //------------------------------------------------------------------------------
    // Create test objects
    //------------------------------------------------------------------------------
    const ownerReg = {
      name: "Oleh Shab",
      email: "mail@test.com",
      password: "12345678",
      phoneNumber: "1234567890",
      address: "123 Main St",
    };

    const ownerLogin = {
      email: "mail@test.com",
      password: "12345678",
    };

    //------------------------------------------------------------------------------
    // Register owner
    //------------------------------------------------------------------------------
    let response = await request.post("/api/owner/register", {
      data: ownerReg,
    });
    let json = await response.json();

    //console.log("Register:" + json);

    //expect(response.ok()).toBeTruthy();
    //expect(result).toHaveLength(0);
    expect(response.status()).toBe(200);

    //------------------------------------------------------------------------------
    // Login user
    //------------------------------------------------------------------------------
    response = await request.post("/api/owner/login", { data: ownerLogin });
    json = await response.json();

    const token = json.data.token;
    const ownerId = json.data.ownerId;
    expect(response.status()).toBe(200);

    //------------------------------------------------------------------------------
    // Create cat
    //------------------------------------------------------------------------------
    const expectedCat = {
      name: "Benny",
      age: 3,
      breed: "Sphinx",
      color: "white",
      weight: 5.5,
      isVaccinated: true,
      birthDate: "2021-01-01",
      _owner: ownerId,
    };

    response = await request.post("/api/cats/", {
      data: expectedCat,
      headers: {
        "auth-token": token,
      },
    });

    expect(response.status()).toBe(201);

    //------------------------------------------------------------------------------
    // Verify we have one product in the test repository
    //------------------------------------------------------------------------------
    response = await request.get("/api/cats/");
    json = await response.json();
    const receivedCat = json[0];

    //console.log(json) // output receivedProduct
    // verify product data
    expect(receivedCat.name).toEqual(expectedCat.name);
    expect(receivedCat.breed).toEqual(expectedCat.breed);

    expect(json).toHaveLength(1);
  });
}
