import { test, expect } from "@playwright/test";

const USERNAME = "user1@example.com";
const PASSWORD = "password";

test("user can log in", async ({ page }) => {
  await page.goto("/auth/login");
  await page.waitForLoadState("networkidle");
  await page.getByTestId("login-email").fill(USERNAME);
  await page.getByTestId("login-password").fill(PASSWORD);
  await page.getByTestId("login-submit").click();

  await page.waitForURL(/\/$/);

  await expect(page).toHaveURL("http://localhost:3000/");

  await expect(
    page.getByRole("alert").getByText("Logged In Succesfully", { exact: true }),
  ).toBeVisible({ timeout: 5000 });
});
