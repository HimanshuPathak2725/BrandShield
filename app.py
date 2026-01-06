"""
BrandShield_Lite - Streamlit Dashboard
Advanced Brand Sentiment & Crisis Detection System
"""
import streamlit as st
import matplotlib.pyplot as plt
import plotly.graph_objects as go
from dotenv import load_dotenv
import os
import sys

# Add src to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.graph import create_phase1_graph, create_phase2_graph
from src.state import AgentState

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="BrandShield Deep Research",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 1rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
    }
    .result-card {
        background-color: #ffffff;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        margin-bottom: 1rem;
        border: 1px solid #f0f0f0;
    }
    .positive { color: #28a745; }
    .negative { color: #dc3545; }
    .neutral { color: #ffc107; }
</style>
""", unsafe_allow_html=True)


def plot_sentiment_pie_matplotlib(sentiment_stats):
    """Create a pie chart using Matplotlib"""
    labels = ['Positive', 'Neutral', 'Negative']
    sizes = [
        sentiment_stats.get('positive', 0),
        sentiment_stats.get('neutral', 0),
        sentiment_stats.get('negative', 0)
    ]
    colors = ['#28a745', '#ffc107', '#dc3545']
    explode = (0.05, 0, 0.05)
    
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.pie(sizes, explode=explode, labels=labels, colors=colors,
           autopct='%1.1f%%', shadow=True, startangle=90)
    ax.axis('equal')
    plt.title('Sentiment Distribution', fontsize=16, fontweight='bold')
    return fig


def plot_sentiment_pie_plotly(sentiment_stats):
    """Create an interactive pie chart using Plotly"""
    labels = ['Positive', 'Neutral', 'Negative']
    values = [
        sentiment_stats.get('positive', 0),
        sentiment_stats.get('neutral', 0),
        sentiment_stats.get('negative', 0)
    ]
    colors = ['#28a745', '#ffc107', '#dc3545']
    
    fig = go.Figure(data=[go.Pie(
        labels=labels,
        values=values,
        marker=dict(colors=colors),
        hole=0.3,
        textinfo='label+percent',
        textfont_size=14,
        pull=[0.05, 0, 0.05]
    )])
    
    fig.update_layout(
        title={
            'text': 'Sentiment Distribution',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 20, 'weight': 'bold'}
        },
        showlegend=True,
        height=400
    )
    return fig


def plot_risk_gauge(score):
    """Create a gauge chart for Risk Score"""
    fig = go.Figure(go.Indicator(
        mode = "gauge+number",
        value = score,
        domain = {'x': [0, 1], 'y': [0, 1]},
        title = {'text': "Reputation Risk Index"},
        gauge = {
            'axis': {'range': [None, 100]},
            'bar': {'color': "darkred" if score > 80 else "orange" if score > 50 else "green"},
            'steps': [
                {'range': [0, 20], 'color': "lightgreen"},
                {'range': [20, 50], 'color': "lightyellow"},
                {'range': [50, 80], 'color': "orange"},
                {'range': [80, 100], 'color': "red"}],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': 80}}))
    return fig


def main():
    """Main Streamlit application"""
    
    # Header
    st.markdown('<div class="main-header">🛡️ BrandShield Deep Research Agent</div>', unsafe_allow_html=True)
    st.markdown('<p style="text-align: center; color: #666;">Autonomous Deep Research & Crisis Response Orchestration</p>', unsafe_allow_html=True)
    
    # Sidebar
    with st.sidebar:
        st.image("https://img.icons8.com/fluency/96/000000/security-shield-green.png", width=80)
        st.title("Configuration")
        
        brand_name = st.text_input("🏢 Brand Name", value="Tesla")
        chart_type = st.radio("📊 Chart Type", ["Plotly (Interactive)", "Matplotlib (Static)"])
        
        st.markdown("---")
        st.subheader("🔑 API Status")
        st.write("**Exa API:**", "✅ Configured" if os.getenv("EXA_API_KEY") else "⚠️ Mock Data")
        st.write("**HuggingFace:**", "✅ Configured" if os.getenv("HUGGINGFACEHUB_API_TOKEN") else "⚠️ Missing")
        st.markdown("---")
        
        analyze_button = st.button("🚀 Start Deep Research", type="primary", use_container_width=True)
        reset_button = st.button("🔄 Reset", use_container_width=True)
        
    if reset_button:
        st.session_state.clear()
        st.rerun()

    # Session State Init
    if "analysis_stage" not in st.session_state:
        st.session_state.analysis_stage = "init"
    if "current_state" not in st.session_state:
        st.session_state.current_state = {}

    # Trigger Analysis
    if analyze_button:
        if not brand_name.strip():
            st.error("⚠️ Enter a brand name")
            return
        st.session_state.analysis_stage = "running_phase1"
        st.session_state.brand_name = brand_name
        st.session_state.current_state = {"topic": brand_name, "raw_content": [], "filtered_content": [], 
                                         "sentiment_stats": {}, "emotion_analysis": {}, "social_media_replies": [],
                                         "risk_metrics": {}, "rag_findings_structured": []}
        st.rerun()

    # --- PHASE 1: RESEARCH & DRAFTS ---
    if st.session_state.analysis_stage == "running_phase1":
        with st.status("🕵️‍♂️ Deep Research Agent Running...", expanded=True) as status:
            st.write("🗺️ Planning Agent: Generating research questions...")
            st.write("🔍 Search Agent: Executing multi-step deep search...")
            st.write("🧠 RAG Agent: Analyzing semantic patterns...")
            st.write("💬 Social Media Agent: Drafting replies...")
            
            try:
                app1 = create_phase1_graph()
                result = app1.invoke(st.session_state.current_state)
                st.session_state.current_state = result
                st.session_state.analysis_stage = "phase1_done"
                status.update(label="✅ Research Phase Complete!", state="complete", expanded=False)
                st.rerun()
            except Exception as e:
                st.error(f"Error in Phase 1: {e}")
                st.stop()

    # --- HITL: REVIEW REPLIES ---
    if st.session_state.analysis_stage == "phase1_done":
        result = st.session_state.current_state
        
        st.info("✅ **Human-in-the-Loop Required**: Please review the AI's draft social media replies before final strategy generation.")
        
        col1, col2 = st.columns([1, 1])
        with col1:
             st.markdown("### 🔍 Research Summary")
             st.markdown(f"**Risk Score:** {result.get('risk_metrics', {}).get('score', 0)}/100")
             st.markdown(f"**Dominant Emotion:** {result.get('emotion_analysis', {}).get('dominant_emotion', 'Unknown')}")
        
        with col2:
             st.markdown("### 📋 Plan")
             st.write(f"Research Plan: {result.get('research_plan', [])}")

        st.markdown("---")
        st.subheader("💬 Review Draft Replies")
        
        replies = result.get('social_media_replies', [])
        if not replies:
            st.warning("No negative issues found requiring replies.")
        
        updated_replies = []
        with st.form("hitl_form"):
            for i, rep in enumerate(replies):
                st.markdown(f"**{i+1}. Source:** {rep['source']}")
                st.markdown(f"> *\"{rep['content']}\"*")
                new_draft = st.text_area("Draft Reply:", value=rep['draft_reply'], key=f"d_{i}", height=100)
                updated_replies.append({**rep, "draft_reply": new_draft, "status": "approved"})
                st.divider()
            
            submit_review = st.form_submit_button("✅ Approve Replies & Generate Strategy", type="primary")
        
        if submit_review:
            st.session_state.current_state['social_media_replies'] = updated_replies
            st.session_state.analysis_stage = "running_phase2"
            st.rerun()
            
    # --- PHASE 2: STRATEGY & REPORT ---
    if st.session_state.analysis_stage == "running_phase2":
        with st.status("🧠 Strategy Agent Running...", expanded=True) as status:
            st.write("📊 Strategy Agent: Synthesizing full report...")
            st.write("📝 Critic Agent: Reviewing and refining...")
            
            try:
                app2 = create_phase2_graph()
                result = app2.invoke(st.session_state.current_state)
                st.session_state.current_state = result
                st.session_state.analysis_stage = "complete"
                status.update(label="✅ Strategy Generation Complete!", state="complete", expanded=False)
                st.rerun()
            except Exception as e:
                 st.error(f"Error in Phase 2: {e}")
                 st.stop()

    # --- FINAL DISPLAY (War Room) ---
    if st.session_state.analysis_stage == "complete":
        result = st.session_state.current_state
        brand_name = st.session_state.get('brand_name', 'Unknown')
        sentiment_stats = result.get('sentiment_stats', {})
        
        st.markdown("---")
        st.markdown("## 🚨 Crisis Command Center")
        
        risk_metrics = result.get("risk_metrics", {"score": 0, "level": "LOW", "velocity": 0})
        col1, col2, col3 = st.columns(3)
        with col1: st.plotly_chart(plot_risk_gauge(risk_metrics["score"]), use_container_width=True)
        with col2: st.metric(label="Sentiment Velocity", value=f"{risk_metrics['velocity']}%")
        with col3: st.metric(label="Risk Level", value=risk_metrics["level"])
        
        st.markdown("---")
        
        # Sentiment Chart
        st.subheader("📈 Sentiment Distribution")
        if "Plotly" in chart_type:
            st.plotly_chart(plot_sentiment_pie_plotly(sentiment_stats), use_container_width=True)
        else:
            st.pyplot(plot_sentiment_pie_matplotlib(sentiment_stats))
            
        st.markdown("---")
        st.subheader("📋 AI Strategic Report")
        st.markdown(result['final_report'])
        
        st.download_button("📥 Download Report", result['final_report'], "report.md")


if __name__ == "__main__":
    main()
