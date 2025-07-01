import { deleteTaskByHelper, postTask } from "./helpers";

import { Taskmodel } from "./fixtures/task.model";
import { TasksPage } from "../e2e/support/pages/tasks";
import data from "./fixtures/tasks.json";
import test from "@playwright/test";

let tasksPage: TasksPage;

type TaskKey = "success" | "duplicate" | "required" | "update" | "delete";

const task: Record<TaskKey, Taskmodel> = {
  success: data.success as Taskmodel,
  duplicate: data.duplicate as Taskmodel,
  required: data.required as Taskmodel,
  update: data.update as Taskmodel,
  delete: data.delete as Taskmodel,
};

test.beforeEach(async ({ page, request }) => {
  tasksPage = new TasksPage(page);

  for (const t of Object.values(task)) {
    await deleteTaskByHelper(request, t.name);
  }

  await tasksPage.go();
});

test.describe("cadastro", () => {
  test("deve poder cadastrar uma nova tarefa", async ({}) => {
    await tasksPage.create(task.success);
    await tasksPage.shouldHaveText(task.success.name);
  });

  test("nao deve permitir tarefa duplicada", async ({ request }) => {
    await postTask(request, task.duplicate);

    await tasksPage.create(task.duplicate);
    await tasksPage.alertHaveText("Task already exists!");
  });

  test("campo obrigatorio", async ({}) => {
    await tasksPage.create(task.required);
    await tasksPage.alertRequiredField();
  });
});

test.describe("atualização", () => {
  test("deve concluir uma tarefa", async ({ request }) => {
    await postTask(request, task.update);

    await tasksPage.toggle(task.update.name);
    await tasksPage.shouldBeDone(task.update.name);
  });
});

test.describe("exclusão", () => {
  test("deve excluir uma tarefa", async ({ request }) => {
    await postTask(request, task.delete);

    await tasksPage.remove(task.delete.name);
    await tasksPage.shouldNotExist(task.delete.name);
  });
});
