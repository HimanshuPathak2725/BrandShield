# 🛡️ BrandShield

**AI-Powered PR Crisis Predictor & Advanced Brand Sentiment Detection System**

A modular Python project that uses **LangGraph** for orchestration and **Streamlit** for the dashboard. The system analyzes brand sentiment and detects potential crises using Advanced RAG (Retrieval-Augmented Generation) with semantic search.

---

## 🌟 Features

- **🔍 Search Agent**: Fetches latest web mentions from past 2 days using Exa API (or mock data for testing)
- **⚖️ Evaluator Agent**: NEW! Filters and validates time-sensitive content
  - ✅ Only analyzes data from past 2 days (no old/stale data)
  - ✅ Displays original post times for each mention
  - ✅ Marks breaking news (< 6 hours old)
  - ✅ Sorts content by recency
- **🧠 Advanced RAG Agent**: **REAL RAG IMPLEMENTATION** with:
  - ✅ **Semantic Understanding** (not keyword matching!)
  - ✅ RecursiveCharacterTextSplitter for intelligent chunking
  - ✅ HuggingFace embeddings (all-MiniLM-L6-v2) - converts text to mathematical vectors
  - ✅ FAISS vector database for fast semantic search
  - ✅ Retriever pattern for evidence-based findings
  - ✅ Finds hidden connections (e.g., "screen went black" = "technical failure")
- **📊 Strategy Agent**: Generates CEO-level strategic reports with actionable insights
- **📈 Interactive Dashboard**: Real-time sentiment visualization with timestamps
- **🎯 Crisis Detection**: Semantic search identifies hate speech, product frustration, technical bugs, and safety risks

---

## 📁 Project Structure

```
brandshiled_lite_pro_max_ultra/
├── src/
│   ├── __init__.py          # Package initialization
│   ├── state.py             # AgentState TypedDict definition
│   ├── agents.py            # Search, RAG, and Strategy agents
│   └── graph.py             # LangGraph workflow orchestration
├── app.py                   # Streamlit dashboard
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
├── .env                    # Your actual API keys (create this)
└── README.md               # This file
```

---

## 🚀 Installation

### 1. Clone or Download the Project

```bash
cd d:\projects\brandshiled_lite_pro_max_ultra
```

### 2. Create a Virtual Environment (Recommended)

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Exa API (for web search)
EXA_API_KEY=your_exa_api_key_here

# HuggingFace API (for LLM models)
HUGGINGFACEHUB_API_TOKEN=your_huggingface_token_here
```

#### Getting API Keys:

- **Exa API**: Sign up at [https://exa.ai/](https://exa.ai/)
- **HuggingFace Token**: Get your token at [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

> **Note**: The system will work with mock data if Exa API key is not provided. HuggingFace token is optional for the current implementation.

---

## 🎮 Usage

### Running the Streamlit Dashboard

```bash
streamlit run app.py
```

The dashboard will open in your browser at `http://localhost:8501`

### Using the Dashboard

1. **Enter Brand Name**: Type the brand you want to analyze in the sidebar
2. **Select Chart Type**: Choose between Plotly (interactive) or Matplotlib (static)
3. **Run Analysis**: Click the "🚀 Run Analysis" button
4. **View Results**: 
   - Sentiment metrics and distribution
   - Interactive/static pie chart
   - Raw data in expandable section
   - Detailed AI Strategic Report
5. **Download Report**: Save the report as a Markdown file

### Command-Line Usage

You can also run the analysis directly from Python:

```python
from src.graph import run_analysis

result = run_analysis("Tesla")
print(result["final_report"])
```

---

## 🧪 Technical Details

### Agent Architecture

#### 1. **Search Agent** (`search_agent`)
- Fetches web mentions using Exa API with date filters (past 2 days only)
- Falls back to mock data with realistic timestamps if API unavailable
- Returns structured search results with published dates

#### 2. **Evaluator Agent** (`evaluator_agent`) - ⭐ NEW!
- **Time Filtering**: Validates all content is from past 2 days
- **Recency Tracking**: Calculates "time ago" for each mention
- **Breaking News Detection**: Flags articles < 6 hours old
- **Data Enrichment**: Adds formatted dates and timestamps
- **Quality Control**: Ensures only fresh, relevant data proceeds to analysis

