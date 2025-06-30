import { deleteTaskByHelper, postTask } from "./support/helpers";

import { Taskmodel } from "./fixtures/task.model";
import { TasksPage } from "./support/pages/tasks";
import data from "./fixtures/tasks.json";
import test from "@playwright/test";

test.describe("cadastro", () => {
  test("deve poder cadastrar uma nova tarefa", async ({ page, request }) => {
    const task = data.success as Taskmodel;

    await deleteTaskByHelper(request, task.name);

    const tasksPage: TasksPage = new TasksPage(page);

    await tasksPage.go();
    await tasksPage.create(task);
    await tasksPage.shouldHaveText(task.name);
  });

  test("nao deve permitir tarefa duplicada", async ({ page, request }) => {
    const task = data.duplicate as Taskmodel;

    await deleteTaskByHelper(request, task.name);

    const tasksPage: TasksPage = new TasksPage(page);

    await tasksPage.go();
    await postTask(request, task);
    await tasksPage.create(task);
    await tasksPage.alertHaveText("Task already exists!");
  });

  test("campo obrigatorio", async ({ page }) => {
    const task = data.required as Taskmodel;

    const tasksPage: TasksPage = new TasksPage(page);

    await tasksPage.go();
    await tasksPage.create(task);
    await tasksPage.alertRequiredField();
  });
});

test.describe("atualização", () => {
  test("deve concluir uma tarefa", async ({ page, request }) => {
    const task = data.update as Taskmodel;

    await deleteTaskByHelper(request, task.name);
    await postTask(request, task);

    const tasksPage: TasksPage = new TasksPage(page);

    await tasksPage.go();
    await tasksPage.toggle(task.name);
    await tasksPage.shouldBeDone(task.name);
  });
});
