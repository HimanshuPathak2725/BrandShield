"""
LangGraph workflow definition for BrandShield Enterprise.
"""
import nest_asyncio
nest_asyncio.apply()
import asyncio
from typing import Dict, Any
from langgraph.graph import StateGraph, END

from src.state import AgentState
# Import agents. Ensure agents.py has these exports.
# Note: social_media_agent is not in the new flow but was in imports.
from src.agents import (
    evaluator_agent, 
    rag_agent
)

# Import new services
from services.stream_ingestion import ingestion_service
from services.crisis_predictor import crisis_predictor
from services.response_generator import response_generator
from services.response_simulator import response_simulator
from services.influencer_detector import influencer_detector
from services.alert_dispatcher import alert_dispatcher

# --- NEW NODES ---

async def live_ingestion_node(state: AgentState) -> AgentState:
    print(f"📡 Ingesting live stream for: {state['topic']}")
    keywords = [state['topic']]
    posts = await ingestion_service.get_live_feed(keywords)
    
    # Update raw content for RAG
    # filtered_content will be set by evaluator
    return {"raw_content": posts}

async def crisis_prediction_node(state: AgentState) -> AgentState:
    print("📉 Predicting Crisis Velocity...")
    # Calculate volume based on ingestion count (mock logic, in real world we'd count db rows)
    current_vol = len(state.get("raw_content", [])) 
    
    velocity_data = await crisis_predictor.predict_crisis(state['topic'], current_vol)
    return {"crisis_velocity": velocity_data}

async def response_generator_node(state: AgentState) -> AgentState:
    print("🧠 Generating Response Strategies...")
    context = state.get("rag_findings", "Crisis situation detected.")
    strategies = response_generator.generate_responses(state['topic'], context)
    return {"response_strategies": strategies}

async def response_simulator_node(state: AgentState) -> AgentState:
    print("🧪 Simulating Public Reaction...")
    strategies = state.get("response_strategies", [])
    sim_result = response_simulator.simulate_all(strategies)
    return {
        "simulation_results": sim_result,
        "best_strategy": sim_result["best_strategy"]
    }

def influencer_detector_node(state: AgentState) -> AgentState:
    print("👥 Identifying Influencers...")
    posts = state.get("raw_content", [])
    influencers = influencer_detector.detect_influencers(posts)
    return {"influencers": influencers}

def alert_dispatcher_node(state: AgentState) -> AgentState:
    print("🚨 Checking Alert Triggers...")
    best_strat = state.get("best_strategy", {}) # Using best strategy risk score
    # Or calculate aggregate risk from prediction
    pred = state.get("crisis_velocity", {})
    
    # Mix risks
    combined_risk = {
        "risk_score": best_strat.get("risk_score", 0.0) if best_strat else 0.0,
        "trend_probability": pred.get("trend_probability", 0.0)
    }
    
    alerts = alert_dispatcher.check_and_alert(combined_risk, pred, state['topic'])
    return {"alerts_triggered": alerts}

# --- GRAPH CONSTRUCTION ---

def create_enterprise_graph():
    workflow = StateGraph(AgentState)
    
    # Add Nodes
    workflow.add_node("live_ingestion", live_ingestion_node)
    workflow.add_node("evaluator", evaluator_agent) # Reuse existing
    workflow.add_node("rag_node", rag_agent)       # Reuse existing
    workflow.add_node("crisis_prediction", crisis_prediction_node)
    workflow.add_node("response_generator", response_generator_node)
    workflow.add_node("response_simulator", response_simulator_node)
    workflow.add_node("influencer_detector", influencer_detector_node)
    workflow.add_node("alert_dispatcher", alert_dispatcher_node)
    
    # Set Edges
    workflow.set_entry_point("live_ingestion")
    
    workflow.add_edge("live_ingestion", "evaluator")
    workflow.add_edge("evaluator", "rag_node")
    workflow.add_edge("rag_node", "crisis_prediction")
    workflow.add_edge("crisis_prediction", "response_generator")
    workflow.add_edge("response_generator", "response_simulator")
    workflow.add_edge("response_simulator", "influencer_detector")
    workflow.add_edge("influencer_detector", "alert_dispatcher")
    workflow.add_edge("alert_dispatcher", END)
    
    return workflow.compile()

def create_phase1_graph():
    """Restoring Phase 1 for API compatibility"""
    workflow = StateGraph(AgentState)
    workflow.add_node("live_ingestion", live_ingestion_node)
    workflow.add_node("evaluator", evaluator_agent)
    workflow.add_node("rag_node", rag_agent)
    
    workflow.set_entry_point("live_ingestion")
    workflow.add_edge("live_ingestion", "evaluator")
    workflow.add_edge("evaluator", "rag_node")
    workflow.add_edge("rag_node", END)
    
    return workflow.compile()

def create_phase2_graph():
    """Restoring Phase 2 for API compatibility"""
    workflow = StateGraph(AgentState)
    workflow.add_node("crisis_prediction", crisis_prediction_node)
    workflow.add_node("response_generator", response_generator_node)
    workflow.add_node("response_simulator", response_simulator_node)
    workflow.add_node("influencer_detector", influencer_detector_node)
    workflow.add_node("alert_dispatcher", alert_dispatcher_node)
    
    workflow.set_entry_point("crisis_prediction")
    workflow.add_edge("crisis_prediction", "response_generator")
    workflow.add_edge("response_generator", "response_simulator")
    workflow.add_edge("response_simulator", "influencer_detector")
    workflow.add_edge("influencer_detector", "alert_dispatcher")
    workflow.add_edge("alert_dispatcher", END)
    
    return workflow.compile()
