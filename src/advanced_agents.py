"""
Advanced agent implementations for BrandShield_Lite.
Contains simplified Emotion Analyzer, CRAG Logic, and Critic Agent.
Simplified for demo - removed heavy transformers dependency.
"""
from typing import Dict, Any, List
from datetime import datetime, timedelta
import numpy as np

# Use VADER for fast emotion analysis (no transformers needed)
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from src.state import AgentState
from src.llm_utils import get_llm, get_agent_llm
from langchain.prompts import PromptTemplate


# ============================================================================
# SIMPLIFIED EMOTION ANALYZER (No Transformers)
# ============================================================================

def analyze_emotions(filtered_content: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Simplified emotion analysis using VADER only (fast & demo-ready).
    Tracks basic emotions without heavy ML models.
    """
    vader = SentimentIntensityAnalyzer()
    
    # Analyze emotions for each article
    emotions = {'anger': [], 'neutral': [], 'joy': []}
    
    for item in filtered_content:
        text = item.get('text', '')[:512]  # Truncate for speed
        scores = vader.polarity_scores(text)
        
        # Map VADER scores to basic emotions
        emotions['anger'].append(scores['neg'])
        emotions['neutral'].append(scores['neu'])
        emotions['joy'].append(scores['pos'])
    
    # Calculate averages
    avg_anger = np.mean(emotions['anger']) if emotions['anger'] else 0
    avg_neutral = np.mean(emotions['neutral']) if emotions['neutral'] else 0
    avg_joy = np.mean(emotions['joy']) if emotions['joy'] else 0
    
    # Determine dominant emotion
    emotion_map = {
        'anger': avg_anger,
        'neutral': avg_neutral,
        'joy': avg_joy
    }
    dominant_emotion = max(emotion_map, key=emotion_map.get)
    
    # Calculate danger score based on anger levels
    danger_score = avg_anger
    
    # Determine viral risk
    viral_risk = 'HIGH' if danger_score > 0.7 else 'MEDIUM' if danger_score > 0.4 else 'LOW'
    
    # Simple trend analysis
    trend_analysis = _interpret_trend(avg_anger, dominant_emotion)
    
    return {
        'dominant_emotion': dominant_emotion,
        'emotion_scores': {
            'anger': avg_anger,
            'neutral': avg_neutral,
            'joy': avg_joy,
            'sadness': avg_anger * 0.5,  # Approximate
            'fear': 0,
            'surprise': 0,
            'disgust': avg_anger * 0.3
        },
        'emotion_timeline': [],  # Simplified - not calculated
        'velocity': {'anger_velocity': 0, 'sadness_velocity': 0},
        'danger_score': danger_score,
        'trend_analysis': trend_analysis,
        'viral_risk': viral_risk
    }


def _interpret_trend(anger_level: float, dominant_emotion: str) -> str:
    """Interpret the emotion trend for human readers."""
    if anger_level > 0.7:
        return "⚠️ CRITICAL: Very high anger levels detected. Immediate action required!"
    elif anger_level > 0.5:
        return "🟠 WARNING: Elevated anger levels. Monitor situation closely."
    elif anger_level > 0.3:
        return "🟡 CAUTION: Moderate negativity detected."
    elif dominant_emotion == 'anger':
        return "🔴 ALERT: Anger is dominant emotion."
    else:
        return "🟢 STABLE: Emotions are neutral or positive."


# ============================================================================
# CORRECTIVE RAG (CRAG) LOGIC
# ============================================================================

def check_rag_relevance(retrieved_docs: List, query: str, threshold: float = 0.3) -> bool:
    """
    Check if retrieved documents are actually relevant to the crisis query.
    Returns True if relevant, False if need to refine search.
    """
    if not retrieved_docs:
        return False
    
    # Simple relevance check: count crisis-related keywords
    crisis_keywords = [
        'crisis', 'problem', 'issue', 'complaint', 'angry', 'frustrated',
        'bug', 'crash', 'safety', 'danger', 'hate', 'toxic', 'fail'
    ]
    
    relevant_count = 0
    for doc in retrieved_docs:
        content_lower = doc.page_content.lower()
        if any(keyword in content_lower for keyword in crisis_keywords):
            relevant_count += 1
    
    relevance_ratio = relevant_count / len(retrieved_docs)
    return relevance_ratio >= threshold


def refine_search_query(original_query: str, topic: str) -> str:
    """
    Generate an alternative search query if initial RAG retrieval was poor.
    """
    alternative_queries = {
        'hate speech': f'{topic} controversy scandal backlash',
        'product frustration': f'{topic} customer complaints reviews problems',
        'technical bugs': f'{topic} software error crash failure report',
        'safety risks': f'{topic} safety recall warning danger hazard'
    }
    
    for key, alternative in alternative_queries.items():
        if key in original_query.lower():
            return alternative
    
    return f'{topic} problems issues concerns'


# ============================================================================
# CRITIC AGENT (Red Teaming)
# ============================================================================

def critic_agent(state: AgentState) -> AgentState:
    """
    Legal/PR Critic Agent: Reviews strategy reports for issues using LLM.
    
    Checks for:
    - Hallucinations (unsupported claims)
    - Tone-deafness (inappropriate language)
    - Legal liability (promises we can't keep)
    - Missing critical issues
    
    Returns feedback and approval status.
    """
    print("🎭 Critic Agent: Reviewing strategic report using LLM...")
    
    draft_report = state.get("draft_report", state.get("final_report", ""))
    rag_findings = state["rag_findings"]
    emotion_analysis = state.get("emotion_analysis", {})
    revision_count = state.get("revision_count", 0)
    
    # Initialize LLM
    try:
        llm = get_agent_llm("critic", temperature=0.2)
    except Exception as e:
        print(f"⚠️ Failed to initialize LLM: {e}. Falling back to manual approval.")
        state["critic_approved"] = True
        state["critic_feedback"] = "⚠️ Critic Agent skipped due to LLM error."
        return state

    # Construct the prompt
    prompt_template = """
You are a Senior Legal & PR Crisis Consultant. 
Your job is to "Red Team" (critique) a draft strategic report.

### 📄 DRAFT REPORT TO REVIEW:
{draft_report}

### 🔍 CONTEXT (GROUND TRUTH):
- **RAG Findings:** {rag_findings}
- **Viral Risk:** {viral_risk}

### 🎯 INSTRUCTIONS
Analyze the report for the following risks:
1. **Hallucinations**: Does it make claims not supported by the RAG findings?
2. **Tone Deafness**: Is the tone appropriate for the crisis level? (e.g., too casual during a safety crisis)
3. **Legal Liability**: Does it admit fault or promise compensation without legal review?
4. **Completeness**: Does it address all critical issues found in the RAG analysis?

### 📝 OUTPUT FORMAT
You must output your review in the following format:

**DECISION:** [APPROVED or REJECTED]

**ISSUES FOUND:**
- [SEVERITY: HIGH/MEDIUM/LOW] Description of issue 1
- [SEVERITY: HIGH/MEDIUM/LOW] Description of issue 2

**FEEDBACK FOR STRATEGIST:**
(Specific instructions on how to fix the report)

**Note:** 
- Reject the report if there are ANY "HIGH" severity issues.
- Approve the report if there are only "LOW" or no issues.
"""

    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["draft_report", "rag_findings", "viral_risk"]
    )
    
    formatted_prompt = prompt.format(
        draft_report=draft_report,
        rag_findings=rag_findings,
        viral_risk=emotion_analysis.get('viral_risk', 'Unknown')
    )
    
    try:
        print("   🧠 Invoking LLM for critique...")
        response = llm.invoke(formatted_prompt)
        # Handle both string and chat response formats
        critique = response.content if hasattr(response, 'content') else str(response)
        
        # Parse decision
        if "DECISION: APPROVED" in critique or "DECISION: **APPROVED**" in critique:
            approved = True
            print("   ✅ Report APPROVED by Critic (LLM)")
        else:
            approved = False
            print("   ❌ Report REJECTED by Critic (LLM)")
            
        # Force approval if max revisions reached to prevent infinite loop
        if revision_count >= 2 and not approved:
            print("   ⚠️ Max revisions reached. Forcing approval with warning.")
            approved = True
            critique += "\n\n⚠️ **NOTE:** Max revisions reached. Proceeding with known issues."

    except Exception as e:
        print(f"   ❌ LLM Critique Failed: {e}")
        critique = f"ERROR: Could not generate critique due to LLM failure.\n\nDetails: {e}"
        approved = True # Fail open to avoid blocking

    state["critic_feedback"] = critique
    state["critic_approved"] = approved
    
    return state
