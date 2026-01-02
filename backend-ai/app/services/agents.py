from typing import List, Dict, Any, TypedDict
from langgraph.graph import StateGraph, END
from transformers import pipeline
from sentence_transformers import SentenceTransformer, util
from langchain_community.llms import HuggingFaceHub
from langchain.prompts import PromptTemplate
import os
import torch

# Define State
class AgentState(TypedDict):
    raw_data: List[str]
    sentiment_analysis: Dict[str, Any]
    clusters: Dict[str, List[str]]
    strategy_plan: str

class AgentService:
    def __init__(self):
        # Initialize models
        self.sentiment_pipeline = pipeline(
            "sentiment-analysis", 
            model="cardiffnlp/twitter-roberta-base-sentiment",
            tokenizer="cardiffnlp/twitter-roberta-base-sentiment",
            top_k=None
        )
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Initialize LLM for strategy
        # Using a lightweight instruction-tuned model available on HF Hub
        self.llm = HuggingFaceHub(
            repo_id="google/flan-t5-large", 
            model_kwargs={"temperature": 0.7, "max_length": 512},
            huggingfacehub_api_token=os.getenv("HUGGINGFACE_API_KEY")
        )

    def analyze_sentiment(self, state: AgentState):
        texts = state["raw_data"][:50] # Limit to 50 for performance in demo
        results = self.sentiment_pipeline(texts)
        
        # Aggregate sentiment
        negative_count = 0
        total_score = 0
        for res in results:
            # res is a list of dicts like [{'label': 'LABEL_0', 'score': 0.9}, ...]
            # LABEL_0: Negative, LABEL_1: Neutral, LABEL_2: Positive for this model
            # Actually cardiffnlp/twitter-roberta-base-sentiment outputs labels: LABEL_0 (negative), LABEL_1 (neutral), LABEL_2 (positive)
            
            # Let's find the label with highest score
            top_label = max(res, key=lambda x: x['score'])
            if top_label['label'] == 'LABEL_0':
                negative_count += 1
        
        negative_ratio = negative_count / len(texts) if texts else 0
        
        return {"sentiment_analysis": {"negative_ratio": negative_ratio, "details": results}}

    def cluster_comments(self, state: AgentState):
        texts = state["raw_data"]
        embeddings = self.embedding_model.encode(texts, convert_to_tensor=True)
        
        # Simple clustering: Find communities
        # We'll use fast_clustering or community detection
        clusters = util.community_detection(embeddings, min_community_size=3, threshold=0.75)
        
        clustered_texts = {}
        categories = ["Design", "Price", "Performance", "Safety", "Other"]
        
        # Map clusters to categories (Mock logic for demo as we don't have a zero-shot classifier here)
        # In a real app, we'd use a classifier or LLM to name the clusters.
        for i, cluster in enumerate(clusters[:5]): # Top 5 clusters
            cluster_content = [texts[idx] for idx in cluster]
            category_name = f"Cluster {i+1}" # Placeholder
            clustered_texts[category_name] = cluster_content
            
        return {"clusters": clustered_texts}

    def generate_strategy(self, state: AgentState):
        sentiment = state["sentiment_analysis"]
        clusters = state["clusters"]
        
        prompt = PromptTemplate(
            input_variables=["sentiment", "clusters"],
            template="""
            You are a Crisis Management Strategist.
            
            Situation Analysis:
            - Negative Sentiment Ratio: {sentiment}
            - Key Narrative Clusters: {clusters}
            
            Task: Draft a strategic response plan to address the backlash.
            
            Response Plan:
            """
        )
        
        formatted_prompt = prompt.format(
            sentiment=sentiment.get("negative_ratio", 0),
            clusters=list(clusters.keys())
        )
        
        strategy = self.llm.invoke(formatted_prompt)
        
        return {"strategy_plan": strategy}

    def build_workflow(self):
        workflow = StateGraph(AgentState)
        
        workflow.add_node("sentiment_agent", self.analyze_sentiment)
        workflow.add_node("clustering_agent", self.cluster_comments)
        workflow.add_node("strategy_agent", self.generate_strategy)
        
        workflow.set_entry_point("sentiment_agent")
        
        workflow.add_edge("sentiment_agent", "clustering_agent")
        workflow.add_edge("clustering_agent", "strategy_agent")
        workflow.add_edge("strategy_agent", END)
        
        return workflow.compile()

    def run_workflow(self, texts: List[str]):
        app = self.build_workflow()
        initial_state = AgentState(
            raw_data=texts,
            sentiment_analysis={},
            clusters={},
            strategy_plan=""
        )
        result = app.invoke(initial_state)
        return result
