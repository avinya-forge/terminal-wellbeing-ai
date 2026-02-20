from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        print("Navigating to app...")
        try:
            page.goto("http://localhost:3000")
        except Exception as e:
            print(f"Error navigating: {e}")
            return

        # Wait for terminal input to be visible
        input_selector = "input[type='text']"
        try:
            page.wait_for_selector(input_selector, timeout=10000)
        except Exception as e:
            print(f"Input not found: {e}")
            page.screenshot(path="verification_error.png")
            return

        print("App loaded. Sending command...")
        # Type command
        page.fill(input_selector, "/profile warnings anxiety, depression")
        page.press(input_selector, "Enter")

        time.sleep(2) # Wait for processing

        # Type command to verify
        page.fill(input_selector, "/profile")
        page.press(input_selector, "Enter")

        time.sleep(2) # Wait for output

        # Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification_profile.png")

        browser.close()

if __name__ == "__main__":
    run()
