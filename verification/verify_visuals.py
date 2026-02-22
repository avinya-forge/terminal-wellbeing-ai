from playwright.sync_api import sync_playwright
import time

def verify_visuals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        print("Scenario 1: Default (No Preference)")
        context = browser.new_context()
        page = context.new_page()
        page.goto("http://localhost:8080/")

        # Take screenshot of skeleton immediately
        page.screenshot(path="verification/skeleton.png")
        print("Captured skeleton.png")

        # Wait for terminal to load (using ID of input which is guaranteed to be there when loaded)
        try:
            page.wait_for_selector("#terminal-input", timeout=5000)
            print("Terminal loaded")
        except:
            print("Terminal failed to load in time")
            page.screenshot(path="verification/failed_load.png")
            context.close()
            return

        # Focus input and take screenshot
        try:
            page.focus("#terminal-input")
            # Brief pause to ensure focus styles are rendered
            time.sleep(0.5)
            page.screenshot(path="verification/terminal_focused.png")
            print("Captured terminal_focused.png")
        except Exception as e:
            print(f"Failed to focus input: {e}")

        # Scenario 2: Reduced Motion
        print("Scenario 2: Reduced Motion")
        context_reduced = browser.new_context(reduced_motion="reduce")
        page_reduced = context_reduced.new_page()
        page_reduced.goto("http://localhost:8080/")

        # Wait for terminal
        try:
            page_reduced.wait_for_selector("#terminal-input", timeout=5000)
            page_reduced.screenshot(path="verification/terminal_reduced_motion.png")
            print("Captured terminal_reduced_motion.png")
        except:
             print("Terminal (reduced motion) failed to load")

        context.close()
        context_reduced.close()
        browser.close()

if __name__ == "__main__":
    verify_visuals()
