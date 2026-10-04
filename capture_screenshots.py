import os
import time
from playwright.sync_api import sync_playwright

def capture_readme_studio():
    output_dir = os.path.join(os.getcwd(), 'public', 'screenshots')
    os.makedirs(output_dir, exist_ok=True)

    print('Launching Playwright Chromium browser for README Studio...')
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1440, 'height': 900},
            device_scale_factor=2,  # Retina high-DPI for crisp README imagery
            color_scheme='dark'
        )
        page = context.new_page()

        # 1. Landing Page - Hero & Live Search
        print('1. Capturing Landing Page Hero...')
        page.goto('http://localhost:3000/', wait_until='networkidle')
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(output_dir, '01_landing_hero.png'))

        # 2. Landing Page - Interactive Sandbox (Preview Mode)
        print('2. Capturing Interactive Sandbox Preview...')
        sandbox_el = page.locator('#sandbox')
        if sandbox_el.count() > 0:
            sandbox_el.scroll_into_view_if_needed()
            page.wait_for_timeout(800)
            page.screenshot(path=os.path.join(output_dir, '02_live_sandbox_preview.png'))

            # 3. Landing Page - Sandbox Language DNA Tab
            print('3. Capturing Sandbox Language DNA...')
            dna_tab = page.locator('button:has-text("DNA"), button:has-text("شريط DNA")').first
            if dna_tab.count() > 0:
                dna_tab.click()
                page.wait_for_timeout(600)
                page.screenshot(path=os.path.join(output_dir, '03_live_sandbox_dna.png'))

        # 4. Landing Page - Gemini 3.8 Flash Bio Tone Engine
        print('4. Capturing Gemini Bio Tone Engine...')
        tone_el = page.locator('#tone-engine')
        if tone_el.count() > 0:
            tone_el.scroll_into_view_if_needed()
            page.wait_for_timeout(600)
            page.screenshot(path=os.path.join(output_dir, '04_gemini_bio_engine.png'))

        # 5. Landing Page - Creator Spotlight (Bavly Hamdy)
        print('5. Capturing Creator Spotlight & Repos...')
        creator_el = page.locator('#creator-profile')
        if creator_el.count() > 0:
            creator_el.scroll_into_view_if_needed()
            page.wait_for_timeout(600)
            page.screenshot(path=os.path.join(output_dir, '05_creator_spotlight.png'))

        # 6. README Studio Builder View
        print('6. Capturing Studio Builder View...')
        page.evaluate("""() => {
            localStorage.setItem('readme_studio_view', 'builder');
            localStorage.setItem('readme_studio_active_user', 'Bavly-Hamdy');
        }""")
        page.reload(wait_until='networkidle')
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(output_dir, '06_studio_builder.png'))

        # 7. Publish Modal in Builder
        print('7. Capturing 1-Click Atomic Publish Modal...')
        pub_btn = page.locator('button:has-text("Publish to GitHub"), button:has-text("نشر إلى GitHub")').first
        if pub_btn.count() > 0:
            pub_btn.click()
            page.wait_for_timeout(800)
            page.screenshot(path=os.path.join(output_dir, '07_publish_modal.png'))
            page.keyboard.press('Escape')
            page.wait_for_timeout(400)

        # 8. Deep Analytics Dashboard View
        print('8. Capturing Analytics Dashboard...')
        page.evaluate("""() => {
            localStorage.setItem('readme_studio_view', 'analytics');
        }""")
        page.reload(wait_until='networkidle')
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(output_dir, '08_analytics_dashboard.png'))

        browser.close()
        print('All 8 high-res screenshots captured successfully in public/screenshots/ !')

if __name__ == '__main__':
    capture_readme_studio()
