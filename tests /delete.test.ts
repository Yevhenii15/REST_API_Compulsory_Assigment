import { test, expect } from "@playwright/test";

export default function deleteCatTestCollection() {
  test("Register, login, create cat, verify and delete", async ({
    request,
  }) => {
    test.setTimeout(10_000);

    //------------------------------------------------------------------------------
    // Setup user and login data
    //------------------------------------------------------------------------------
    const ownerReg = {
      name: "Yev Mot",
      email: "user@test.com",
      password: "12345678",
      phoneNumber: "1234567890",
      address: "Green Street",
    };

    const ownerLogin = {
      email: "user@test.com",
      password: "12345678",
    };

    //------------------------------------------------------------------------------
    // Register Owner
    //------------------------------------------------------------------------------
    let response = await request.post("/api/owner/register", {
      data: ownerReg,
    });
    expect(response.status()).toBe(200);

    //------------------------------------------------------------------------------
    // Login Owner
    //------------------------------------------------------------------------------
    response = await request.post("/api/owner/login", {
      data: ownerLogin,
    });
    let json = await response.json();
    const token = json.data.token;
    const ownerId = json.data.ownerId;
    expect(response.status()).toBe(200);

    //------------------------------------------------------------------------------
    // Create Cat
    //------------------------------------------------------------------------------
    const newCat = {
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
      data: newCat,
      headers: {
        "auth-token": token,
      },
    });
    expect(response.status()).toBe(201);

    const createdCat = await response.json();
    const catId = createdCat._id || createdCat.data?._id;
    expect(catId).toBeTruthy();

    //------------------------------------------------------------------------------
    // Verify Cat Exists
    //------------------------------------------------------------------------------
    response = await request.get("/api/cats/", {
      headers: {
        "auth-token": token,
      },
    });
    json = await response.json();
    expect(json).toHaveLength(1);
    expect(json[0].name).toEqual(newCat.name);

    //------------------------------------------------------------------------------
    // Delete Cat
    //------------------------------------------------------------------------------
    response = await request.delete(`/api/cats/${catId}`, {
      headers: {
        "auth-token": token,
      },
    });
    expect(response.status()).toBe(200);
    json = await response.json();
    expect(json.message).toBe("Cat was successfully deleted.");

    //------------------------------------------------------------------------------
    // Verify Cat Is Deleted
    //------------------------------------------------------------------------------
    response = await request.get("/api/cats/", {
      headers: {
        "auth-token": token,
      },
    });
    json = await response.json();
    expect(json).toHaveLength(0);
  });
}
