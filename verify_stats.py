import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to app...")
        page.goto("http://localhost:8080/")

        # Wait for terminal to load
        print("Waiting for terminal...")
        page.wait_for_selector(".terminal-container", timeout=10000)

        # Type some messages to generate stats
        print("Typing messages...")
        input_box = page.locator("input[type='text']")

        # Initial greeting wait
        time.sleep(2)

        input_box.fill("Hello")
        input_box.press("Enter")
        time.sleep(1) # Wait for bot response

        input_box.fill("I feel great today")
        input_box.press("Enter")
        time.sleep(1)

        # Type /stats
        print("Running /stats command...")
        input_box.fill("/stats")
        input_box.press("Enter")

        # Wait for stats output
        time.sleep(10)

        # Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="stats_verification.png")

        browser.close()

if __name__ == "__main__":
    run()
