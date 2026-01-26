"""
BrandShield Enterprise - Real-Time Crisis Intelligence Platform
"""
import streamlit as st
import asyncio
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import time
from datetime import datetime

# Services
from services.auth_service import auth_service
from src.graph import create_enterprise_graph
from src.state import AgentState

# Setup
st.set_page_config(page_title="BrandShield Enterprise", page_icon="🛡️", layout="wide")

# Custom CSS
st.markdown("""
<style>
    .metric-card {
        background-color: #1E1E1E;
        padding: 20px;
        border-radius: 10px;
        border-left: 5px solid #4CAF50;
    }
    .crisis-card {
        border-left: 5px solid #F44336;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 24px;
    }
    .stTabs [data-baseweb="tab"] {
        height: 50px;
    }
</style>
""", unsafe_allow_html=True)

# Session State Init
if "token" not in st.session_state:
    st.session_state.token = None
if "monitor_active" not in st.session_state:
    st.session_state.monitor_active = False
if "brand_data" not in st.session_state:
    st.session_state.brand_data = None

# --- AUTHENTICATION ---
def login_screen():
    st.title("🛡️ BrandShield Enterprise Login")
    
    col1, col2 = st.columns([1, 2])
    with col1:
        email = st.text_input("Email", "admin@brandshield.ai")
        password = st.text_input("Password", "password123", type="password")
        
        if st.button("Login"):
            token = auth_service.login(email, password)
            if token:
                st.session_state.token = token
                st.success("Authenticated")
                st.rerun()
            else:
                st.error("Invalid credentials")

# --- MAIN DASHBOARD ---
async def run_analysis_loop(brand_name):
    graph = create_enterprise_graph()
    
    # Initial State
    state = AgentState(
        topic=brand_name,
        org_id="org_default",
        raw_content=[],
        filtered_content=[],
        sentiment_stats={},
        risk_metrics={},
        emotion_analysis={},
        rag_findings="",
        rag_findings_structured=[],
        rag_quality_score=0.0,
        crisis_velocity={},
        response_strategies=[],
        simulation_results={},
        best_strategy={},
        influencers=[],
        alerts_triggered=[],
        draft_report="",
        critic_feedback="",
        critic_approved=False,
        final_report="",
        human_approved=False,
        revision_count=0,
        research_plan=[],
        social_media_replies=[],
        human_feedback=""
    )
    
    result = await graph.ainvoke(state)
    return result

def dashboard_screen():
    # Sidebar
    st.sidebar.title("BrandShield Engine")
    st.sidebar.markdown("---")
    brand_name = st.sidebar.text_input("Monitor Brand", "Tesla")
    
    col1, col2 = st.sidebar.columns(2)
    start_btn = col1.button("Start Monitor")
    stop_btn = col2.button("Stop")
    
    if start_btn:
        st.session_state.monitor_active = True
    if stop_btn:
        st.session_state.monitor_active = False
        
    st.sidebar.markdown("### Status")
    if st.session_state.monitor_active:
        st.sidebar.success("● Live Listening Active")
    else:
        st.sidebar.warning("○ Paused")

    # Main Area
    st.title(f"🛡️ BrandShield Dashboard: {brand_name}")
    
    # Tabs
    tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
        "Live Feed", 
        "Crisis Prediction", 
        "Suggested Responses", 
        "Simulation", 
        "Influencers", 
        "Alerts"
    ])
    
    # Main Loop Placeholder
    main_placeholder = st.empty()
    
    if st.session_state.monitor_active:
        with st.spinner("Connecting to satellite feeds..."):
            # Run Async Loop
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                result = loop.run_until_complete(run_analysis_loop(brand_name))
                st.session_state.brand_data = result
            except Exception as e:
                st.error(f"Engine Error: {e}")
                
        # Simulate Refresh Interval
        time.sleep(2) # Refresh every 2s for UI (real fetches controlled by backend)
        st.rerun()

    # Display Data if available
    data = st.session_state.brand_data
    if not data:
        st.info("Start monitoring to see real-time data.")
        return

    with tab1: #  Feed
        st.subheader("📡 Real-Time Social Ingestion")
        
        # Metrics
        m1, m2, m3 = st.columns(3)
        posts = data.get("raw_content", [])
        m1.metric("Live Posts (1m)", len(posts))
        m2.metric("Negative Sentiment", f"{sum(1 for p in posts if 'outrage' in p['text']) / max(1, len(posts)) * 100:.0f}%")
        m3.metric("Engagement Velocity", "High", delta="Up")
        
        # Feed
        for post in posts[:5]:
            with st.container():
                st.markdown(f"**{post['platform'].upper()}** | @{post['author']} | {post['timestamp']}")
                st.info(post['text'])
                st.markdown("---")

    with tab2: # Crisis Prediction
        st.subheader("📉 Crisis Velocity Prediction")
        vel = data.get("crisis_velocity", {})
        
        prob = vel.get("trend_probability", 0)
        
        fig = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = prob,
            title = {'text': "Crisis Probability"},
            gauge = {'axis': {'range': [None, 100]},
                     'bar': {'color': "red" if prob > 70 else "green"}}
        ))
        st.plotly_chart(fig)
        
        st.metric("Current Mentions/min", vel.get("current_velocity", 0))
        st.metric("Predicted (2h)", vel.get("predicted_velocity_2h", 0))

    with tab3: # Suggested Responses
        st.subheader("🧠 AI-Generated PR Strategies")
        strategies = data.get("response_strategies", [])
        
        for s in strategies:
            with st.expander(f"Strategy: {s['style'].title()}", expanded=True):
                st.write(s['text'])
                if st.button(f"Approve {s['style']}", key=s['style']):
                    st.success("Sent to PR Team")

    with tab4: # Simulation
        st.subheader("🧪 Crowd Reaction Simulator")
        sim_res = data.get("simulation_results", {}).get("all_simulations", [])
        
        if sim_res:
            df_sim = pd.DataFrame()
            for res in sim_res:
                df_temp = pd.DataFrame({
                    "Hour": [1, 2, 3, 4, 5],
                    "Sentiment": res['curve'],
                    "Style": res['style']
                })
                df_sim = pd.concat([df_sim, df_temp])
            
            fig = px.line(df_sim, x="Hour", y="Sentiment", color="Style", title="Predicted Sentiment Recovery (24h)")
            st.plotly_chart(fig)
            
            best = data.get("best_strategy", {})
            st.success(f"✅ RECOMMENDED STRATEGY: {best.get('style', '').upper()} (Lowest Risk Score: {best.get('risk_score', 0):.2f})")

    with tab5: # Influencers
        st.subheader("👥 Top Amplifiers")
        infs = data.get("influencers", [])
        if infs:
            st.dataframe(pd.DataFrame(infs))
            
    with tab6: # Alerts
        st.subheader("🚨 Alert Logs")
        alerts = data.get("alerts_triggered", [])
        for alert in alerts:
            st.error(f"{alert['msg']}")

# --- APP ENTRY ---
if __name__ == "__main__":
    if not st.session_state.token:
        login_screen()
    else:
        dashboard_screen()
