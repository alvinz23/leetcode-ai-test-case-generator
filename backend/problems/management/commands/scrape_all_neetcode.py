import logging
from django.core.management.base import BaseCommand
from django.conf import settings  # Import settings to access BASE_DIR
import os
from subprocess import call
import time
import random

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(
    filename='scrape_all_neetcode.log',
    filemode='a',
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

class Command(BaseCommand):
    help = 'Scrape all NeetCode problems listed in slugs.txt.'

    def handle(self, *args, **kwargs):
        # Use BASE_DIR to locate slugs.txt in backend/
        slugs_file = os.path.join(settings.BASE_DIR, 'slugs.txt')
        if not os.path.exists(slugs_file):
            logger.error("slugs.txt file not found at %s.", slugs_file)
            self.stdout.write(self.style.ERROR("slugs.txt file not found."))
            return

        with open(slugs_file, 'r') as f:
            slugs = [line.strip() for line in f if line.strip()]

        total_slugs = len(slugs)
        logger.info(f"Starting to scrape {total_slugs} problems.")
        self.stdout.write(self.style.NOTICE(f"Starting to scrape {total_slugs} problems."))

        for idx, slug in enumerate(slugs, start=1):
            logger.info(f"Scraping problem {idx}/{total_slugs}: {slug}")
            self.stdout.write(self.style.NOTICE(f"Scraping problem {idx}/{total_slugs}: {slug}"))
            # Call the single scraper command
            call(['python', 'manage.py', 'scrape_neetcode', slug])
            # Optional: Add a delay to prevent overwhelming the server
            sleep_time = random.uniform(2, 5)  # Random delay between 2 to 5 seconds
            logger.info(f"Sleeping for {sleep_time:.2f} seconds to prevent server overload.")
            self.stdout.write(self.style.NOTICE(f"Sleeping for {sleep_time:.2f} seconds."))
            time.sleep(sleep_time)

        logger.info("Completed scraping all problems.")
        self.stdout.write(self.style.SUCCESS("Completed scraping all problems."))
