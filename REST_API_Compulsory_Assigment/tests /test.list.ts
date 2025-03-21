process.env.NODE_ENV = "test";

import { test } from "@playwright/test";

import health from "./health.test";
import ownerRegister from "./owner.test";

import { ownerModel } from "../src/models/ownerModel";
import { catModel } from "../src/models/catModel";

import dotenvFlow from "dotenv-flow";
import { connect, disconnect } from "../src/db/database";
dotenvFlow.config();

function setup() {
  // beforeEach clear database
  test.beforeEach(async () => {
    try {
      await connect();
      await ownerModel.deleteMany({});
      await catModel.deleteMany({});
    } finally {
      await disconnect();
    }
  });
  // afterAll clear database
  test.afterAll(async () => {
    try {
      await connect();
      await ownerModel.deleteMany({});
      await catModel.deleteMany({});
    } finally {
      await disconnect();
    }
  });
}

setup();

test.describe(health);
test.describe(ownerRegister);
