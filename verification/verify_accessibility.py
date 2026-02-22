from playwright.sync_api import sync_playwright
import os

def verify_accessibility():
    if not os.path.exists("verification"):
        os.makedirs("verification")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Focus Indicators
        print("Verifying Focus Indicators...")
        context = browser.new_context()
        page = context.new_page()
        page.goto("http://localhost:8080")

        # Wait for input to be enabled
        page.wait_for_selector("input#terminal-input:not([disabled])")

        # Manually focus input
        page.focus("input#terminal-input")

        # Check active element
        active_tag = page.evaluate("document.activeElement.tagName")
        print(f"Active element: {active_tag}")

        # Check outline
        outline = page.evaluate("getComputedStyle(document.activeElement).outline")
        print(f"Active element outline: {outline}")

        # Check color (hsl(120, 40%, 50%) -> rgb(77, 179, 77))
        if "77, 179, 77" in outline:
             print("SUCCESS: Input has correct focus color.")
        else:
             print(f"WARNING: Input focus color mismatch. Expected rgb(77, 179, 77). Got: {outline}")

        page.screenshot(path="verification/focus_indicator.png")
        context.close()

        # 2. Reduced Motion
        print("\nVerifying Reduced Motion...")
        context_reduced = browser.new_context(reduced_motion="reduce")
        page_reduced = context_reduced.new_page()
        page_reduced.goto("http://localhost:8080")

        page_reduced.wait_for_selector("input#terminal-input:not([disabled])")

        # Find the cursor
        cursor = page_reduced.locator("span", has_text="|").last

        if cursor.is_visible():
            animation = cursor.evaluate("el => getComputedStyle(el).animation")
            print(f"Cursor animation style (reduced motion): {animation}")

            if "none" in animation or animation == "":
                print("SUCCESS: Animation disabled.")
            else:
                print(f"FAILURE: Animation might be active: {animation}")
        else:
            print("Cursor not visible.")

        context_reduced.close()
        browser.close()

if __name__ == "__main__":
    verify_accessibility()
