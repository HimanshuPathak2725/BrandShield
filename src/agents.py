"""
Agent implementations for BrandShield_Lite.
Contains Search Agent, Evaluator Agent, Advanced RAG Agent, and Strategy Agent.
"""
import os
from typing import Dict, Any, List
from datetime import datetime, timedelta
import pytz

# Sentiment Analysis
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Advanced Emotion Analysis
try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("⚠️ Transformers not available. Emotion analysis will be limited.")

# LangChain & RAG
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema import Document

# Search
try:
    from exa_py import Exa
    EXA_AVAILABLE = True
except ImportError:
    EXA_AVAILABLE = False

from src.state import AgentState
from src.advanced_agents import analyze_emotions, check_rag_relevance, refine_search_query
from src.llm_utils import get_llm
from langchain.prompts import PromptTemplate


# ============================================================================
# SEARCH AGENT
# ============================================================================

def search_agent(state: AgentState) -> AgentState:
    """
    Search Agent: Fetches the latest web mentions about the topic.
    
    Uses exa-py if available, otherwise uses a mock search function.
    """
    topic = state["topic"]
    print(f"🔍 Search Agent: Searching for mentions of '{topic}'...")
    
    raw_content = []
    
    # Try using Exa API
    if EXA_AVAILABLE and os.getenv("EXA_API_KEY"):
        try:
            exa = Exa(api_key=os.getenv("EXA_API_KEY"))
            
            # Get current time and 2 days ago
            current_time = datetime.now(pytz.UTC)
            two_days_ago = current_time - timedelta(days=2)
            
            # Format dates for Exa API (ISO format)
            start_date = two_days_ago.strftime("%Y-%m-%dT%H:%M:%S.000Z")
            
            results = exa.search_and_contents(
                query=f"{topic} brand mention reviews sentiment",
                num_results=15,
                text=True,
                start_published_date=start_date,
                use_autoprompt=True
            )
            
            for result in results.results:
                # Parse published date
                pub_date = getattr(result, 'published_date', None)
                if pub_date:
                    try:
                        # Parse ISO format date
                        if isinstance(pub_date, str):
                            pub_datetime = datetime.fromisoformat(pub_date.replace('Z', '+00:00'))
                        else:
                            pub_datetime = pub_date
                    except:
                        pub_datetime = current_time
                else:
                    pub_datetime = current_time
                
                raw_content.append({
                    "title": result.title,
                    "url": result.url,
                    "text": result.text[:1500] if result.text else "",
                    "published_date": pub_datetime.isoformat(),
                    "published_timestamp": pub_datetime.timestamp()
                })
            
            print(f"✅ Found {len(raw_content)} results via Exa API (past 2 days)")
            
        except Exception as e:
            print(f"⚠️ Exa API error: {e}. Falling back to mock data...")
            raw_content = _get_mock_search_results(topic)
    else:
        print("⚠️ Exa API not available. Using mock search results...")
        raw_content = _get_mock_search_results(topic)
    
    state["raw_content"] = raw_content
    return state


