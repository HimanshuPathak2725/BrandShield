import sqlite3
import json
import os
import random
import time
from datetime import datetime, timedelta

# Configuration
# Path relative to project root, assuming this file is in services/
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'brandshield.db')

TEMPLATES_NEGATIVE = [
    "I can't believe {brand} creates such a mess with {keyword}. #fail",
    "Seriously disappointed with {brand}. The {keyword} issue is unacceptable.",
    "Why is {brand} ignoring the {keyword} problem? It's been days!",
    "Switching to {competitor} because {brand} just can't handle {keyword}.",
    "Data leak at {brand}? This is scary. #{keyword}",
    "Service outage again for {brand}. #outage #{keyword}",
    "Hidden fees on my {brand} bill. Check your statements! #{keyword}",
    "Worst support experience ever with {brand} regarding {keyword}.",
    "Is {brand} down for everyone or just me? #{keyword}",
    "The {keyword} situation with {brand} is getting worse by the hour.",
    "Thinking of cancelling {brand} after seeing what happened with {keyword}.",
    "Hey {brand}, silence on the {keyword} issue is not a strategy.",
    "Avoid {brand} at all costs. {keyword} is broken.",
    "{brand} support has been useless with the {keyword} glitch.",
    "Security warning: {brand} exposed due to {keyword} vulnerability."
]

TEMPLATES_NEUTRAL = [
    "Just noticed {brand} updated their terms regarding {keyword}.",
    "Anyone else using {brand} for {keyword}?",
    "Comparing {brand} vs {competitor} for {keyword} needs.",
    "News: {brand} announces changes to {keyword} policy.",
    "Stock price for {brand} steady despite {keyword} rumors.",
    "Exploring features of {brand} today.",
    "Thinking about {keyword} and how {brand} handles it.",
    "Does {brand} support {keyword} in the new region?",
    "Reviewing my {brand} subscription based on {keyword}.",
    "Discussion: Impact of {keyword} on {brand}'s roadmap."
]

TEMPLATES_POSITIVE = [
    "Honestly {brand} handles {keyword} better than anyone else.",
    "Love the new update from {brand}! #{keyword}",
    "Kudos to {brand} support team for fixing my {keyword} issue.",
    "Switching from {competitor} to {brand} was the best decision.",
    "{brand} is leading the industry in {keyword} innovation.",
    "Great experience with {brand} today.",
    "Finally a company like {brand} that gets {keyword} right.",
    "Just upgraded my {brand} account for better {keyword} tools.",
    "Thanks {brand} for listening to community feedback on {keyword}.",
    "Impressed by the speed of {brand} with {keyword}."
]

def get_db_connection():
    if not os.path.exists(os.path.dirname(DB_PATH)):
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def wipe_data(conn):
    print("🧹 Wiping existing posts data...")
    cur = conn.cursor()
    # Check if posts table exists first
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='posts'")
    if cur.fetchone():
        cur.execute("DELETE FROM posts")
        conn.commit()
        print("✅ Data wiped.")
    else:
        print("⚠️ Posts table not found, skipping wipe.")

def generate_synthetic_posts(brand_config, num_posts=800):
    """
    Generates synthetic posts based on brand configuration.
    brand_config dict keys: 'brandName', 'keywords', 'competitors'
    """
    brand = brand_config.get('brandName', 'BrandShield')
    
    keywords = brand_config.get('keywords', [])
    if isinstance(keywords, str):
        # Handle comma-separated string if passed that way
        keywords = [k.strip() for k in keywords.split(',')]
    
    competitors = brand_config.get('competitors', [])
    if isinstance(competitors, str):
         competitors = [c.strip() for c in competitors.split(',')]
        
    if not keywords:
        keywords = ["service", "product", "quality", "dashboard", "api", "login"]
    if not competitors:
        competitors = ["CompetitorX", "GenericBrand", "OldVendor"]

    print(f"factory: Generating data for {brand}")
    
    posts = []
    end_time = datetime.now()
    
    for i in range(num_posts):
        # Determine sentiment (Crisis = 80% negative)
        r = random.random()
        if r < 0.80:
            sentiment_type = "NEGATIVE"
            template = random.choice(TEMPLATES_NEGATIVE)
            score = random.uniform(-0.95, -0.4)
        elif r < 0.90:
            sentiment_type = "NEUTRAL"
            template = random.choice(TEMPLATES_NEUTRAL)
            score = random.uniform(-0.2, 0.2)
        else:
            sentiment_type = "POSITIVE"
            template = random.choice(TEMPLATES_POSITIVE)
            score = random.uniform(0.4, 0.95)

        # Fill template
        filled_text = template.format(
            brand=brand,
            keyword=random.choice(keywords),
            competitor=random.choice(competitors)
        )

        # Time distribution
        time_seed = random.random()
        if time_seed < 0.5:
             minutes_back = random.randint(0, 360) # Last 6 hours
        elif time_seed < 0.8:
             minutes_back = random.randint(360, 1440) # 6 to 24 hours
        else:
             minutes_back = random.randint(1440, 2880) # 24 to 48 hours

        timestamp = end_time - timedelta(minutes=minutes_back)

        # Engagement
        engagement = int(random.expovariate(1/50))
        if sentiment_type == "NEGATIVE" and random.random() < 0.10:
            engagement += random.randint(1000, 8000)
            filled_text = "🚨 VIRAL: " + filled_text

        post = {
            'platform': random.choice(['Twitter', 'Reddit', 'News', 'Facebook', 'LinkedIn']),
            'text': filled_text,
            'author': f"user_{random.randint(1000, 9999)}",
            'timestamp': timestamp.isoformat(),
            'url': f"https://social.mock/{random.randint(100000, 999999)}",
            'engagement': engagement,
            'sentiment': json.dumps({"label": sentiment_type, "score": score}),
            'sentiment_score': score
        }
        posts.append(post)
    
    posts.sort(key=lambda x: x['timestamp'])
    return posts

