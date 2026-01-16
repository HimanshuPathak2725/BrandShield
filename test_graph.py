
import sys
import os
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getcwd())
from src.state import AgentState
from src.graph import create_phase1_graph

try:
    print("Creating graph...")
    app1 = create_phase1_graph()
    print("Graph created.")
    
    initial_state = {
        "topic": "TestBrand",
        "raw_content": [],
        "filtered_content": [],
        "sentiment_stats": {},
        "emotion_analysis": {},
        "social_media_replies": [],
        "risk_metrics": {},
        "rag_findings_structured": [],
        "research_plan": []
    }
    
    print("Invoking graph...")
    result = app1.invoke(initial_state)
    print("Invocation successful!")
    print(result.keys())
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