def _get_mock_search_results(topic: str) -> List[Dict[str, Any]]:
    """Mock search results for testing when Exa API is not available."""
    current_time = datetime.now(pytz.UTC)
    
    # Generate timestamps within past 2 days
    timestamps = [
        current_time - timedelta(hours=2),   # 2 hours ago
        current_time - timedelta(hours=8),   # 8 hours ago
        current_time - timedelta(hours=18),  # 18 hours ago
        current_time - timedelta(days=1),    # 1 day ago
        current_time - timedelta(hours=30),  # 1.25 days ago
        current_time - timedelta(hours=36),  # 1.5 days ago
        current_time - timedelta(hours=42),  # 1.75 days ago
        current_time - timedelta(hours=47),  # ~2 days ago
    ]
    
    return [
        {
            "title": f"{topic} Product Review - Amazing Experience",
            "url": f"https://example.com/{topic.lower()}-review-1",
            "text": f"I absolutely love {topic}! The quality is outstanding and the customer service is exceptional. "
                    f"Would highly recommend to anyone looking for a reliable brand. Five stars!",
            "published_date": timestamps[0].isoformat(),
            "published_timestamp": timestamps[0].timestamp()
        },
        {
            "title": f"Disappointed with {topic} Latest Release",
            "url": f"https://example.com/{topic.lower()}-review-2",
            "text": f"Very frustrated with {topic}'s new product. It has numerous technical bugs and crashes frequently. "
                    f"The app freezes every time I try to use the main feature. Customer support was unhelpful. "
                    f"This is unacceptable for a premium brand.",
            "published_date": timestamps[1].isoformat(),
            "published_timestamp": timestamps[1].timestamp()
        },
        {
            "title": f"{topic} Safety Concerns Raised",
            "url": f"https://example.com/{topic.lower()}-safety",
            "text": f"Multiple users have reported safety risks with {topic} products. There are concerns about "
                    f"overheating issues and potential fire hazards. The company needs to address these serious "
                    f"safety problems immediately before someone gets hurt.",
            "published_date": timestamps[2].isoformat(),
            "published_timestamp": timestamps[2].timestamp()
        },
        {
            "title": f"Neutral Opinion on {topic}",
            "url": f"https://example.com/{topic.lower()}-neutral",
            "text": f"{topic} is an okay brand. Nothing special, but gets the job done. "
                    f"The price is fair for what you get. Would consider buying again.",
            "published_date": timestamps[3].isoformat(),
            "published_timestamp": timestamps[3].timestamp()
        },
        {
            "title": f"Hate Speech Against {topic} on Social Media",
            "url": f"https://example.com/{topic.lower()}-controversy",
            "text": f"There's been a surge of hate speech and offensive comments targeting {topic} on social media. "
                    f"Users are posting discriminatory content and harassment directed at the brand and its customers. "
                    f"This toxic behavior is creating a hostile environment online.",
            "published_date": timestamps[4].isoformat(),
            "published_timestamp": timestamps[4].timestamp()
        },
        {
            "title": f"{topic} Exceeds Expectations",
            "url": f"https://example.com/{topic.lower()}-positive-2",
            "text": f"Been using {topic} for months now and couldn't be happier. The product quality is excellent "
                    f"and the value for money is great. Customer support team is very responsive and helpful.",
            "published_date": timestamps[5].isoformat(),
            "published_timestamp": timestamps[5].timestamp()
        },
        {
            "title": f"Technical Issues Plague {topic} Users",
            "url": f"https://example.com/{topic.lower()}-bugs",
            "text": f"Users are reporting widespread technical bugs with {topic}. The software is unstable and "
                    f"crashes regularly. Many customers are experiencing data loss and connectivity issues. "
                    f"These technical problems need urgent attention from the development team.",
            "published_date": timestamps[6].isoformat(),
            "published_timestamp": timestamps[6].timestamp()
        },
        {
            "title": f"{topic} Customer Frustration Growing",
            "url": f"https://example.com/{topic.lower()}-frustration",
            "text": f"Growing product frustration among {topic} customers. Many users report that the latest updates "
                    f"have made the product worse. Features that previously worked are now broken. "
                    f"The user experience has significantly deteriorated.",
            "published_date": timestamps[7].isoformat(),
            "published_timestamp": timestamps[7].timestamp()
        }
    ]


# ============================================================================
# EVALUATOR AGENT
# ============================================================================

