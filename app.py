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

from src.graph import run_analysis
from src.state import AgentState


# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="BrandShield Lite",
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
    .positive { color: #28a745; }
    .negative { color: #dc3545; }
    .neutral { color: #ffc107; }
</style>
""", unsafe_allow_html=True)


def plot_sentiment_pie_matplotlib(sentiment_stats):
    """Create a pie chart using Matplotlib"""
    labels = ['Positive', 'Neutral', 'Negative']
    sizes = [
        sentiment_stats['positive'],
        sentiment_stats['neutral'],
        sentiment_stats['negative']
    ]
    colors = ['#28a745', '#ffc107', '#dc3545']
    explode = (0.05, 0, 0.05)  # Explode positive and negative slices
    
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
        sentiment_stats['positive'],
        sentiment_stats['neutral'],
        sentiment_stats['negative']
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


def main():
    """Main Streamlit application"""
    
    # Header
    st.markdown('<div class="main-header">🛡️ BrandShield Lite</div>', unsafe_allow_html=True)
    st.markdown('<p style="text-align: center; color: #666;">Advanced Brand Sentiment & Crisis Detection System</p>', unsafe_allow_html=True)
    
    # Sidebar
    with st.sidebar:
        st.image("https://img.icons8.com/fluency/96/000000/security-shield-green.png", width=80)
        st.title("Configuration")
        
        # Brand name input
        brand_name = st.text_input(
            "🏢 Brand Name",
            value="Tesla",
            help="Enter the brand name you want to analyze"
        )
        
        # Chart type selection
        chart_type = st.radio(
            "📊 Chart Type",
            options=["Plotly (Interactive)", "Matplotlib (Static)"],
            index=0
        )
        
        st.markdown("---")
        
        # API Status
        st.subheader("🔑 API Status")
        exa_key = os.getenv("EXA_API_KEY")
        hf_key = os.getenv("HUGGINGFACEHUB_API_TOKEN")
        
        st.write("**Exa API:**", "✅ Configured" if exa_key else "⚠️ Not configured (using mock data)")
        st.write("**HuggingFace:**", "✅ Configured" if hf_key else "⚠️ Not configured")
        
        st.markdown("---")
        
        # Analyze button
        analyze_button = st.button("🚀 Run Analysis", type="primary", use_container_width=True)
        
        st.markdown("---")
        st.caption("💡 Powered by LangGraph & Streamlit")
    
    # Main content area
    if analyze_button:
        if not brand_name.strip():
            st.error("⚠️ Please enter a brand name to analyze")
            return
        
        # Progress indicator
        with st.spinner(f"🔍 Analyzing {brand_name}... This may take a minute..."):
            try:
                # Run the analysis
                result: AgentState = run_analysis(brand_name)
                
                # Store result in session state
                st.session_state['result'] = result
                st.session_state['brand_name'] = brand_name
                
                st.success(f"✅ Analysis complete for **{brand_name}**!")
                
            except Exception as e:
                st.error(f"❌ Error during analysis: {str(e)}")
                st.exception(e)
                return
    
    # Display results if available
    if 'result' in st.session_state:
        result = st.session_state['result']
        brand_name = st.session_state['brand_name']
        sentiment_stats = result['sentiment_stats']
        
        st.markdown("---")
        
        # Sentiment Metrics
        st.subheader(f"📊 Sentiment Analysis: {brand_name}")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="Overall Sentiment",
                value=sentiment_stats['overall_sentiment'],
                delta=None
            )
        
        with col2:
            st.metric(
                label="✅ Positive",
                value=sentiment_stats['positive'],
                delta=f"{sentiment_stats['positive']/sentiment_stats['total']*100:.1f}%"
            )
        
        with col3:
            st.metric(
                label="⚠️ Neutral",
                value=sentiment_stats['neutral'],
                delta=f"{sentiment_stats['neutral']/sentiment_stats['total']*100:.1f}%"
            )
        
        with col4:
            st.metric(
                label="❌ Negative",
                value=sentiment_stats['negative'],
                delta=f"{sentiment_stats['negative']/sentiment_stats['total']*100:.1f}%"
            )
        
        # Sentiment scores
        col_a, col_b = st.columns(2)
        with col_a:
            st.metric("VADER Compound Score", f"{sentiment_stats['vader_compound']:.3f}")
        with col_b:
            st.metric("TextBlob Polarity", f"{sentiment_stats['textblob_polarity']:.3f}")
        
        st.markdown("---")
        
        # Sentiment Chart
        st.subheader("📈 Sentiment Distribution Visualization")
        
        if "Plotly" in chart_type:
            fig = plot_sentiment_pie_plotly(sentiment_stats)
            st.plotly_chart(fig, use_container_width=True)
        else:
            fig = plot_sentiment_pie_matplotlib(sentiment_stats)
            st.pyplot(fig)
        
        st.markdown("---")
        
        # Raw Data Expander
        with st.expander("🔍 View Raw Data", expanded=False):
            st.subheader("Search Results (Past 2 Days)")
            
            # Display filtered content with timestamps
            if 'filtered_content' in result and result['filtered_content']:
                for idx, item in enumerate(result['filtered_content'], 1):
                    with st.container():
                        col1, col2 = st.columns([3, 1])
                        with col1:
                            st.markdown(f"**{idx}. {item['title']}**")
                            st.caption(f"🔗 {item['url']}")
                        with col2:
                            is_recent = item.get('is_recent', False)
                            time_badge = "🔥 BREAKING" if is_recent else "📅"
                            st.markdown(f"{time_badge} **{item.get('time_ago', 'Unknown')}**")
                            st.caption(item.get('formatted_date', 'Date unavailable'))
                        
                        st.text(item['text'][:200] + "..." if len(item['text']) > 200 else item['text'])
                        st.markdown("---")
            else:
                st.info("No filtered content available")
            
            st.subheader("RAG Findings")
            st.text(result['rag_findings'])
        
        st.markdown("---")
        
        # Strategic Report
        st.subheader("📋 AI Strategic Report")
        st.markdown(result['final_report'])
        
        # Download button
        st.download_button(
            label="📥 Download Report",
            data=result['final_report'],
            file_name=f"brandshield_report_{brand_name}_{st.session_state.get('timestamp', 'report')}.md",
            mime="text/markdown"
        )
    
    else:
        # Welcome message
        st.info("👈 Enter a brand name in the sidebar and click **Run Analysis** to get started!")
        
        # Feature overview
        st.markdown("---")
        st.subheader("✨ Features")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown("### 🔍 Search Agent")
            st.write("Fetches latest web mentions using Exa API or mock data")
        
        with col2:
            st.markdown("### 🧠 RAG Agent")
            st.write("Semantic search with ChromaDB & HuggingFace embeddings")
        
        with col3:
            st.markdown("### 📊 Strategy Agent")
            st.write("Generates CEO-level strategic reports with actionable insights")


if __name__ == "__main__":
    main()
