from playwright.sync_api import sync_playwright

def verify_news():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000/news")
            page.wait_for_selector("text=HOA 新闻")
            page.screenshot(path="verification/news_page.png", full_page=True)
            print("Screenshot captured successfully.")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_news()
