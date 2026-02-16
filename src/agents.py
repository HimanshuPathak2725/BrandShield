"""
Agent implementations for BrandShield_Lite.
Contains Search Agent, Evaluator Agent, Advanced RAG Agent, and Strategy Agent.
"""
import os
from typing import Dict, Any, List
from datetime import datetime, timedelta
import pytz

# Sentiment Analysis
# TextBlob disabled due to scipy import delays on Windows
# try:
#     from textblob import TextBlob
#     TEXTBLOB_AVAILABLE = True
# except ImportError:
#     TEXTBLOB_AVAILABLE = False
#     print("⚠️ TextBlob not available (scipy import issue). Using VADER only.")
TEXTBLOB_AVAILABLE = False
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# LangChain & RAG
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document

# Search
try:
    from exa_py import Exa
    EXA_AVAILABLE = True
except ImportError:
    EXA_AVAILABLE = False
    print("⚠️ Exa API not installed. Run: pip install exa-py")

from src.state import AgentState
from src.advanced_agents import analyze_emotions, check_rag_relevance, refine_search_query
from src.llm_utils import get_llm, get_agent_llm
from langchain_core.prompts import PromptTemplate


# ============================================================================
# PLANNING AGENT
# ============================================================================

def planning_agent(state: AgentState) -> AgentState:
    """
    Planning Agent: Generates a deep research plan based on the topic.
    """
    print(f"🗺️  Planning Agent: Generating research plan for '{state['topic']}'...")
    topic = state['topic']
    
    try:
        # Generate 3 distinct queries using fast search agent
        llm = get_agent_llm("search", temperature=0.7)
        prompt = (f"You are a master researcher. Generate 3 specific, distinct search queries to investigate the brand '{topic}'.\n"
                  f"1. Focus on recent customer sentiment/complaints.\n"
                  f"2. Focus on specific technical issues or product flaws.\n"
                  f"3. Focus on comparisons with major competitors.\n"
                  f"Return ONLY the 3 queries separated by newlines. No numbering or prefixes.")
        
        response = llm.invoke(prompt)
        # Handle both string and chat response formats
        response_text = response.content if hasattr(response, 'content') else str(response)
        queries = [q.strip().replace('"','').replace("'", "") for q in response_text.split('\n') if q.strip()]
        if len(queries) < 3:
            queries = [
                f"{topic} customer reviews complaints reddit",
                f"{topic} technical issues bugs down",
                f"{topic} vs competitors features"
            ]
    except Exception as e:
        print(f"⚠️ Planning Agent failed: {e}. Using defaults.")
        queries = [
            f"{topic} customer reviews complaints",
            f"{topic} problems bugs",
            f"{topic} alternatives"
        ]
        
    state["research_plan"] = queries[:3]
    print(f"✅ Research Plan: {state['research_plan']}")
    return state


# ============================================================================
# SEARCH AGENT
# ============================================================================

def search_agent(state: AgentState) -> AgentState:
    """
    Search Agent: Fetches web mentions using the Research Plan.
    Uses Exa API ONLY - simplified for demo.
    """
    topic = state["topic"]
    queries = state.get("research_plan", [f"{topic} brand mention reviews"])
    
    print(f"🔍 Search Agent: Executing Deep Research Plan ({len(queries)} queries)...")
    
    raw_content = []
    seen_urls = set()
    current_time = datetime.now(pytz.UTC)
    two_days_ago = current_time - timedelta(days=2)
    
    # Use Exa API
    if EXA_AVAILABLE and os.getenv("EXA_API_KEY"):
        try:
            exa = Exa(api_key=os.getenv("EXA_API_KEY"))
            start_date = two_days_ago.strftime("%Y-%m-%dT%H:%M:%S.000Z")
            
            for query in queries:
                print(f"   🔎 Exa query: {query}")
                results = exa.search_and_contents(
                    query=query,
                    num_results=5,
                    text=True,
                    start_published_date=start_date,
                    use_autoprompt=True
                )
                
                for result in results.results:
                    if result.url in seen_urls:
                        continue
                    seen_urls.add(result.url)
                    
                    pub_date = getattr(result, 'published_date', None)
                    if pub_date:
                        try:
                            pub_datetime = datetime.fromisoformat(pub_date.replace('Z', '+00:00')) if isinstance(pub_date, str) else pub_date
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
            
            print(f"✅ Found {len(raw_content)} unique results via Exa API")
            state["raw_content"] = raw_content
            return state
            
        except Exception as e:
            print(f"❌ Exa API error: {e}")
    
    # No API available - return error
    print("❌ ERROR: Exa API not available!")
    print("   Please configure EXA_API_KEY in .env file")
    print("   - Get Exa API key: https://exa.ai/")
    
    state["raw_content"] = []
    return state


