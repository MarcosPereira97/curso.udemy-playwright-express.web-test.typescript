import { APIRequestContext, expect } from "@playwright/test";

import { Taskmodel } from "./fixtures/task.model";

require("dotenv").config();

const BASE_API = process.env.BASE_API;

export async function deleteTaskByHelper(
  request: APIRequestContext,
  text: string
) {
  await request.delete(`${BASE_API}/helper/tasks/${text}`);
}

export async function postTask(request: APIRequestContext, text: Taskmodel) {
  expect(
    await request.post(`${BASE_API}/tasks`, {
      data: text,
    })
  ).toBeTruthy();
}
