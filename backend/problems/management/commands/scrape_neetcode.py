import logging
from django.core.management.base import BaseCommand
from problems.models import Problem, TestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import (
    NoSuchElementException,
    WebDriverException,
    TimeoutException
)
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import random

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(
    filename='scrape_neetcode_single.log',
    filemode='a',
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

class Command(BaseCommand):
    help = 'Scrape a single NeetCode problem based on a fixed slug.'

    def add_arguments(self, parser):
        parser.add_argument('slug', type=str, help='The slug of the NeetCode problem to scrape.')

    def handle(self, *args, **kwargs):
        slug = kwargs['slug']
        url = f'https://neetcode.io/problems/{slug}'

        # Configure WebDriver
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Enable headless mode; comment out for debugging
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument(
            'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.70 Safari/537.36'
        )

        try:
            # Initialize ChromeDriver with WebDriver Manager
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)

            wait = WebDriverWait(driver, 20)  # Increased wait time for dynamic content

            logger.info(f"Navigating to {url}.")
            self.stdout.write(self.style.NOTICE(f"Navigating to {url}."))
            driver.get(url)

            # Wait for the main content to load
            try:
                wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'ul.tabs-list')))
            except TimeoutException:
                logger.warning("Timed out waiting for the tabs to load.")
                self.stdout.write(self.style.WARNING("Timed out waiting for the tabs to load."))

            # 1. Extract Title and Description from Question Tab
            try:
                # Click on the 'Question' tab if not already active
                question_tab = driver.find_element(By.XPATH, "//span[text()='Question']")
                parent_li = question_tab.find_element(By.XPATH, "./ancestor::li")
                if 'my-active-tab' not in parent_li.get_attribute('class'):
                    question_tab.click()
                    logger.info("Switched to 'Question' tab.")
                    self.stdout.write(self.style.SUCCESS("Switched to 'Question' tab."))
                    time.sleep(2)  # Wait for the content to load

                # Extract Problem Title
                try:
                    title_element = driver.find_element(By.CSS_SELECTOR, 'h1')  # Adjust selector if needed
                    problem_title = title_element.text.strip()
                    logger.info(f"Problem title extracted: {problem_title}")
                    self.stdout.write(self.style.SUCCESS(f"Problem title extracted: {problem_title}"))
                except NoSuchElementException:
                    problem_title = 'Unknown Title'
                    logger.warning("Problem title not found.")
                    self.stdout.write(self.style.WARNING("Problem title not found."))

                # Extract Description (including test cases)
                try:
                    description_container = driver.find_element(By.CLASS_NAME, 'my-article-component-container')
                    
                    # Extract both <p> and <pre> tags within the description
                    description_elements = description_container.find_elements(By.XPATH, './/p | .//pre')
                    description = "\n".join([elem.text.strip() for elem in description_elements if elem.text.strip()])
                    
                    logger.info("Problem description extracted.")
                    self.stdout.write(self.style.SUCCESS("Problem description extracted."))
                except NoSuchElementException:
                    description = ""
                    logger.warning("Problem description not found.")
                    self.stdout.write(self.style.WARNING("Problem description not found."))

            except NoSuchElementException:
                logger.warning("'Question' tab not found.")
                self.stdout.write(self.style.WARNING("'Question' tab not found."))
                problem_title = 'Unknown Title'
                description = ''

            # 2. Extract Solutions from Solution Tab
            try:
                # Click on the 'Solution' tab
                solution_tab = driver.find_element(By.XPATH, "//span[text()='Solution']")
                parent_li = solution_tab.find_element(By.XPATH, "./ancestor::li")
                if 'my-active-tab' not in parent_li.get_attribute('class'):
                    solution_tab.click()
                    logger.info("Switched to 'Solution' tab.")
                    self.stdout.write(self.style.SUCCESS("Switched to 'Solution' tab."))
                    time.sleep(2)  # Wait for the content to load
            except NoSuchElementException:
                logger.warning("'Solution' tab not found.")
                self.stdout.write(self.style.WARNING("'Solution' tab not found."))

            # Extract Solutions
            solution_texts = []
            try:
                # Locate all code-toolbar divs which contain solutions
                solution_sections = driver.find_elements(By.CLASS_NAME, 'code-toolbar')
                if not solution_sections:
                    logger.warning("No solution sections found.")
                    self.stdout.write(self.style.WARNING("No solution sections found."))
                for toolbar in solution_sections:
                    try:
                        pre_elements = toolbar.find_elements(By.TAG_NAME, 'pre')
                        for pre in pre_elements:
                            language_class = pre.get_attribute('class')  # e.g., 'language-python'
                            if 'language-' in language_class:
                                language = language_class.split('language-')[-1].capitalize()
                                code_element = pre.find_element(By.TAG_NAME, 'code')
                                code_text = code_element.text.strip()
                                solution_texts.append(f"{language} Solution:\n{code_text}")
                                logger.info(f"Extracted {language} solution.")
                                self.stdout.write(self.style.SUCCESS(f"Extracted {language} solution."))
                    except NoSuchElementException:
                        logger.warning("Code element not found within a solution section.")
            except NoSuchElementException:
                logger.warning("No solution sections found.")
                self.stdout.write(self.style.WARNING("No solution sections found."))

            # Concatenate all solutions
            solution = "\n\n".join(solution_texts)

            # Create or update the Problem instance
            problem, created = Problem.objects.update_or_create(
                slug=slug,
                defaults={
                    'title': problem_title,
                    'description': description,
                    'difficulty': 'easy',  # Adjust if you can extract difficulty
                    'solution': solution,
                }
            )

            logger.info(f"{'Created' if created else 'Updated'} Problem: {problem_title}")
            self.stdout.write(self.style.SUCCESS(f"{'Created' if created else 'Updated'} Problem: {problem_title}"))

            logger.info("Scraping completed successfully.")
            self.stdout.write(self.style.SUCCESS('Scraping completed successfully.'))

        except WebDriverException as e:
            logger.error(f"WebDriverException occurred: {e}")
            self.stderr.write(self.style.ERROR(f"WebDriverException: {e}"))
        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            self.stderr.write(self.style.ERROR(f"An unexpected error occurred: {e}"))
        finally:
            try:
                driver.quit()
                logger.info("ChromeDriver has been closed.")
            except Exception as e:
                logger.error(f"Error while closing ChromeDriver: {e}")