def save_posts_to_db(conn, posts):
    print(f"💾 Saving {len(posts)} posts to database...")
    cur = conn.cursor()
    
    cur.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform TEXT,
            text TEXT,
            author TEXT,
            timestamp DATETIME,
            url TEXT,
            engagement INTEGER,
            sentiment TEXT,
            sentiment_score REAL
        )
    ''')

    count = 0
    for p in posts:
        cur.execute('''
            INSERT INTO posts (platform, text, author, timestamp, url, engagement, sentiment, sentiment_score)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            p['platform'],
            p['text'],
            p['author'],
            p['timestamp'],
            p['url'],
            p['engagement'],
            p['sentiment'],
            p['sentiment_score']
        ))
        count += 1
    conn.commit()
    print("✅ Database seeded successfully!")

def run_demo_generation(brand_config):
    """
    Main entry point for generating demo data.
    """
    try:
        print(f"🚀 Starting demo data generation for {brand_config.get('brandName')}")
        conn = get_db_connection()
        wipe_data(conn)
        posts = generate_synthetic_posts(brand_config)
        save_posts_to_db(conn, posts)
        conn.close()
        print("✨ Demo data generation complete.")
    except Exception as e:
        print(f"❌ Error in run_demo_generation: {e}")


# --- NEW: Live Simulation Engine ---

THEME_TEMPLATES_CRISIS = {
    "Battery Fire": [
        "My {brand} device just overheated and started smoking! #{keyword}",
        "Safety warning: {brand} batteries are catching fire. Recall needed!",
        "Terrified to use my {brand} product after reading about the fires.",
        "Another report of {brand} catching fire? This is negligence.",
    ],
    "Privacy Breach": [
        "{brand} just leaked 5M user records. Check your emails.",
        "Can't trust {brand} with my data anymore after this breach.",
        "Hackers dumping {brand} user data on dark web. #security",
    ],
    "Service Outage": [
        "Is {brand} down AGAIN? I have work to do!",
        "Total blackout on {brand} services for 4 hours now.",
        "No ETA on fix from {brand}. This is unexpected downtime.",
    ]
}

def generate_live_stream_batch(query: str, count: int = 10, scenario: str = None) -> list:
    """
    Generates a batch of high-fidelity simulated social media posts for real-time ingestion.
    scenario: 'battery_fire', 'privacy_breach', 'outage', or None
    """
    brand = query.split()[0] if " " in query else query
    keywords = ["service", "product", "quality", "security", "support"]
    competitors = ["CompetitorX", "BrandY", "LegacyCorp"]
    
    posts = []
    end_time = datetime.now()
    
    # Map scenario slug to display theme
    crisis_map = {
        "battery_fire": "Battery Fire",
        "privacy": "Privacy Breach",
        "outage": "Service Outage"
    }
    active_theme = crisis_map.get(scenario)
    
    for _ in range(count):
        r = random.random()
        theme = "General"
        severity = "MONITOR"
        keyword = random.choice(keywords)
        competitor = random.choice(competitors)
        templates_to_use = TEMPLATES_NEUTRAL
        sentiment_label = "NEUTRAL"
        score = 0.0

        # Scenario Logic
        if active_theme:
            # Crisis Mode: 90% Negative
            if r < 0.9:
                sentiment_label = "NEGATIVE"
                score = random.uniform(-0.95, -0.6)
                # 70% chance to use specific crisis theme
                if random.random() < 0.7:
                    theme = active_theme
                    templates_list = THEME_TEMPLATES_CRISIS.get(theme, TEMPLATES_NEGATIVE)
                    template = random.choice(templates_list)
                    severity = "HIGH"
                else:
                    template = random.choice(TEMPLATES_NEGATIVE)
            else:
                templates_to_use = TEMPLATES_NEUTRAL
                template = random.choice(templates_to_use)
        else:
            # Normal Mode: 60% Pos, 20% Neu, 20% Neg
            if r < 0.6:
                sentiment_label = "POSITIVE"
                score = random.uniform(0.4, 0.95)
                template = random.choice(TEMPLATES_POSITIVE)
            elif r < 0.8:
                sentiment_label = "NEUTRAL"
                score = random.uniform(-0.2, 0.2)
                template = random.choice(TEMPLATES_NEUTRAL)
            else:
                sentiment_label = "NEGATIVE"
                score = random.uniform(-0.95, -0.4)
                template = random.choice(TEMPLATES_NEGATIVE)

        filled_text = template.format(brand=brand, keyword=keyword, competitor=competitor)
        
        # Engagement spike for crisis
        engagement = int(random.expovariate(1/50))
        if severity == "HIGH":
            engagement += random.randint(1000, 5000)
            if engagement > 3000:
                severity = "CRITICAL"
                filled_text = "🚨 " + filled_text

        posts.append({
            'platform': random.choice(['Twitter', 'Reddit', 'News']),
            'text': filled_text,
            'author': f"user_{random.randint(1000, 9999)}",
            'timestamp': (end_time - timedelta(minutes=random.randint(0, 60))).isoformat(),
            'url': f"https://social.mock/{random.randint(100000, 999999)}",
            'engagement': engagement,
            'sentiment': sentiment_label, # Unified key
            'sentiment_score': score,
            'theme': theme,
            'severity': severity
        })
    
    return posts

