import datetime
from services.models import CompanyProfile, User
from services.stream_ingestion import StreamIngestionService
from services.sentiment_model import sentiment_model

ingestion = StreamIngestionService()

class AnalysisController:
    async def get_dashboard_data(self, user_id):
        # 1. Get User & Company
        user = User.find_by_id(user_id)
        if not user or not user.get('company_id'):
            return {"error": "User or Company not found"}
        
        company = CompanyProfile.find_by_id(user['company_id'])
        if not company:
             return {"error": "Company profile missing"}

        # 2. Check Cache (15 mins)
        last_analysis = company.get('lastAnalysis', {})
        last_ts = last_analysis.get('timestamp')
        
        # Determine if we need to fetch
        needs_refresh = True
        if last_ts:
            if isinstance(last_ts, str):
                try:
                    last_ts = datetime.datetime.fromisoformat(last_ts.replace("Z", "+00:00"))
                except:
                    last_ts = datetime.datetime.now() - datetime.timedelta(hours=1) # Force refresh
            
            # If less than 2 mins old, return cached (Near Real-time)
            if (datetime.datetime.now() - last_ts).total_seconds() < 120:
                needs_refresh = False
        
        if needs_refresh:
            # 3. Fetch Fresh Data using Brand Keywords
            query = company.get('brandName', '')
            if company.get('keywords'):
                # Add first keyword to query for better specificity
                query += f" {company['keywords'][0]}"
            
            print(f"🔄 Refreshing real-time data for: {query}")
            
            # Fetch from social sources
            reddit_posts = await ingestion.fetch_reddit(query)
            youtube_posts = await ingestion.fetch_youtube(query)
            all_posts = reddit_posts + youtube_posts
            
            # Analyze Sentiment
            analyzed_posts = []
            sentiment_counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
            total_score = 0
            
            for post in all_posts:
                s_result = sentiment_model.analyze(post['text'])
                post['sentiment'] = s_result['label']
                post['score'] = s_result['score']
                analyzed_posts.append(post)
                
                cat = s_result['label'].capitalize()
                if cat in sentiment_counts:
                    sentiment_counts[cat] += 1
                
                # Weighted score: Neg=-1, Neu=0, Pos=1
                weight = -1 if cat == "Negative" else (1 if cat == "Positive" else 0)
                total_score += weight

            # Calculate Velocity (Posts per hour - simplistic)
            velocity = len(all_posts) * 2 # Mock multiplier
            
            avg_score = total_score / len(all_posts) if all_posts else 0
            
            new_analysis = {
                "timestamp": datetime.datetime.now().isoformat(),
                "sentimentScore": avg_score,
                "velocityScore": velocity,
                "activeAlerts": ["Detecting anomalies..."] if velocity > 50 else [],
                "topMentions": analyzed_posts[:10], # Store top 10
                "sentimentCounts": sentiment_counts
            }
            
            # Update DB (Using the fixed method in models.py)
            CompanyProfile.update(str(company['_id']), {"lastAnalysis": new_analysis})
            
            return new_analysis
            
        return last_analysis
            
            # If standard mongo date (datetime), use directly
            # Ensure last_ts is timezone aware or naive consistent
            if last_ts.tzinfo is None:
                last_ts = last_ts.replace(tzinfo=datetime.timezone.utc)
            
            diff = datetime.datetime.now(datetime.timezone.utc) - last_ts
            if diff.total_seconds() < 15 * 60:
                needs_refresh = False

        if not needs_refresh:
            return last_analysis

        # 3. Fetch Real Data
        brand = company.get('brandName')
        posts = await ingestion.fetch_reddit(brand)
        
        # 4. Process Sentiment
        mentions = []
        total_score = 0
        count = 0
        counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
        
        for post in posts:
            result = sentiment_model.analyze(post['text'])
            score = result['score']
            
            # Normalize RoBERTa score if needed
            if result.get('model') == 'roberta':
                if result['label'] == 'negative': score = -score
                elif result['label'] == 'neutral': score = 0
            
            label = result['label'].capitalize()
            # Fallback if label not in dict
            if label not in counts: label = "Neutral"
            
            counts[label] += 1

            mentions.append({
                "source": post['platform'],
                "text": post['text'],
                "sentiment": label,
                "score": score,
                "date": post['timestamp'] if isinstance(post['timestamp'], datetime.datetime) else datetime.datetime.now()
            })
            total_score += score
            count += 1
            
        avg_sentiment = total_score / count if count > 0 else 0
        
        # 5. Save to DB
        new_analysis = {
            "timestamp": datetime.datetime.now(datetime.timezone.utc),
            "sentimentScore": avg_sentiment,
            "sentimentCounts": counts,
            "velocityScore": len(posts) * 10,
            "activeAlerts": [],
            "topMentions": mentions[:10]
        }
        
        CompanyProfile.update(str(company['_id']), {"lastAnalysis": new_analysis})
        
        return new_analysis

analysis_controller = AnalysisController()
