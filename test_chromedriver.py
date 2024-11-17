from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

def test_chromedriver():
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # Run in headless mode (no GUI)
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument(
        'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.70 Safari/537.36'
    )

    # Initialize ChromeDriver (no need to specify the path if it's in PATH)
    driver = webdriver.Chrome(options=chrome_options)

    try:
        # Navigate to a website
        driver.get('https://www.google.com')

        # Print the title of the page
        print(driver.title)
    finally:
        # Close the browser
        driver.quit()

if __name__ == "__main__":
    test_chromedriver()

