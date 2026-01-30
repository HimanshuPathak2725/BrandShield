import sqlite3
import json
import os
import random
from datetime import datetime, timedelta

# Configuration
DB_PATH = os.path.join(os.getcwd(), 'data', 'brandshield.db')

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

THEME_TEMPLATES = {
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
    ],
    "Hidden Fees": [
        "Check your bank accounts, {brand} double charged me!",
        "Sneaky hidden fees in the latest {brand} invoice.",
        "Since when does {brand} charge for this feature?",
    ]
}

TEMPLATES_NEUTRAL = [
    "Just noticed {brand} updated their terms regarding {keyword}.",
    "Anyone else using {brand} for {keyword}?",
    "Comparing {brand} vs {competitor} for {keyword} needs.",
    "News: {brand} announces changes to {keyword} policy.",
    "Stock price for {brand} steady despite {keyword} rumors.",
    "Exploring features of {brand} today.",
    "Thinking about {keyword} and how {brand} handles it.",
]

TEMPLATES_POSITIVE = [
    "Honestly {brand} handles {keyword} better than anyone else.",
    "Love the new update from {brand}! #{keyword}",
    "Kudos to {brand} support team for fixing my {keyword} issue.",
    "Switching from {competitor} to {brand} was the best decision.",
    "{brand} is leading the industry in {keyword} innovation.",
]

def get_db_connection():
    if not os.path.exists(os.path.dirname(DB_PATH)):
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_latest_company(conn):
    try:
        cur = conn.cursor()
        cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='companies'")
        if not cur.fetchone(): return None
        # Try to find a company, or mock one if table exists but empty (edge case)
        cur.execute("SELECT * FROM companies ORDER BY created_at DESC LIMIT 1")
        return cur.fetchone()
    except Exception as e:
        print(f"Error fetching company: {e}")
        return None

def wipe_data(conn):
    print("🧹 Wiping existing posts data...")
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='posts'")
    if cur.fetchone():
        # Drop table to ensure new schema using CREATE TABLE in save logic
        cur.execute("DROP TABLE posts")
        conn.commit()
        print("✅ Data wiped and schema reset.")
    else:
        print("⚠️ Posts table not found, skipping wipe.")

def generate_data(company, num_posts=800):
    brand = company['brand_name']
    
    try:
        keywords = json.loads(company['keywords']) if company['keywords'] else []
        if isinstance(keywords, str): keywords = [keywords]
    except: keywords = []
    
    try:
        competitors = json.loads(company['competitors']) if company['competitors'] else []
        if isinstance(competitors, str): competitors = [competitors]
    except: competitors = []
        
    if not keywords: keywords = ["service", "product", "quality", "dashboard", "api", "login"]
    if not competitors: competitors = ["CompetitorX", "GenericBrand", "OldVendor"]

    print(f"🏭 Generating Crisis Scenario for BRAND: {brand}")
    
    posts = []
    end_time = datetime.now()
    
    for i in range(num_posts):
        r = random.random()
        theme = "General"
        severity = "MONITOR"
        keyword = random.choice(keywords)
        competitor = random.choice(competitors)
        
        # 80% Crisis Mode (Negative)
        if r < 0.80:
            sentiment_type = "NEGATIVE"
            score = random.uniform(-0.95, -0.4)
            
            # Assign Theme primarily for Negative
            if random.random() < 0.5:
                theme = random.choice(list(THEME_TEMPLATES.keys()))
                template = random.choice(THEME_TEMPLATES[theme])
            else:
                theme = "General Complaint"
                template = random.choice(TEMPLATES_NEGATIVE)
            
        elif r < 0.90: 
            sentiment_type = "NEUTRAL"
            score = random.uniform(-0.2, 0.2)
            template = random.choice(TEMPLATES_NEUTRAL)
        else:
            sentiment_type = "POSITIVE"
            score = random.uniform(0.4, 0.95)
            template = random.choice(TEMPLATES_POSITIVE)

        # Fill text
        filled_text = template.format(brand=brand, keyword=keyword, competitor=competitor)

        # Time Distribution
        time_seed = random.random()
        if time_seed < 0.5: minutes_back = random.randint(0, 360) # Last 6h
        elif time_seed < 0.8: minutes_back = random.randint(360, 1440) # 6h-24h
        else: minutes_back = random.randint(1440, 2880)

        timestamp = end_time - timedelta(minutes=minutes_back)

        # Engagement & Severity Calculation
        engagement = int(random.expovariate(1/50))
        if sentiment_type == "NEGATIVE":
            # Higher chance of viral if it's a specific crisis theme
            if theme in ["Battery Fire", "Privacy Breach"] and random.random() < 0.2:
                engagement += random.randint(3000, 15000)
            
            # Determine Severity based on Engagement
            if engagement > 5000:
                severity = "CRITICAL"
                filled_text = "🚨 " + filled_text
            elif engagement > 1000:
                severity = "HIGH"
            else:
                severity = "MONITOR"

        post = {
            'platform': random.choice(['Twitter', 'Reddit', 'News', 'Facebook', 'LinkedIn']),
            'text': filled_text,
            'author': f"user_{random.randint(1000, 9999)}",
            'timestamp': timestamp.isoformat(),
            'url': f"https://social.mock/{random.randint(100000, 999999)}",
            'engagement': engagement,
            'sentiment': json.dumps({"label": sentiment_type, "score": score}),
            'sentiment_score': score,
            'theme': theme,
            'severity': severity
        }
        posts.append(post)
    
    posts.sort(key=lambda x: x['timestamp'])
    return posts

def save_created_posts(conn, posts):
    print(f"💾 Saving {len(posts)} posts to database...")
    cur = conn.cursor()
    
    # New Schema with theme and severity
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
            sentiment_score REAL,
            theme TEXT,
            severity TEXT
        )
    ''')

    count = 0
    for p in posts:
        cur.execute('''
            INSERT INTO posts (platform, text, author, timestamp, url, engagement, sentiment, sentiment_score, theme, severity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            p['platform'], p['text'], p['author'], p['timestamp'], p['url'], 
            p['engagement'], p['sentiment'], p['sentiment_score'], p['theme'], p['severity']
        ))
        count += 1
    conn.commit()
    print("✅ Database seeded successfully!")

    # EXPORT TO JSON FOR FRONTEND DEMO
    json_path = os.path.join(os.getcwd(), 'frontend', 'public', 'demo_data.json')
    try:
        if not os.path.exists(os.path.dirname(json_path)):
            os.makedirs(os.path.dirname(json_path), exist_ok=True)
        
        with open(json_path, 'w') as f:
            json.dump(posts, f, indent=2)
        print(f"✅ Exported {len(posts)} posts to {json_path} for frontend demo")
    except Exception as e:
        print(f"⚠️ Could not export JSON: {e}")

def main():
    if not os.path.exists(DB_PATH):
        print(f"⚠️ Database not found at {DB_PATH}. Looking for data folder...")
    
    conn = get_db_connection()
    company = get_latest_company(conn)
    
    if not company:
        print("❌ No company profile found. Please run onboarding app first.")
        # Fallback for dev - try to insert a dummy company if needed, or just let user onboard
        conn.close()
        return

    wipe_data(conn)
    try:
        posts = generate_data(company)
        save_created_posts(conn, posts)
    except Exception as e:
        print(f"❌ Error generating data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()

if __name__ == "__main__":
    main()
