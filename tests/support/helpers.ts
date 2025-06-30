import { APIRequestContext, expect } from "@playwright/test";

import { Taskmodel } from "../fixtures/task.model";

export async function deleteTaskByHelper(
  request: APIRequestContext,
  text: string
) {
  await request.delete(`http://localhost:3333/helper/tasks/${text}`);
}

export async function postTask(request: APIRequestContext, text: Taskmodel) {
  expect(
    await request.post("http://localhost:3333/tasks", {
      data: text,
    })
  ).toBeTruthy();
}