def evaluator_agent(state: AgentState) -> AgentState:
    """
    Evaluator Agent: Filters and validates content from the past 2 days only.
    
    - Checks timestamps of all content
    - Filters out content older than 2 days
    - Adds time-since-posted information
    - Validates data quality
    """
    print("⚖️ Evaluator Agent: Filtering content by time (past 2 days only)...")
    
    raw_content = state["raw_content"]
    current_time = datetime.now(pytz.UTC)
    two_days_ago = current_time - timedelta(days=2)
    
    filtered_content = []
    filtered_out = 0
    
    for item in raw_content:
        try:
            # Parse the published date
            if isinstance(item['published_date'], str):
                pub_datetime = datetime.fromisoformat(item['published_date'].replace('Z', '+00:00'))
            else:
                pub_datetime = item['published_date']
            
            # Ensure timezone awareness
            if pub_datetime.tzinfo is None:
                pub_datetime = pytz.UTC.localize(pub_datetime)
            
            # Filter: Only keep content from past 2 days
            if pub_datetime >= two_days_ago:
                # Calculate time ago
                time_diff = current_time - pub_datetime
                
                # Handle future dates (clock skew or API issues)
                if time_diff.total_seconds() < 0:
                    time_ago = "Just now"
                    item['time_ago'] = time_ago
                    item['hours_ago'] = 0
                    item['is_recent'] = True
                    item['formatted_date'] = pub_datetime.strftime("%B %d, %Y at %I:%M %p UTC")
                    filtered_content.append(item)
                    continue

                # Format time ago string
                if time_diff.total_seconds() < 3600:  # Less than 1 hour
                    minutes = int(time_diff.total_seconds() / 60)
                    time_ago = f"{minutes} minute{'s' if minutes != 1 else ''} ago"
                elif time_diff.total_seconds() < 86400:  # Less than 1 day
                    hours = int(time_diff.total_seconds() / 3600)
                    time_ago = f"{hours} hour{'s' if hours != 1 else ''} ago"
                else:  # Days
                    days = int(time_diff.total_seconds() / 86400)
                    hours = int((time_diff.total_seconds() % 86400) / 3600)
                    time_ago = f"{days} day{'s' if days != 1 else ''}, {hours} hour{'s' if hours != 1 else ''} ago"
                
                # Add enriched metadata
                item['time_ago'] = time_ago
                item['hours_ago'] = time_diff.total_seconds() / 3600
                item['is_recent'] = time_diff.total_seconds() < 21600  # < 6 hours
                item['formatted_date'] = pub_datetime.strftime("%B %d, %Y at %I:%M %p UTC")
                
                filtered_content.append(item)
            else:
                filtered_out += 1
                
        except Exception as e:
            print(f"  ⚠️ Error parsing date for item: {e}")
            # If we can't parse the date, include it anyway (benefit of doubt)
            item['time_ago'] = "Unknown"
            item['formatted_date'] = "Date unavailable"
            item['is_recent'] = False
            filtered_content.append(item)
    
    # Sort by recency (most recent first)
    filtered_content.sort(key=lambda x: x.get('hours_ago', 999), reverse=False)
    
    print(f"✅ Evaluator: Kept {len(filtered_content)} articles (past 2 days)")
    if filtered_out > 0:
        print(f"   🚫 Filtered out {filtered_out} old articles (>2 days)")
    
    # Count recent articles (< 6 hours)
    recent_count = sum(1 for item in filtered_content if item.get('is_recent', False))
    if recent_count > 0:
        print(f"   🔥 {recent_count} breaking news articles (< 6 hours old)")
    
    state["filtered_content"] = filtered_content
    
    return state


# ============================================================================
# ADVANCED RAG AGENT
# ============================================================================

