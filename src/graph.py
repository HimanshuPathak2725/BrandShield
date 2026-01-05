"""
LangGraph workflow definition for BrandShield_Lite ELITE.
Connects: Search → Evaluator → RAG → Strategy → Critic → (loop or END)
Includes Human-in-the-Loop (HITL) checkpoint.
"""
from langgraph.graph import StateGraph, END
from src.state import AgentState
from src.agents import search_agent, evaluator_agent, rag_agent, strategy_agent
from src.advanced_agents import critic_agent


def should_revise(state: AgentState) -> str:
    """
    Conditional edge: Determine if report needs revision.
    
    Returns:
        - "revise": Send back to Strategy Agent for revision
        - "approve": Move to final approval (or HITL checkpoint)
    """
    critic_approved = state.get("critic_approved", False)
    revision_count = state.get("revision_count", 0)
    
    # Max 2 revisions to prevent infinite loops
    if not critic_approved and revision_count < 2:
        print(f"   🔄 Routing to Strategy Agent for revision #{revision_count + 1}")
        return "revise"
    else:
        print("   ✅ Routing to final approval")
        return "approve"


def finalize_report(state: AgentState) -> AgentState:
    """
    Finalization node: Prepares report for human approval (HITL).
    Sets the final_report from draft_report if approved by Critic.
    """
    print("📝 Finalization: Preparing report for human approval...")
    
    # If critic approved, use the draft as final
    if state.get("critic_approved", False):
        state["final_report"] = state.get("draft_report", "")
        print("   ✅ Report ready for Human-in-the-Loop checkpoint")
    else:
        # Max revisions reached but still not approved
        state["final_report"] = state.get("draft_report", "") + "\n\n⚠️ **Note**: Maximum revisions reached. Report requires manual review."
        print("   ⚠️ Max revisions reached. Report flagged for manual review.")
    
    return state


def create_workflow() -> StateGraph:
    """
    Create and compile the BrandShield ELITE LangGraph workflow.
    
    The workflow executes in this order:
    1. Search Agent - Fetches web mentions (past 2 days only)
    2. Evaluator Agent - Filters and validates time-sensitive content
    3. RAG Agent - Performs semantic analysis with CRAG + Emotion Velocity
    4. Strategy Agent - Generates strategic report DRAFT
    5. Critic Agent - Reviews draft for issues (Red Teaming)
    6. [Conditional] If issues found → loop back to Strategy (max 2x)
    7. Finalize - Prepares for HITL checkpoint
    8. [HITL Checkpoint] - Human approval required before publication
    
    Returns:
        Compiled StateGraph ready for execution
    """
    # Initialize the graph
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("search", search_agent)
    workflow.add_node("evaluator", evaluator_agent)
    workflow.add_node("rag_analysis", rag_agent)
    workflow.add_node("strategy", strategy_agent)
    workflow.add_node("critic", critic_agent)
    workflow.add_node("finalize", finalize_report)
    
    # Define the linear flow with conditional loop
    workflow.set_entry_point("search")
    workflow.add_edge("search", "evaluator")
    workflow.add_edge("evaluator", "rag_analysis")
    workflow.add_edge("rag_analysis", "strategy")
    workflow.add_edge("strategy", "critic")
    
    # Conditional edge: Critic can loop back to Strategy
    workflow.add_conditional_edges(
        "critic",
        should_revise,
        {
            "revise": "strategy",  # Loop back for revision
            "approve": "finalize"  # Move to finalization
        }
    )
    
    # Finalize before HITL checkpoint
    workflow.add_edge("finalize", END)
    
    # Note: HITL checkpoint is handled in the app.py using interrupt_before
    
    # Compile the graph
    app = workflow.compile(
        # HITL: Interrupt before finalize for human approval
        # interrupt_before=["finalize"]  # Uncomment for true HITL
    )
    
    return app


def run_analysis(brand_name: str) -> AgentState:
    """
    Run the complete BrandShield analysis for a given brand.
    
    Args:
        brand_name: The brand name to analyze
        
    Returns:
        Final AgentState with all analysis results
    """
    print(f"\n{'='*60}")
    print(f"🛡️  BRANDSHIELD LITE ANALYSIS: {brand_name}")
    print(f"{'='*60}\n")
    
    # Create workflow
    app = create_workflow()
    
    # Initialize state
    initial_state: AgentState = {
        "topic": brand_name,
        "raw_content": [],
        "filtered_content": [],
        "sentiment_stats": {},
        "emotion_analysis": {},
        "rag_findings": "",
        "rag_quality_score": 0.0,
        "draft_report": "",
        "critic_feedback": "",
        "critic_approved": False,
        "final_report": "",
        "human_approved": False,
        "revision_count": 0
    }
    
    # Execute workflow
    final_state = app.invoke(initial_state)
    
    print(f"\n{'='*60}")
    print("✅ ANALYSIS COMPLETE")
    print(f"{'='*60}\n")
    
    return final_state


if __name__ == "__main__":
    # Example usage
    result = run_analysis("Tesla")
    print("\n📊 FINAL REPORT:\n")
    print(result["final_report"])
