import { test, expect } from "@playwright/test";

export default function adoptCatTestCollection() {
  test("Adopt a cat", async ({ request }) => {
    test.setTimeout(10_000);

    // ------------------------------------------------------------------------------
    // Register and Login Owner A (initial cat creator)
    // ------------------------------------------------------------------------------
    const ownerA = {
      name: "Owner A",
      email: "ownerA@test.com",
      password: "password123",
      phoneNumber: "353536463",
      address: "Green Street",
    };

    let response = await request.post("/api/owner/register", {
      data: ownerA,
    });
    expect(response.status()).toBe(200);

    response = await request.post("/api/owner/login", {
      data: {
        email: ownerA.email,
        password: ownerA.password,
      },
    });
    let json = await response.json();
    const tokenA = json.data.token;
    const ownerAId = json.data.ownerId;
    expect(response.status()).toBe(200);

    // ------------------------------------------------------------------------------
    // Create a cat with Owner A
    // ------------------------------------------------------------------------------
    const cat = {
      name: "Adoptable Cat",
      age: 2,
      breed: "Maine Coon",
      color: "brown",
      weight: 6.0,
      isVaccinated: true,
      birthDate: "2022-05-01",
    };

    response = await request.post("/api/cats", {
      data: cat,
      headers: {
        "auth-token": tokenA,
      },
    });
    expect(response.status()).toBe(201);
    const createdCat = await response.json();
    const catId = createdCat._id || createdCat.data?._id;
    expect(catId).toBeTruthy();

    // ------------------------------------------------------------------------------
    // Register and Login Owner B (who will adopt the cat)
    // ------------------------------------------------------------------------------
    const ownerB = {
      name: "Owner B",
      email: "ownerB@test.com",
      password: "password456",
      phoneNumber: "399484847",
      address: "Blue Avenue",
    };

    response = await request.post("/api/owner/register", {
      data: ownerB,
    });
    expect(response.status()).toBe(200);

    response = await request.post("/api/owner/login", {
      data: {
        email: ownerB.email,
        password: ownerB.password,
      },
    });
    json = await response.json();
    const tokenB = json.data.token;
    const ownerBId = json.data.ownerId;
    expect(response.status()).toBe(200);

    // ------------------------------------------------------------------------------
    // Owner B adopts (or transfers) the cat
    // ------------------------------------------------------------------------------
    response = await request.put(`/api/cats/adopt/${catId}`, {
      data: {
        ownerId: ownerBId,
      },
      headers: {
        "auth-token": tokenB,
      },
    });
    expect(response.status()).toBe(200);
    json = await response.json();

    // Accept both messages
    expect([
      "Cat adopted successfully.",
      "Ownership transferred successfully.",
    ]).toContain(json.message);
    expect(json.cat._owner).toBe(ownerBId);
  });
}
