from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch()
            page = browser.new_page()
            print("Navigating to http://localhost:3000")
            page.goto("http://localhost:3000")

            # Wait for terminal to be ready (input enabled)
            print("Waiting for terminal input...")
            try:
                page.wait_for_selector("input.terminal-input:not([disabled])", timeout=20000)
            except Exception as e:
                print("Timeout waiting for input. Taking debug screenshot.")
                page.screenshot(path="verification/debug_timeout.png")
                raise e

            # Type command
            print("Typing command...")
            page.fill("input.terminal-input", "/profile view")
            page.press("input.terminal-input", "Enter")

            # Wait for response
            time.sleep(2) # Simple wait for response to render

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification/verification.png")
            browser.close()
        except Exception as e:
            print(f"Error: {e}")
            raise e

if __name__ == "__main__":
    run()
