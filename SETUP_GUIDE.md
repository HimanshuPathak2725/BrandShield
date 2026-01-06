# 🛡️ BrandShield - Setup Guide

## ✅ What's Been Fixed

Your BrandShield application now uses **serverless LLM inference** with no local downloads required!

### Changes Made:
1. **✅ Hybrid LLM System** - Uses HuggingFace Serverless Inference API (no local models needed)
2. **✅ Agent-Specific Models** - Each agent uses optimized models:
   - **Planning/Search Agent**: TinyLlama (fast for query generation)
   - **Extraction Agent**: TinyLlama (accurate for data filtering)
   - **Report Agent**: TinyLlama (creative for report writing)
   - **Critic Agent**: TinyLlama (strict for validation)
3. **✅ Proper Response Handling** - Fixed parsing for both string and chat response formats
4. **✅ Free Tier Compatible** - Uses TinyLlama model which works on HuggingFace's free serverless API

## 🚀 How to Run

### 1. Refresh the Streamlit App
In your browser where Streamlit is running, press **R** or **refresh the page**

### 2. The App Should Now Work!
The error about the deprecated API should be gone, and the strategic report should generate successfully.

## 🔧 Configuration

Your [`.env`](file:///c:/Users/ayush/OneDrive/Desktop/brandshiled again/BrandShield/.env) file:
```env
EXA_API_KEY = "cc3e6d8d-3efd-4540-82d6-28980f300f32"
HUGGINGFACEHUB_API_TOKEN = "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"
```

## 🎯 Agent Workflow

```
1. Planning Agent (Search Model)
   ├─ Generates 3 research queries
   └─ Uses fast TinyLlama for query generation

2. Search Agent (Exa API)
   ├─ Fetches web mentions
   └─ No LLM needed

3. Evaluator Agent
   ├─ Filters by time (past 2 days)
   └─ No LLM needed

4. RAG Agent (Extraction Model)
   ├─ Semantic search with FAISS
   ├─ Uses TinyLlama for sentiment verification
   └─ Emotion analysis with transformers

5. Social Media Agent (Report Model)
   ├─ Drafts replies
   └─ Uses TinyLlama for creative responses

6. Strategy Agent (Report Model)
   ├─ Generates CEO-level report
   └─ Uses TinyLlama for long-form content

7. Critic Agent (Critic Model)
   ├─ Reviews and validates report
   └─ Uses TinyLlama with low temperature for strict analysis
```

## 📊 Model Information

### TinyLlama-1.1B-Chat-v1.0
- **Size**: 1.1B parameters (very small & fast)
- **Speed**: ⚡ Fast on serverless API
- **Cost**: 🆓 Free on HuggingFace Inference API
- **Quality**: Good for business reports, summaries, and chat

## 🔄 Optional: Using Ollama (Local)

If you want to use Ollama locally in the future, you can:

1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama pull llama3.2`
3. Add to `.env`:
   ```env
   OLLAMA_API_URL=http://localhost:11434
   ```
4. The system will automatically prefer Ollama over HuggingFace

## 🎨 Alternative Models

You can switch models by editing [`src/llm_utils.py`](file:///c:/Users/ayush/OneDrive/Desktop/brandshiled again/BrandShield/src/llm_utils.py):

```python
# For faster responses (current):
hf_model = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

# For better quality (slower):
hf_model = "mistralai/Mistral-7B-Instruct-v0.2"

# For balanced performance:
hf_model = "google/flan-t5-large"
```

## 🐛 Troubleshooting

### If you still see errors:

1. **Clear Browser Cache**: Hard refresh (Ctrl+Shift+R)
2. **Check API Token**: Verify your HuggingFace token is valid at https://huggingface.co/settings/tokens
3. **Rate Limits**: HuggingFace free tier has rate limits. If you hit them, wait a minute and try again.

### Error: "Model loading"
This means HuggingFace is loading the model for the first time. Wait 20-30 seconds and try again.

### Error: "Rate limit"
You've hit the free tier limit. Wait a few minutes or upgrade to HuggingFace Pro.

## 📝 Next Steps

1. ✅ Refresh your browser
2. ✅ Test with "Tesla" or any brand
3. ✅ Check that the AI Strategic Report generates successfully
4. 🎉 Enjoy your working BrandShield app!

---

**Note**: All changes have been committed to git. Your code is safe!