def rag_agent(state: AgentState) -> AgentState:
    """
    Advanced RAG Agent: Uses semantic search to identify brand issues.
    
    ✅ REAL RAG FEATURES:
    - Chunks the raw content with RecursiveCharacterTextSplitter
    - Embeds using HuggingFaceEmbeddings (all-MiniLM-L6-v2)
    - Stores in FAISS vector database (in-memory)
    - Uses semantic retrieval (not keyword matching!)
    - Performs targeted queries for: hate speech, product frustration, 
      technical bugs, and safety risks
    - Extracts evidence-based findings with context
    """
    print("🧠 RAG Agent: Initializing Vector Store for Semantic Analysis...")
    
    # Use filtered content from Evaluator Agent
    filtered_content = state["filtered_content"]
    
    if not filtered_content:
        print("⚠️ No content to analyze after filtering")
        state["sentiment_stats"] = {
            "positive": 0, "negative": 0, "neutral": 0, "total": 0,
            "vader_compound": 0, "textblob_polarity": 0,
            "overall_sentiment": "Neutral", "risk_score": 0
        }
        state["rag_findings"] = "No recent content found (past 2 days)."
        return state
    
    # ============================================================================
    # STEP 1: CONVERT FILTERED CONTENT TO DOCUMENTS
    # ============================================================================
    print("📚 Step 1: Converting filtered content to documents...")
    documents = []
    for idx, item in enumerate(filtered_content):
        content = (f"Title: {item['title']}\n"
                  f"Published: {item.get('formatted_date', 'Unknown')} ({item.get('time_ago', 'Unknown')})\n"
                  f"URL: {item['url']}\n"
                  f"Content: {item['text']}")
        documents.append(Document(
            page_content=content,
            metadata={
                "source": item["url"],
                "title": item["title"],
                "doc_id": idx,
                "time_ago": item.get('time_ago', 'Unknown'),
                "is_recent": item.get('is_recent', False)
            }
        ))
    
    # ============================================================================
    # STEP 2: SPLIT TEXT INTO CHUNKS (Critical for RAG!)
    # ============================================================================
    print("✂️ Step 2: Splitting documents into semantic chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    splits = text_splitter.split_documents(documents)
    print(f"   ✅ Created {len(splits)} searchable chunks")
    
    # ============================================================================
    # STEP 3: INITIALIZE EMBEDDING MODEL (Converts text → semantic vectors)
    # ============================================================================
    print("🔢 Step 3: Loading embedding model (all-MiniLM-L6-v2)...")
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )
    
    # ============================================================================
    # STEP 4: CREATE VECTOR DATABASE (The "Intelligence" Layer)
    # ============================================================================
    print("💾 Step 4: Building vector database...")
    vectorstore = FAISS.from_documents(
        documents=splits,
        embedding=embeddings
    )
    
    # Create retriever for semantic search
    retriever = vectorstore.as_retriever(
        search_kwargs={"k": 3}  # Retrieve top 3 most relevant chunks
    )
    print("   ✅ Vector store ready for semantic queries")
    
    # ============================================================================
    # STEP 5: PERFORM TARGETED RAG QUERIES (Semantic Understanding!)
    # ============================================================================
    print("🔍 Step 5: Executing semantic retrieval queries with CRAG...")
    
    risk_queries = {
        "hate_speech": "hate speech, offensive language, discriminatory content, harassment, toxic behavior, anger, furious customers, swearing",
        "product_frustration": "customer frustration, disappointed customers, angry users, complaints, dissatisfaction, unhappy, terrible experience",
        "technical_bugs": "technical bugs, software crashes, app freezing, glitches, system errors, connectivity issues, not working, broken, failure",
        "safety_risks": "safety concerns, dangerous products, fire hazards, injury risks, health problems, overheating, hazardous"
    }
    
    findings = []
    structured_findings = []
    sentiment_vader = SentimentIntensityAnalyzer()
    risk_score = 0
    total_relevance = 0
    
    # Initialize LLM for strict analysis
    try:
        llm_strict = get_llm(temperature=0.1, max_new_tokens=10)
        print("   🤖 LLM initialized for strict sentiment verification")
    except:
        llm_strict = None
        print("   ⚠️ LLM not available for strict verification, falling back to VADER")
    
    for category, query in risk_queries.items():
        print(f"  🎯 Semantic search: {category.replace('_', ' ').title()}")
        
        # Use retriever for semantic search (not keyword matching!)
        results = retriever.invoke(query)
        
        # ✅ CRAG: Check relevance
        is_relevant = check_rag_relevance(results, query, threshold=0.25)
        
        if not is_relevant and results:
            print(f"     🔄 CRAG: Low relevance detected. Refining query...")
            # Refine the query
            refined_query = refine_search_query(query, filtered_content[0]['title'] if filtered_content else "brand")
            results = retriever.invoke(refined_query)
            print(f"     ✅ CRAG: Retrieved with refined query")
        
        total_relevance += (1 if is_relevant else 0.5)
        
        if results:
            category_findings = {
                "category": category.replace('_', ' ').title(),
                "relevance": "High" if is_relevant else "Refined",
                "items": []
            }
            
            findings.append(f"\n## 🛡️ {category.replace('_', ' ').title()}")
            findings.append(f"*Semantic matches found: {len(results)} | Relevance: {'✅ High' if is_relevant else '⚠️ Refined'}*\n")
            
            for doc in results:
                # Extract sentiment for evidence
                sentiment_score = sentiment_vader.polarity_scores(doc.page_content)
                compound_score = sentiment_score['compound']
                
                # STRICT ANALYSIS: Use LLM to verify negative sentiment
                sentiment_label = "Neutral"
                if compound_score < -0.05:
                    sentiment_label = "Negative"
                    # Verify with LLM if available
                    if llm_strict:
                        try:
                            prompt = (f"Analyze this text. Is it expressing negative sentiment, frustration, or criticism "
                                     f"towards the brand/product? Answer only YES or NO.\n\nText: {doc.page_content[:500]}")
                            response = llm_strict.invoke(prompt)
                            if "NO" in str(response).upper():
                                sentiment_label = "Neutral" # Downgrade if LLM disagrees
                                compound_score = 0.0 # Reset score
                        except Exception as e:
                            print(f"      ⚠️ LLM verification failed: {e}")
                elif compound_score > 0.05:
                    sentiment_label = "Positive"
                
                # Update label with emoji
                sentiment_display = f"🔴 {sentiment_label}" if sentiment_label == "Negative" else \
                                  f"🟢 {sentiment_label}" if sentiment_label == "Positive" else f"🟡 {sentiment_label}"
                
                # Increment risk score for negative findings
                if sentiment_label == "Negative":
                    risk_score += 1
                
                # Add to structured findings
                category_findings["items"].append({
                    "source": doc.metadata.get('title', 'Unknown'),
                    "url": doc.metadata.get('source', '#'),
                    "time_ago": doc.metadata.get('time_ago', 'Unknown'),
                    "sentiment_label": sentiment_label,
                    "sentiment_display": sentiment_display,
                    "score": compound_score,
                    "context": doc.page_content
                })

                findings.append(f"**Evidence #{results.index(doc) + 1}:**")
                findings.append(f"- Source: {doc.metadata.get('title', 'Unknown')}")
                findings.append(f"- Posted: {doc.metadata.get('time_ago', 'Unknown')}")
                findings.append(f"- Sentiment: {sentiment_display} (Score: {compound_score:.2f})")
                findings.append(f"- Context: \"{doc.page_content[:250]}...\"")
                findings.append("")
            
            structured_findings.append(category_findings)
    
    state["rag_findings_structured"] = structured_findings
    
    # Calculate CRAG quality score
    rag_quality_score = total_relevance / len(risk_queries)
    print(f"   ✅ Semantic analysis complete. Risk Score: {risk_score}, RAG Quality: {rag_quality_score:.2f}")
    
    # ============================================================================
    # STEP 6: EMOTION VELOCITY ANALYSIS
    # ============================================================================
    print("😊 Step 6: Analyzing emotion velocity and trends...")
    
    emotion_analysis = analyze_emotions(filtered_content)
    state["emotion_analysis"] = emotion_analysis
    
    print(f"   🎭 Dominant Emotion: {emotion_analysis['dominant_emotion'].upper()}")
    print(f"   📈 Viral Risk: {emotion_analysis['viral_risk']}")
    print(f"   💥 Danger Score: {emotion_analysis['danger_score']:.2f}")
    
    # ============================================================================
    # STEP 7: OVERALL SENTIMENT ANALYSIS
    # ============================================================================
    print("📊 Step 7: Computing overall sentiment statistics...")
    
    all_text = " ".join([item["text"] for item in filtered_content])
    
    # VADER sentiment
    vader_scores = sentiment_vader.polarity_scores(all_text)
    
    # TextBlob sentiment
    blob = TextBlob(all_text)
    textblob_polarity = blob.sentiment.polarity
    
    # Calculate sentiment distribution
    positive_count = sum(1 for item in filtered_content 
                        if sentiment_vader.polarity_scores(item["text"])['compound'] > 0.05)
    negative_count = sum(1 for item in filtered_content 
                        if sentiment_vader.polarity_scores(item["text"])['compound'] < -0.05)
    neutral_count = len(filtered_content) - positive_count - negative_count
    
    state["sentiment_stats"] = {
        "positive": positive_count,
        "negative": negative_count,
        "neutral": neutral_count,
        "total": len(filtered_content),
        "vader_compound": vader_scores['compound'],
        "textblob_polarity": textblob_polarity,
        "overall_sentiment": "Negative" if vader_scores['compound'] < -0.05 else 
                           "Positive" if vader_scores['compound'] > 0.05 else "Neutral",
        "risk_score": risk_score
    }
    
    state["rag_quality_score"] = rag_quality_score
    
    # ============================================================================
    # STEP 8: SYNTHESIZE FINDINGS
    # ============================================================================
    if findings:
        summary = f"""
### 🎯 ADVANCED RAG ANALYSIS RESULTS (CRAG-Enhanced)

**Analysis Method:** Semantic Vector Search + Corrective RAG
**Time Filter:** Past 2 days only (Evaluator Agent filtered)
**Embedding Model:** sentence-transformers/all-MiniLM-L6-v2
**Vector Database:** FAISS (in-memory)
**Chunks Analyzed:** {len(splits)}
**RAG Quality Score:** {rag_quality_score:.2f}/1.0 (CRAG relevance checking)
**Risk Score:** {risk_score}/12 (Higher = More concerning)

---

### 😊 EMOTION VELOCITY ANALYSIS

**Dominant Emotion:** {emotion_analysis['dominant_emotion'].upper()}
**Viral Boycott Risk:** {emotion_analysis['viral_risk']}
**Danger Score:** {emotion_analysis['danger_score']:.2f}/1.0
**Trend Analysis:** {emotion_analysis['trend_analysis']}

**Emotion Breakdown:**
"""
        for emotion, score in emotion_analysis['emotion_scores'].items():
            summary += f"- {emotion.title()}: {score:.2%}\n"
        
        summary += f"\n---\n\n{''.join(findings)}\n\n---\n\n"
        
        summary += """
### 🧠 Why This is "Elite RAG":
- ✅ **Semantic Understanding**: Finds "my screen went black" when searching for "technical failures"
- ✅ **Vector Embeddings**: Text is converted to mathematical vectors, not string matching
- ✅ **CRAG (Corrective RAG)**: Self-correcting retrieval with relevance checking
- ✅ **Emotion Velocity**: Tracks anger escalation and viral boycott risk
- ✅ **Context Preservation**: Chunks maintain semantic relationships
- ✅ **Evidence-Based**: Every finding is backed by actual retrieved content
- ✅ **Time-Filtered**: Evaluator Agent ensures only recent data (past 2 days)
"""
        state["rag_findings"] = summary
    else:
        state["rag_findings"] = "No significant issues detected in semantic analysis (past 2 days)."
    
    print("✅ Advanced RAG Analysis complete")
    print(f"   📊 Overall Sentiment: {state['sentiment_stats']['overall_sentiment']}")
    print(f"   🎯 Risk Score: {risk_score}/12")
    print(f"   🎭 Emotion: {emotion_analysis['dominant_emotion']}, Viral Risk: {emotion_analysis['viral_risk']}")
    
    return state


