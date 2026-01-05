"""
State definition for the BrandShield_Lite agent system.
"""
from typing import TypedDict, List, Dict, Any


class AgentState(TypedDict):
    """
    The state shared across all agents in the LangGraph workflow.
    
    Attributes:
        topic: The brand name or topic to analyze
        raw_content: List of raw search results/web mentions
        filtered_content: List of time-filtered content (past 2 days only)
        sentiment_statsysis results
        emotion_analysis: Advanced emotion tracking (a: Dictionary containing sentiment analnger, sadness, joy, etc.)
        rag_findings: Findings from RAG semantic search analysis
        rag_quality_score: Quality score from CRAG relevance checking
        draft_report: Initial draft from Strategy Agent (for HITL)
        critic_feedback: Feedback from Critic Agent
        critic_approved: Boolean - whether Critic approved the report
        final_report: The final strategic report (after Critic approval)
        human_approved: Boolean - whether human approved via HITL
        revision_count: Number of times report was revised
    """
    topic: str
    raw_content: List[Dict[str, Any]]
    filtered_content: List[Dict[str, Any]]
    sentiment_stats: Dict[str, Any]
    emotion_analysis: Dict[str, Any]
    rag_findings: str
    rag_findings_structured: List[Dict[str, Any]]
    rag_quality_score: float
    draft_report: str
    critic_feedback: str
    critic_approved: bool
    final_report: str
    human_approved: bool
    revision_count: int