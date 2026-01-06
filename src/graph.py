"""
LangGraph workflow definition for BrandShield Deep Research.
Orchestrates: Planner -> Search -> Evaluator -> RAG -> Social Media -> Human Review -> Strategy -> Critic
"""
from langgraph.graph import StateGraph, END
from src.state import AgentState
from src.agents import (
    planning_agent, 
    search_agent, 
    evaluator_agent, 
    rag_agent, 
    strategy_agent, 
    social_media_agent
)
from src.advanced_agents import critic_agent

def human_approval_node(state: AgentState) -> AgentState:
    """
    Checkpoint node for Human-in-the-Loop.
    The graph will pause BEFORE executing this node.
    User edits content in the UI, updates state, and then we resume.
    """
    print("🛑 Human Approval Checkpoint Reached")
    return state

def should_revise(state: AgentState) -> str:
    """
    Conditional edge: Determine if report needs revision.
    """
    critic_approved = state.get("critic_approved", False)
    revision_count = state.get("revision_count", 0)
    
    if not critic_approved and revision_count < 1: 
        print(f"   🔄 Red Teaming: Sending back to Strategy for revision #{revision_count + 1}")
        return "revise"
    else:
        print("   ✅ Red Teaming approved (or limit reached)")
        return "approve"

def create_phase1_graph():
    """Phase 1: Research & Social Media Drafts"""
    workflow = StateGraph(AgentState)
    workflow.add_node("planner", planning_agent)
    workflow.add_node("search", search_agent)
    workflow.add_node("evaluator", evaluator_agent)
    workflow.add_node("rag_analysis", rag_agent)
    workflow.add_node("social_media", social_media_agent)
    
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "search")
    workflow.add_edge("search", "evaluator")
    workflow.add_edge("evaluator", "rag_analysis")
    workflow.add_edge("rag_analysis", "social_media")
    workflow.add_edge("social_media", END)
    
    return workflow.compile()

def create_phase2_graph():
    """Phase 2: Strategy & Final Report"""
    workflow = StateGraph(AgentState)
    workflow.add_node("strategy", strategy_agent)
    workflow.add_node("critic", critic_agent)
    
    workflow.set_entry_point("strategy")
    workflow.add_edge("strategy", "critic")
    
    workflow.add_conditional_edges(
        "critic",
        should_revise,
        {
            "revise": "strategy",
            "approve": END
        }
    )
    return workflow.compile()

def run_analysis(brand_name: str) -> None:
    pass



if __name__ == "__main__":
    # Example usage
    result = run_analysis("Tesla")
    print("\n📊 FINAL REPORT:\n")
    print(result["final_report"])
