"""
Advanced agent implementations for BrandShield_Lite Elite.
Contains Emotion Analyzer, CRAG Logic, and Critic Agent.
"""
from typing import Dict, Any, List
from datetime import datetime, timedelta
import numpy as np

try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
    # Initialize emotion classifier (SamLowe/roberta-base-go_emotions)
    emotion_classifier = None  # Lazy loading
except ImportError:
    TRANSFORMERS_AVAILABLE = False

from src.state import AgentState


# ============================================================================
# EMOTION VELOCITY ANALYZER
# ============================================================================

def analyze_emotions(filtered_content: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Advanced emotion analysis using go_emotions model.
    Tracks emotion velocity and identifies trend shifts.
    """
    global emotion_classifier
    
    if not TRANSFORMERS_AVAILABLE:
        return _fallback_emotion_analysis(filtered_content)
    
    try:
        # Lazy load the model
        if emotion_classifier is None:
            print("   📥 Loading go_emotions model (first run only)...")
            emotion_classifier = pipeline(
                "text-classification",
                model="SamLowe/roberta-base-go_emotions",
                top_k=None,
                device=-1  # CPU
            )
        
        # Analyze emotions for each article
        emotion_timeline = []
        all_emotions = {
            'anger': [], 'sadness': [], 'joy': [], 'fear': [], 
            'surprise': [], 'disgust': [], 'neutral': []
        }
        
        for item in filtered_content:
            text = item['text'][:512]  # Truncate for model
            results = emotion_classifier(text)[0]
            
            # Extract top emotions
            emotions = {r['label']: r['score'] for r in results}
            
            # Track timeline
            emotion_timeline.append({
                'time': item.get('hours_ago', 0),
                'emotions': emotions,
                'title': item['title']
            })
            
            # Aggregate emotions
            for emotion in all_emotions.keys():
                if emotion in emotions:
                    all_emotions[emotion].append(emotions[emotion])
        
        # Calculate emotion velocity (trend)
        velocity = _calculate_emotion_velocity(emotion_timeline)
        
        # Identify dominant emotion
        avg_emotions = {k: np.mean(v) if v else 0 for k, v in all_emotions.items()}
        dominant_emotion = max(avg_emotions, key=avg_emotions.get)
        
        # Check for dangerous trend (sadness -> anger)
        danger_score = _calculate_danger_score(velocity, avg_emotions)
        
        return {
            'dominant_emotion': dominant_emotion,
            'emotion_scores': avg_emotions,
            'emotion_timeline': emotion_timeline,
            'velocity': velocity,
            'danger_score': danger_score,
            'trend_analysis': _interpret_trend(velocity, dominant_emotion),
            'viral_risk': 'HIGH' if danger_score > 0.7 else 'MEDIUM' if danger_score > 0.4 else 'LOW'
        }
        
    except Exception as e:
        print(f"   ⚠️ Emotion analysis error: {e}")
        return _fallback_emotion_analysis(filtered_content)


def _fallback_emotion_analysis(filtered_content: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Fallback emotion analysis using VADER when transformers unavailable."""
    from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
    
    vader = SentimentIntensityAnalyzer()
    emotions = {'negative': [], 'neutral': [], 'positive': []}
    
    for item in filtered_content:
        scores = vader.polarity_scores(item['text'])
        emotions['negative'].append(scores['neg'])
        emotions['neutral'].append(scores['neu'])
        emotions['positive'].append(scores['pos'])
    
    avg_neg = np.mean(emotions['negative']) if emotions['negative'] else 0
    
    return {
        'dominant_emotion': 'anger' if avg_neg > 0.5 else 'neutral',
        'emotion_scores': {
            'anger': avg_neg,
            'neutral': np.mean(emotions['neutral']) if emotions['neutral'] else 0,
            'joy': np.mean(emotions['positive']) if emotions['positive'] else 0
        },
        'emotion_timeline': [],
        'velocity': {'anger_velocity': 0, 'sadness_velocity': 0},
        'danger_score': avg_neg,
        'trend_analysis': 'Limited emotion analysis (transformers not available)',
        'viral_risk': 'MEDIUM' if avg_neg > 0.5 else 'LOW'
    }


def _calculate_emotion_velocity(timeline: List[Dict]) -> Dict[str, float]:
    """Calculate how quickly emotions are changing over time."""
    if len(timeline) < 2:
        return {'anger_velocity': 0, 'sadness_velocity': 0}
    
    # Sort by time (most recent first)
    timeline = sorted(timeline, key=lambda x: x['time'])
    
    # Calculate velocity for key emotions
    anger_trend = []
    sadness_trend = []
    
    for entry in timeline:
        emotions = entry['emotions']
        anger_trend.append(emotions.get('anger', 0))
        sadness_trend.append(emotions.get('sadness', 0))
    
    # Calculate slope (simple linear trend)
    anger_velocity = (anger_trend[-1] - anger_trend[0]) if len(anger_trend) > 1 else 0
    sadness_velocity = (sadness_trend[-1] - sadness_trend[0]) if len(sadness_trend) > 1 else 0
    
    return {
        'anger_velocity': anger_velocity,
        'sadness_velocity': sadness_velocity
    }


def _calculate_danger_score(velocity: Dict, emotions: Dict) -> float:
    """
    Calculate viral boycott risk.
    High anger + increasing anger velocity = danger!
    """
    anger_level = emotions.get('anger', 0)
    anger_vel = velocity.get('anger_velocity', 0)
    
    # Danger = high anger level + positive velocity (increasing)
    danger_score = (anger_level * 0.7) + (max(0, anger_vel) * 0.3)
    
    return min(1.0, danger_score)


def _interpret_trend(velocity: Dict, dominant_emotion: str) -> str:
    """Interpret the emotion trend for human readers."""
    anger_vel = velocity.get('anger_velocity', 0)
    sadness_vel = velocity.get('sadness_velocity', 0)
    
    if anger_vel > 0.2:
        return "⚠️ CRITICAL: Anger is escalating rapidly. High viral boycott risk!"
    elif anger_vel > 0.1:
        return "🟠 WARNING: Anger levels are rising. Monitor closely."
    elif sadness_vel > 0.2 and dominant_emotion == 'sadness':
        return "🟡 WATCH: Sadness increasing. May shift to anger if unaddressed."
    elif dominant_emotion == 'anger':
        return "🔴 ALERT: Anger is dominant emotion. Immediate response needed."
    else:
        return "🟢 STABLE: Emotions are stable or improving."


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
    Legal/PR Critic Agent: Reviews strategy reports for issues.
    
    Checks for:
    - Hallucinations (unsupported claims)
    - Tone-deafness (inappropriate language)
    - Legal liability (promises we can't keep)
    - Missing critical issues
    
    Returns feedback and approval status.
    """
    print("🎭 Critic Agent: Reviewing strategic report...")
    
    draft_report = state.get("draft_report", state.get("final_report", ""))
    rag_findings = state["rag_findings"]
    emotion_analysis = state.get("emotion_analysis", {})
    revision_count = state.get("revision_count", 0)
    
    issues = []
    severity = []
    
    # ============================================================================
    # CHECK 1: Hallucination Detection
    # ============================================================================
    print("   🔍 Check 1: Scanning for unsupported claims...")
    
    # Check if report makes claims not backed by RAG findings
    action_keywords = ['will', 'promise', 'guarantee', 'commit', 'ensure']
    for keyword in action_keywords:
        if keyword in draft_report.lower():
            if 'immediate investigation' not in draft_report.lower():
                issues.append(f"⚠️ Contains promise '{keyword}' without concrete action plan")
                severity.append('MEDIUM')
    
    # ============================================================================
    # CHECK 2: Tone-Deafness Detection
    # ============================================================================
    print("   🎭 Check 2: Analyzing tone appropriateness...")
    
    inappropriate_phrases = [
        'don\'t worry', 'calm down', 'overreacting', 'not a big deal',
        'just a few', 'minor issue', 'isolated incident'
    ]
    
    for phrase in inappropriate_phrases:
        if phrase in draft_report.lower():
            issues.append(f"🔴 TONE-DEAF: Contains dismissive phrase: '{phrase}'")
            severity.append('HIGH')
    
    # Check if high anger but report lacks urgency
    if emotion_analysis.get('viral_risk') == 'HIGH':
        if 'immediate' not in draft_report.lower() and 'urgent' not in draft_report.lower():
            issues.append("🔴 MISMATCH: High anger detected but report lacks urgency")
            severity.append('HIGH')
    
    # ============================================================================
    # CHECK 3: Legal Liability
    # ============================================================================
    print("   ⚖️ Check 3: Checking for legal liability...")
    
    risky_phrases = [
        'admit fault', 'we are responsible', 'we caused', 'our mistake',
        'compensation', 'refund all', 'sue'
    ]
    
    for phrase in risky_phrases:
        if phrase in draft_report.lower():
            issues.append(f"⚖️ LEGAL RISK: Contains potentially liable statement: '{phrase}'")
            severity.append('CRITICAL')
    
    # ============================================================================
    # CHECK 4: Completeness
    # ============================================================================
    print("   📋 Check 4: Verifying completeness...")
    
    required_sections = ['immediate action', 'short-term', 'long-term']
    for section in required_sections:
        if section not in draft_report.lower():
            issues.append(f"📋 INCOMPLETE: Missing '{section}' section")
            severity.append('MEDIUM')
    
    # Check if critical findings are addressed
    if 'safety' in rag_findings.lower() and 'safety' not in draft_report.lower():
        issues.append("🔴 CRITICAL: Safety issues found but not addressed in report")
        severity.append('CRITICAL')
    
    # ============================================================================
    # DECISION: APPROVE OR REJECT
    # ============================================================================
    
    critical_count = severity.count('CRITICAL')
    high_count = severity.count('HIGH')
    
    if critical_count > 0 or high_count > 1:
        approved = False
        decision = "❌ REJECTED"
        print(f"   ❌ Report REJECTED ({critical_count} critical, {high_count} high severity issues)")
    elif len(issues) > 0 and revision_count < 2:
        approved = False
        decision = "⚠️ NEEDS REVISION"
        print(f"   ⚠️ Report needs revision ({len(issues)} issues found)")
    else:
        approved = True
        decision = "✅ APPROVED"
        print("   ✅ Report APPROVED by Critic")
    
    # Compile feedback
    if issues:
        feedback = f"""
## 🎭 CRITIC AGENT REVIEW - {decision}

**Revision #{revision_count + 1}**

### Issues Identified:
"""
        for i, (issue, sev) in enumerate(zip(issues, severity), 1):
            feedback += f"\n{i}. [{sev}] {issue}"
        
        feedback += "\n\n### Recommendations:\n"
        if not approved:
            feedback += "- Address all CRITICAL and HIGH severity issues before resubmission\n"
            feedback += "- Ensure tone matches the severity of the crisis\n"
            feedback += "- Back all claims with evidence from RAG findings\n"
            feedback += "- Consult legal team before making any liability statements\n"
        else:
            feedback += "- Minor issues noted but acceptable for publication\n"
            feedback += "- Recommend final human review via HITL checkpoint\n"
    else:
        feedback = f"""
## 🎭 CRITIC AGENT REVIEW - ✅ APPROVED

**Revision #{revision_count + 1}**

No issues found. Report is ready for human approval.
"""
    
    state["critic_feedback"] = feedback
    state["critic_approved"] = approved
    
    return state
