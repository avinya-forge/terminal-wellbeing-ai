from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Wait for terminal input
        page.wait_for_selector(".terminal-input")

        # 1. Set speed to fast
        page.fill(".terminal-input", "/profile speed fast")
        page.press(".terminal-input", "Enter")

        # Verify response
        try:
            page.wait_for_selector("text=Profile updated. I will respond at fast speed.", timeout=5000)
            print("Successfully set speed to fast.")
        except Exception as e:
            print(f"Failed to set speed: {e}")
            page.screenshot(path="verification/error_set_speed.png")
            return

        # 2. View profile
        page.fill(".terminal-input", "/profile view")
        page.press(".terminal-input", "Enter")

        # Verify details
        try:
            page.wait_for_selector("text=Speed: fast", timeout=5000)
            print("Successfully verified profile update.")
        except Exception as e:
            print(f"Failed to view profile: {e}")
            page.screenshot(path="verification/error_view_profile.png")
            return

        # Take final screenshot
        page.screenshot(path="verification/profile_speed.png", full_page=True)
        browser.close()

if __name__ == "__main__":
    run()
