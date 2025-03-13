import { test, expect } from "@playwright/test";

export default function ownerRegister() {
  test("Valid owner reg info", async ({ request }) => {
    test.setTimeout(10_000);

    // Arange
    const owner = {
      name: "New Owner",
      email: "new@example.com",
      password: "123456",
      phoneNumber: "1234567890",
      address: "123 Main Street, NY",
    };
    // Act
    const response = await request.post("/api/owner/register", { data: owner });
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(200);
    expect(json.error).toEqual(null);
  });

  test("Invalid owner reg info", async ({ request }) => {
    test.setTimeout(10_000);

    // Arange
    const owner = {
      name: "New Owner",
      email: "new@example.com",
      password: "1234",
      phoneNumber: "1234567890",
      address: "123 Main Street, NY",
    };
    // Act
    const response = await request.post("/api/owner/register", { data: owner });
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(400);
    // console.log(json.error);
    expect(json.error).toEqual(
      '"password" length must be at least 6 characters long'
    );
  });
}
