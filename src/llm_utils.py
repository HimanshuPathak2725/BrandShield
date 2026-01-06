"""
LLM Utilities for BrandShield
Handles connection to HuggingFace Hub (no local downloads required).
"""
import os
from typing import Optional

try:
    from langchain_community.llms import HuggingFaceHub
    HUGGINGFACE_AVAILABLE = True
except ImportError:
    HUGGINGFACE_AVAILABLE = False
    print("⚠️ langchain-community not installed. Run: pip install langchain-community")


def get_llm(
    model_type: str = "huggingface",
    temperature: float = 0.7, 
    max_tokens: int = 2048,
    ollama_model: str = "llama3.2",
    hf_model: str = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
):
    """
    Get an LLM instance using HuggingFace Hub API.
    Uses remote API only - no local model downloads.
    
    Args:
        model_type: "huggingface" (default)
        temperature: Creativity of the model (0.0 to 1.0)
        max_tokens: Maximum tokens to generate
        ollama_model: Ignored (kept for compatibility)
        hf_model: HuggingFace model ID
        
    Returns:
        LLM instance
    """
    
    if not HUGGINGFACE_AVAILABLE:
        raise Exception("langchain-community not installed. Run: pip install langchain-community")
    
    sec_key = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    if not sec_key:
        raise Exception("HUGGINGFACEHUB_API_TOKEN not found. Add it to .env file.")
    
    try:
        # Use HuggingFaceHub which uses the correct API endpoint
        llm = HuggingFaceHub(
            repo_id=hf_model,
            model_kwargs={
                "temperature": temperature,
                "max_new_tokens": max_tokens,
            },
            huggingfacehub_api_token=sec_key,
        )
        print(f"✅ Using HuggingFace Hub: {hf_model}")
        return llm
    except Exception as e:
        raise Exception(f"Failed to initialize HuggingFace Hub: {e}")


def get_agent_llm(agent_name: str, temperature: float = 0.7):
    """
    Get optimized LLM for specific agent tasks.
    All models run via HuggingFace Hub API - no local downloads.
    
    Agent-specific configurations:
    - search/planning: Fast, lightweight models
    - extraction: Accurate, medium models  
    - report: Creative, larger models
    """
    
    agent_configs = {
        "search": {
            "hf_model": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            "max_tokens": 512,
            "temperature": 0.5
        },
        "extraction": {
            "hf_model": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            "max_tokens": 1024,
            "temperature": 0.3
        },
        "report": {
            "hf_model": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            "max_tokens": 2048,
            "temperature": 0.7
        },
        "critic": {
            "hf_model": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            "max_tokens": 1024,
            "temperature": 0.2
        }
    }
    
    config = agent_configs.get(agent_name, agent_configs["report"])
    config["temperature"] = temperature
    
    return get_llm(
        model_type="huggingface",
        temperature=config["temperature"],
        max_tokens=config["max_tokens"],
        hf_model=config["hf_model"]
    )
