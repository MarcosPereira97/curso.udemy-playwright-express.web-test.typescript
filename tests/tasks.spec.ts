import test, { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("deve poder cadastrar uma nova tarefa", async ({ page, request }) => {
  const newTask = "Fazer Café";
  await request.delete(`http://localhost:3333/helper/tasks/${newTask}`);

  await page.fill("#newTask", newTask);
  await page.click("button[type='submit']");
  await expect(page.getByText(newTask)).toBeVisible();
});

test("nao deve permitir tarefa duplicada", async ({ page, request }) => {
  const duplicateTask = {
    name: "Comprar Ketchup",
    is_done: false,
  };

  expect(
    await request.post("http://localhost:3333/tasks", {
      data: duplicateTask,
    })
  ).toBeTruthy();

  await page.fill("#newTask", duplicateTask.name);
  await page.click("button[type='submit']");

  await expect(page.locator(".swal2-html-container")).toHaveText(
    "Task already exists!"
  );
});