# ============================================================================
# STRATEGY AGENT
# ============================================================================

def strategy_agent(state: AgentState) -> AgentState:
    """
    Strategy Agent: Creates a detailed CEO-level strategic report DRAFT.
    
    Uses an LLM to analyze findings and provide Immediate, Short-term, and Long-term actions.
    """
    print("📊 Strategy Agent: Generating strategic report draft using LLM...")
    
    topic = state["topic"]
    sentiment_stats = state["sentiment_stats"]
    rag_findings = state["rag_findings"]
    emotion_analysis = state.get("emotion_analysis", {})
    revision_count = state.get("revision_count", 0)
    critic_feedback = state.get("critic_feedback", "")
    
    # Initialize LLM
    try:
        llm = get_llm()
    except Exception as e:
        print(f"⚠️ Failed to initialize LLM: {e}. Falling back to template.")
        # Fallback logic could go here, but for now we'll just print error
        # In a real app, we might want a robust fallback
    
    # Construct the prompt
    prompt_template = """
You are the Chief Brand Strategist for {topic}. 
Your job is to write a high-level strategic report for the CEO based on the following data.

### 📊 DATA INPUTS
- **Overall Sentiment:** {overall_sentiment}
- **Sentiment Stats:** Positive: {positive}, Negative: {negative}, Neutral: {neutral}
- **Dominant Emotion:** {dominant_emotion} (Viral Risk: {viral_risk})
- **RAG Analysis Findings:** 
{rag_findings}

### 📝 CRITIC FEEDBACK (If any, you MUST address this):
{critic_feedback}

### 🎯 INSTRUCTIONS
Write a professional, actionable strategic report in Markdown format.
The report MUST include the following sections:
1. **EXECUTIVE SUMMARY**: Brief overview of the brand's current health.
2. **RISK ASSESSMENT**: Determine if this is a LOW, MEDIUM, HIGH, or CRITICAL crisis.
3. **STRATEGIC RECOMMENDATIONS**:
   - **Immediate Actions (24-48 Hours)**: Specific, urgent steps.
   - **Short-Term Actions (2-4 Weeks)**: Process improvements.
   - **Long-Term Actions (3-6 Months)**: Strategic shifts.
4. **KPIs TO TRACK**: 3-5 metrics to monitor progress.

**Tone:** Professional, objective, and decisive. Avoid fluff.
**Format:** Use Markdown headers (##), bullet points, and bold text.

### GENERATED REPORT:
"""
    
    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["topic", "overall_sentiment", "positive", "negative", "neutral", 
                         "dominant_emotion", "viral_risk", "rag_findings", "critic_feedback"]
    )
    
    formatted_prompt = prompt.format(
        topic=topic,
        overall_sentiment=sentiment_stats.get('overall_sentiment', 'Unknown'),
        positive=sentiment_stats.get('positive', 0),
        negative=sentiment_stats.get('negative', 0),
        neutral=sentiment_stats.get('neutral', 0),
        dominant_emotion=emotion_analysis.get('dominant_emotion', 'Unknown'),
        viral_risk=emotion_analysis.get('viral_risk', 'Unknown'),
        rag_findings=rag_findings,
        critic_feedback=critic_feedback if critic_feedback else "None. This is the first draft."
    )
    
    try:
        print("   🧠 Invoking LLM for strategy generation...")
        report = llm.invoke(formatted_prompt)
        
        # Add metadata footer
        report += "\n\n---\n\n*This report was generated by BrandShield_Lite Elite AI (Zephyr-7b)*"
        
    except Exception as e:
        print(f"   ❌ LLM Generation Failed: {e}")
        report = f"ERROR: Could not generate report due to LLM failure.\n\nDetails: {e}"

    # Store as draft for Critic review
    state["draft_report"] = report
    state["revision_count"] = revision_count
    
    print("✅ Strategic report draft complete (pending Critic review)")
    
    return state