# Mock data removed - use real APIs only (Exa or Tavily)


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
            date_val = item.get('published_date') or item.get('timestamp')
            
            if isinstance(date_val, str):
                pub_datetime = datetime.fromisoformat(date_val.replace('Z', '+00:00'))
            else:
                pub_datetime = date_val
            
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
        state["risk_metrics"] = {"score": 0, "level": "LOW", "velocity": 0}
        state["rag_findings"] = "No recent content found (past 2 days)."
        return state
    
    # ============================================================================
    # STEP 1: CONVERT FILTERED CONTENT TO DOCUMENTS
    # ============================================================================
    print("📚 Step 1: Converting filtered content to documents...")
    documents = []
    for idx, item in enumerate(filtered_content):
        title = item.get('title', 'No Title')
        content = (f"Title: {title}\n"
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
        llm_strict = get_agent_llm("extraction", temperature=0.1)
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
                            llm_response = llm_strict.invoke(prompt)
                            # Handle both string and chat response formats
                            response_text = llm_response.content if hasattr(llm_response, 'content') else str(llm_response)
                            if "NO" in response_text.upper():
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
    
    # TextBlob sentiment (optional)
    if TEXTBLOB_AVAILABLE:
        blob = TextBlob(all_text)
        textblob_polarity = blob.sentiment.polarity
    else:
        # Use VADER compound score as fallback
        textblob_polarity = vader_scores['compound']
    
    # Calculate sentiment distribution
    positive_count = sum(1 for item in filtered_content 
                        if sentiment_vader.polarity_scores(item["text"])['compound'] > 0.05)
    negative_count = sum(1 for item in filtered_content 
                        if sentiment_vader.polarity_scores(item["text"])['compound'] < -0.05)
    neutral_count = len(filtered_content) - positive_count - negative_count
    
    # --- NEW: Calculate Risk Metrics (VoltGear Scenario) ---
    # 1. Risk Score (0-100)
    # Formula: (Negative% * 0.6) + (Viral Risk * 0.4)
    total_items = len(filtered_content) if filtered_content else 1
    negative_pct = (negative_count / total_items) * 100
    viral_risk_val = 0
    if emotion_analysis['viral_risk'] == "High": viral_risk_val = 100
    elif emotion_analysis['viral_risk'] == "Medium": viral_risk_val = 50
    
    reputation_risk_score = (negative_pct * 0.6) + (viral_risk_val * 0.4)
    
    # 2. Sentiment Velocity
    # Compare negative posts in last 1 hour vs previous 4 hours
    recent_negatives = 0
    past_negatives = 0
    
    for item in filtered_content:
        is_negative = sentiment_vader.polarity_scores(item["text"])['compound'] < -0.05
        if is_negative:
            hours_ago = item.get('hours_ago', 99)
            if hours_ago <= 1:
                recent_negatives += 1
            elif 1 < hours_ago <= 5:
                past_negatives += 1
                
    # Avoid division by zero
    base = past_negatives if past_negatives > 0 else 1
    velocity = ((recent_negatives - past_negatives) / base) * 100
    
    state["risk_metrics"] = {
        "score": round(reputation_risk_score, 1),
        "level": "CRITICAL" if reputation_risk_score > 80 else "HIGH" if reputation_risk_score > 50 else "MEDIUM" if reputation_risk_score > 20 else "LOW",
        "velocity": round(velocity, 1),
        "recent_negatives": recent_negatives,
        "past_negatives": past_negatives
    }
    
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

# ============================================================================
# SOCIAL MEDIA AGENT
# ============================================================================

def social_media_agent(state: AgentState) -> AgentState:
    """
    Social Media Agent: Drafts replies to negative feedback.
    """
    print("💬 Social Media Agent: Analyzing content for reply opportunities...")
    # Use filtered content as the source
    content = state.get("filtered_content", [])
    topic = state["topic"]
    
    replies = []
    
    # Filter for negative items (simple keyword match for speed + fallback)
    negative_items = []
    for item in content:
        text = item.get('text', '').lower()
        if any(w in text for w in ["frustrat", "disappoint", "bad", "fail", "bug", "issue", "terrible", "worst"]):
            negative_items.append(item)
    
    # Sort by recency and take top 5
    negative_items = sorted(negative_items, key=lambda x: x.get('published_timestamp', 0), reverse=True)[:5]
     
    try:
        llm = get_agent_llm("report", temperature=0.7)
    except:
        llm = None
        
    print(f"   Found {len(negative_items)} negative items to address.")

    for item in negative_items:
        draft = "We're sorry to hear this. Please contact support."
        if llm:
            try:
                # Truncate text for prompt
                context_text = item.get('text', '')[:300]
                prompt_text = (f"You are a social media manager for '{topic}'.\n"
                          f"Draft a polite, professional, and empathetic social media reply (max 280 chars) "
                          f"to this customer observation.\n"
                          f"Observation: \"{context_text}...\"\n"
                          f"Reply:")
                response = llm.invoke(prompt_text)
                # Handle both string and chat response formats
                draft = response.content if hasattr(response, 'content') else str(response)
                draft = draft.strip().replace('"', '')
            except Exception as e:
                print(f"Error generating reply: {e}")
        
        replies.append({
            "id": item.get('url', str(len(replies))),
            "content": item.get('text', '')[:200] + "...",
            "draft_reply": draft,
            "source": item.get('title', 'Unknown'),
            "status": "draft"
        })
        
    state["social_media_replies"] = replies
    print(f"✅ Drafted {len(replies)} replies.")
    return state


# ============================================================================
# STRATEGY AGENT
# ============================================================================

def strategy_agent(state: AgentState) -> AgentState:
    """
    Strategy Agent: Creates a detailed CEO-level strategic report DRAFT.
    """
    print("📊 Strategy Agent: Generating strategic report draft using LLM...")
    
    topic = state["topic"]
    sentiment_stats = state["sentiment_stats"]
    rag_findings = state["rag_findings"]
    emotion_analysis = state.get("emotion_analysis", {})
    revision_count = state.get("revision_count", 0)
    critic_feedback = state.get("critic_feedback", "")
    social_media_replies = state.get("social_media_replies", [])
    
    # Prepare Social Media Summary
    sm_summary = ""
    if social_media_replies:
        sm_summary = "\n### 💬 PROPOSED SOCIAL MEDIA ACTIONS\n"
        for reply in social_media_replies:
             sm_summary += f"- **Target:** {reply['source']}\n"
             sm_summary += f"  - *Issue:* {reply['content']}\n"
             sm_summary += f"  - *Draft Reply:* {reply['draft_reply']}\n"
    
    # Initialize LLM with try-except
    llm = None
    try:
        llm = get_agent_llm("report", temperature=0.7)
    except Exception as e:
        print(f"⚠️ Failed to initialize LLM: {e}")
        print(f"   Generating template report without LLM...")
    
    # If LLM is not available, create a template report
    if llm is None:
        risk_metrics = state.get("risk_metrics") or {"score": 0, "level": "LOW", "velocity": 0}
        report = f"""
# BRANDSHIELD STRATEGIC REPORT
## Brand: {topic}

### EXECUTIVE SUMMARY
This report analyzes recent brand sentiment and potential crisis indicators for {topic}.

**Risk Level**: {risk_metrics["level"]} ({risk_metrics["score"]}/100)
**Sentiment Velocity**: {risk_metrics["velocity"]}%
**Overall Sentiment**: {sentiment_stats.get('overall_sentiment', 'Unknown')}
**Dominant Emotion**: {emotion_analysis.get('dominant_emotion', 'Unknown')}

### DETAILED FINDINGS
{rag_findings}

{sm_summary}

### RECOMMENDATIONS
1. Monitor sentiment trends closely
2. Address negative feedback promptly
3. Prepare crisis communication materials
4. Review social media engagement strategy

---
*Generated by BrandShield Deep Research Agent*
*Note: Full LLM-generated report unavailable - using template*
"""
        state["draft_report"] = report
        state["revision_count"] = revision_count
        state["final_report"] = report
        print("✅ Strategic report template generated (LLM unavailable)")
        return state
    
    # Construct the prompt
    prompt_template = """
You are the Chief Brand Strategist for {topic}. 
Your job is to write a high-level strategic report for the CEO based on the following data.

### 📊 DATA INPUTS
- **Risk Score:** {risk_score}/100 ({risk_level})
- **Sentiment Velocity:** {velocity}%
- **Overall Sentiment:** {overall_sentiment}
- **Dominant Emotion:** {dominant_emotion} (Viral Risk: {viral_risk})

### 🧠 RESEARCH FINDINGS
{rag_findings}

### 💬 SOCIAL MEDIA ENGAGEMENT PLAN
{sm_summary}

### 📝 CRITIC FEEDBACK (If any):
{critic_feedback}

### 🎯 INSTRUCTIONS
Write a professional, actionable strategic report in Markdown format.
Include:
1. **EXECUTIVE SUMMARY**
2. **RISK ASSESSMENT**
3. **STRATEGIC RECOMMENDATIONS**
4. **SOCIAL MEDIA REVIEW** (Evaluate the proposed replies briefly)
5. **CRISIS CHECKLIST**

**Tone:** Professional, objective, and decisive.

### GENERATED REPORT:
"""
    
    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["topic", "risk_score", "risk_level", "velocity", "overall_sentiment", 
                         "dominant_emotion", "viral_risk", "rag_findings", "sm_summary", "critic_feedback"]
    )
    
    risk_metrics = state.get("risk_metrics") or {"score": 0, "level": "LOW", "velocity": 0}
    
    formatted_prompt = prompt.format(
        topic=topic,
        risk_score=risk_metrics["score"],
        risk_level=risk_metrics["level"],
        velocity=risk_metrics["velocity"],
        overall_sentiment=sentiment_stats.get('overall_sentiment', 'Unknown'),
        dominant_emotion=emotion_analysis.get('dominant_emotion', 'Unknown'),
        viral_risk=emotion_analysis.get('viral_risk', 'Unknown'),
        rag_findings=rag_findings,
        sm_summary=sm_summary,
        critic_feedback=critic_feedback if critic_feedback else "None."
    )
    
    try:
        print("   🧠 Invoking LLM for strategy generation...")
        response = llm.invoke(formatted_prompt)
        # Handle both string and chat response formats
        report = response.content if hasattr(response, 'content') else str(response)
        report += "\n\n---\n\n*Generated by BrandShield Deep Research Agent*"
    except Exception as e:
        print(f"   ❌ LLM Generation Failed: {e}")
        report = f"ERROR: Could not generate report.\n\nDetails: {e}"

    state["draft_report"] = report
    state["revision_count"] = revision_count
    state["final_report"] = report 
    
    print("✅ Strategic report draft complete")
    
    return state