#### 3. **Advanced RAG Agent** (`rag_agent`) - ⭐ REAL RAG IMPLEMENTATION
- **Text Splitting**: `RecursiveCharacterTextSplitter` (500 chunk size, 50 overlap)
- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2` (converts text → semantic vectors)
- **Vector Store**: FAISS in-memory database
- **Retriever Pattern**: Uses `.invoke()` for semantic search (not keyword matching!)
- **Semantic Queries**: Searches for hidden patterns across 4 risk categories:
  - 🔴 Hate speech & offensive content
  - 🟠 Product frustration & complaints
  - 🟡 Technical bugs & system failures
  - 🔴 Safety risks & hazards
- **Evidence Extraction**: Returns actual quotes with context, timestamps, and sentiment scores
- **Why it's "Real RAG"**:
  - ✅ Understands "my screen went black" = "technical failure" (semantic, not keyword)
  - ✅ Vector embeddings enable mathematical similarity search
  - ✅ Retrieval-augmented: Strategy agent only receives relevant evidence
  - ✅ Reduces AI hallucination by grounding responses in retrieved documents

#### 4. **Strategy Agent** (`strategy_agent`)
- Analyzes RAG findings from time-filtered data
- Assesses crisis level (LOW/MEDIUM/HIGH/CRITICAL)
- Generates strategic report with:
  - Immediate actions (24-48 hours)
  - Short-term actions (2-4 weeks)
  - Long-term actions (3-6 months)

### LangGraph Workflow

```
Search Agent → Evaluator Agent → RAG Agent → Strategy Agent → END
```

**New 4-Agent Linear Flow:**
1. **Search**: Fetches mentions from past 2 days
2. **Evaluator**: Filters & validates time-sensitive content
3. **RAG**: Performs semantic analysis on filtered data
4. **Strategy**: Generates CEO report

Sequential processing with state passed between nodes ensures data quality and relevance.

---

## 📊 Output

The system provides:

1. **Sentiment Metrics**:
   - Positive/Neutral/Negative counts and percentages
   - VADER compound score
   - TextBlob polarity score
   - Overall sentiment classification

2. **Visualizations**:
   - Interactive Plotly pie chart
   - Static Matplotlib pie chart

3. **Strategic Report**:
   - Executive summary
   - Key findings from RAG analysis
   - Risk assessment with crisis level
   - Immediate, short-term, and long-term recommendations
   - KPIs to track

---

## 🔧 Configuration

### Customizing Search Results

Edit `_get_mock_search_results()` in [src/agents.py](src/agents.py) to customize mock data.

### Adjusting RAG Parameters

In [src/agents.py](src/agents.py), modify:
- `chunk_size` and `chunk_overlap` in `RecursiveCharacterTextSplitter`
- `k` parameter in `similarity_search()` to return more/fewer results
- Risk query categories in `risk_queries` dictionary

### Changing Crisis Thresholds

In [src/agents.py](src/agents.py), adjust the crisis level thresholds:
```python
if sentiment_stats['negative'] > sentiment_stats['total'] * 0.5:
    crisis_level = "CRITICAL"
```

---

## 🐛 Troubleshooting

### Issue: ChromaDB errors on Windows

**Solution**: Ensure you have Visual C++ Build Tools installed:
```bash
# Or install without chromadb and use FAISS instead
pip install faiss-cpu
```

### Issue: HuggingFace model download is slow

**Solution**: First run will download the embedding model (~80MB). Subsequent runs use cached model.

### Issue: Streamlit not opening

**Solution**: Manually open `http://localhost:8501` in your browser.

---

## 📦 Dependencies

Key libraries:
- **langgraph**: Workflow orchestration
- **langchain**: RAG framework
- **chromadb**: Vector database
- **sentence-transformers**: Embeddings
- **exa-py**: Web search
- **streamlit**: Dashboard
- **textblob & vaderSentiment**: Sentiment analysis
- **matplotlib & plotly**: Visualizations

See [requirements.txt](requirements.txt) for complete list.

---

## 🤝 Contributing

This is a modular project designed for easy extension:

1. **Add new agents**: Create functions in [src/agents.py](src/agents.py)
2. **Modify workflow**: Update [src/graph.py](src/graph.py)
3. **Enhance dashboard**: Edit [app.py](app.py)
4. **Add state fields**: Update [src/state.py](src/state.py)

---

## 📝 License

MIT License - feel free to use and modify for your projects.

---

## 🙏 Acknowledgments

- Built with [LangGraph](https://github.com/langchain-ai/langgraph)
- UI powered by [Streamlit](https://streamlit.io/)
- Embeddings from [HuggingFace](https://huggingface.co/)
- Search via [Exa](https://exa.ai/)

---

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Made with ❤️ for brand protection and crisis management**
>>>>>>> 3ac400f5ffe80cb914f454183586213e4c15053f
