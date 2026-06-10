import { test, expect, type Locator, type Page } from "@playwright/test";

test.describe("Lifecycle reflection recommendations", () => {
  test.beforeEach(async ({ page }) => {
    await openProblemDefinitionReflection(page);
  });

  test("hides tool recommendations when user is happy with their answer", async ({
    page,
  }) => {
    const main = page.locator("main");

    await fillReflectionAnswer(main, "This is my E2E reflection answer.");
    await selectHappyWithAnswer(main);
    await saveReflectionAnswer(main);

    await expect(getVisibleRecommendedTools(main)).toHaveCount(0);
  });

  test("shows tool recommendations when user requests recommendations", async ({
    page,
  }) => {
    const main = page.locator("main");

    await requestRecommendations(main);

    await expect(getVisibleRecommendedTools(main)).toHaveCount(1);
  });

  test("updates recommendation progress when checking and unchecking a tool", async ({
    page,
  }) => {
    const main = page.locator("main");

    await requestRecommendations(main);

    const progress = main.getByRole("progressbar").filter({ visible: true });
    await expect(progress).toHaveAttribute("aria-valuenow", "0");

    const firstToolCheckbox = main
      .getByRole("checkbox", { name: /completed/i })
      .filter({ visible: true })
      .first();

    await firstToolCheckbox.click();

    await expect(firstToolCheckbox).toBeChecked();
    await expect(progress).not.toHaveAttribute("aria-valuenow", "0");

    await firstToolCheckbox.click();

    await expect(firstToolCheckbox).not.toBeChecked();
    await expect(progress).toHaveAttribute("aria-valuenow", "0");
  });

  test("saves a further reflection answer after recommendations are shown", async ({
    page,
  }) => {
    const main = page.locator("main");

    await requestRecommendations(main);

    await expect(
      main.getByRole("heading", { name: /further reflection/i }),
    ).toBeVisible();

    await main
      .getByRole("textbox")
      .filter({ visible: true })
      .last()
      .fill("This is my E2E further reflection answer.");

    await saveFurtherReflectionAnswer(main);

    await expect(
      page
        .getByRole("alert")
        .filter({ hasText: "The form has been submitted." }),
    ).toHaveCount(1);
  });

  test("opens a PDF preview for the saved reflection answer", async ({
    page,
  }) => {
    const main = page.locator("main");

    await requestRecommendations(main);

    const pdfResponsePromise = page.waitForResponse((response) => {
      const contentType = response.headers()["content-type"] ?? "";

      return (
        response.status() === 200 && contentType.includes("application/pdf")
      );
    });

    await main.getByRole("button", { name: /see preview/i }).click();

    const pdfResponse = await pdfResponsePromise;
    const contentType = pdfResponse.headers()["content-type"] ?? "";

    expect(contentType).toContain("application/pdf");
  });

  test("shows a completed icon for the reflection after reflection and further reflection are saved", async ({
    page,
  }) => {
    const main = page.locator("main");

    await requestRecommendations(main);

    await main
      .getByRole("textbox")
      .filter({ visible: true })
      .last()
      .fill("This is my E2E further reflection answer.");

    await saveFurtherReflectionAnswer(main);

    await page.getByRole("button", { name: /phases/i }).click();

    const drawer = page.getByRole("dialog", { name: /ELSA Journal/i });
    await expect(drawer).toBeVisible();

    const reflectionItem = drawer.getByRole("treeitem", {
      name: /^Problem Definition$/,
    });

    await expect(reflectionItem).toBeVisible();

    await expect(reflectionItem.locator(".i-lucide\\:check")).toBeVisible();
  });
});

async function closePhasesDrawer(page: Page) {
  const drawer = page.getByRole("dialog", { name: /ELSA Journal/i });

  if (await drawer.isVisible().catch(() => false)) {
    await drawer.getByRole("button", { name: /^Close$/ }).click();
    await expect(drawer).toBeHidden();
  }
}

async function openProblemDefinitionReflection(page: Page) {
  await page.goto("/lifecycles");
  await page.waitForLoadState("networkidle");

  await page.getByRole("link", { name: /start/i }).first().click();
  await page.waitForLoadState("networkidle");

  await closePhasesDrawer(page);

  const main = page.locator("main");

  await main.getByRole("button", { name: /^Problem Definition$/ }).click();

  await expect(
    main.getByRole("heading", { name: /^Problem Definition$/ }),
  ).toBeVisible();

  await closePhasesDrawer(page);

  await expect(
    main.getByRole("textbox").filter({ visible: true }).first(),
  ).toBeVisible();
}

async function requestRecommendations(main: Locator) {
  await fillReflectionAnswer(main, "This is my E2E reflection answer.");
  await selectRecommendationRequest(main);
  await saveReflectionAnswer(main);

  await expect(getVisibleRecommendedTools(main)).toHaveCount(1);
}

async function fillReflectionAnswer(main: Locator, answer: string) {
  await main
    .getByRole("textbox")
    .filter({ visible: true })
    .first()
    .fill(answer);
}

async function selectHappyWithAnswer(main: Locator) {
  await main
    .getByRole("radio", { name: "I'm happy with my answer" })
    .filter({ visible: true })
    .click();
}

async function selectRecommendationRequest(main: Locator) {
  await main
    .getByRole("radio", {
      name: "I'd like some recommendations to reflect on this further",
    })
    .filter({ visible: true })
    .click();
}

async function saveReflectionAnswer(main: Locator) {
  await main
    .getByRole("button", { name: /^Save$/ })
    .filter({ visible: true })
    .first()
    .click();
}

async function saveFurtherReflectionAnswer(main: Locator) {
  await main
    .getByRole("button", { name: /^Save$/ })
    .filter({ visible: true })
    .last()
    .click();
}

function getVisibleRecommendedTools(main: Locator) {
  return main.getByText("Recommended Tools").filter({ visible: true });
}
