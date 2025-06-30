import { Page, expect } from "@playwright/test";

import { Taskmodel } from "../../../fixtures/task.model";

export class TasksPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async go() {
    await this.page.goto("http://localhost:8080");
  }

  async create(task: Taskmodel) {
    await this.page.fill("#newTask", task.name);
    await this.page.click("button[type='submit']");
  }

  async toggle(taskName: string) {
    await this.page.click(
      `//p[text()='${taskName}']/..//button[contains(@class, 'Toggle')]`
    );
  }

  async shouldHaveText(taskName: string) {
    await expect(
      this.page.locator(`css=.task-item p >> text=${taskName}`)
    ).toBeVisible();
  }

  async alertHaveText(text: string) {
    await expect(this.page.locator(".swal2-html-container")).toHaveText(text);
  }

  async alertRequiredField() {
    expect(
      await this.page
        .locator("#newTask")
        .evaluate((e) => (e as HTMLInputElement).validationMessage)
    ).toEqual("This is a required field");
  }

  async shouldBeDone(taskName: string) {
    await expect(this.page.getByText(taskName)).toHaveCSS(
      "text-decoration-line",
      "line-through"
    );
  }
}
