"""
LLM Utilities for BrandShield
Handles connection to Ollama API and HuggingFace Endpoints (no local downloads required).
"""
import os
from typing import Optional

try:
    from langchain_community.llms import Ollama
    from langchain_community.chat_models import ChatOllama
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False

try:
    from langchain_huggingface import HuggingFaceEndpoint
    HUGGINGFACE_AVAILABLE = True
except ImportError:
    HUGGINGFACE_AVAILABLE = False


def get_llm(
    model_type: str = "auto",
    temperature: float = 0.7, 
    max_tokens: int = 2048,
    ollama_model: str = "llama3.2",
    hf_model: str = "meta-llama/Llama-3.2-3B-Instruct"
):
    """
    Get an LLM instance with automatic fallback.
    Uses remote APIs only - no local model downloads.
    
    Priority:
    1. Ollama Cloud API (if OLLAMA_API_URL set)
    2. HuggingFace Inference API (requires HUGGINGFACEHUB_API_TOKEN)
    
    Args:
        model_type: "ollama", "huggingface", or "auto" (default)
        temperature: Creativity of the model (0.0 to 1.0)
        max_tokens: Maximum tokens to generate
        ollama_model: Ollama model name (e.g., "llama3.2", "mistral")
        hf_model: HuggingFace model ID
        
    Returns:
        LLM instance
    """
    
    # Try Ollama API (remote endpoint, no local download)
    if model_type in ["auto", "ollama"] and OLLAMA_AVAILABLE:
        ollama_url = os.getenv("OLLAMA_API_URL", "https://api.ollama.ai")
        ollama_key = os.getenv("OLLAMA_API_KEY", "")
        
        try:
            llm = Ollama(
                model=ollama_model,
                temperature=temperature,
                base_url=ollama_url,
                num_predict=max_tokens,
            )
            # Quick test
            try:
                llm.invoke("Hi")
                print(f"✅ Using Ollama API: {ollama_model}")
                return llm
            except Exception as e:
                if model_type == "ollama":
                    raise Exception(f"Ollama API requested but not available: {e}\nSet OLLAMA_API_URL in .env")
                print(f"⚠️ Ollama API not available, trying HuggingFace...")
        except Exception as e:
            if model_type == "ollama":
                raise
            print(f"⚠️ Ollama error: {e}")
    
    # Use HuggingFace Inference API (serverless, no downloads)
    if model_type in ["auto", "huggingface"] and HUGGINGFACE_AVAILABLE:
        sec_key = os.getenv("HUGGINGFACEHUB_API_TOKEN")
        if not sec_key:
            raise Exception("HUGGINGFACEHUB_API_TOKEN not found. Add it to .env file.")
        
        try:
            # Use TinyLlama - it's free, fast, and works on serverless API
            hf_model = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
            
            llm = HuggingFaceEndpoint(
                repo_id=hf_model,
                temperature=temperature,
                max_new_tokens=max_tokens,
                huggingfacehub_api_token=sec_key,
            )
            print(f"✅ Using HuggingFace Inference API: {hf_model}")
            return llm
        except Exception as e:
            print(f"❌ HuggingFace error: {e}")
            if model_type == "huggingface":
                raise
    
    raise Exception("No LLM backend available. Configure HUGGINGFACEHUB_API_TOKEN in .env")


def get_agent_llm(agent_name: str, temperature: float = 0.7):
    """
    Get optimized LLM for specific agent tasks.
    All models run via serverless APIs - no local downloads.
    
    Agent-specific configurations:
    - search/planning: Fast, lightweight models
    - extraction: Accurate, medium models  
    - report: Creative, larger models
    """
    
    agent_configs = {
        "search": {
            "ollama_model": "llama3.2",
            "hf_model": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            "max_tokens": 512,
            "temperature": 0.5
        },
        "extraction": {
            "ollama_model": "llama3.2",
            "hf_model": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            "max_tokens": 1024,
            "temperature": 0.3
        },
        "report": {
            "ollama_model": "llama3.2",
            "hf_model": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            "max_tokens": 2048,
            "temperature": 0.7
        },
        "critic": {
            "ollama_model": "llama3.2",
            "hf_model": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            "max_tokens": 1024,
            "temperature": 0.2
        }
    }
    
    config = agent_configs.get(agent_name, agent_configs["report"])
    config["temperature"] = temperature
    
    return get_llm(
        model_type="auto",
        temperature=config["temperature"],
        max_tokens=config["max_tokens"],
        ollama_model=config["ollama_model"],
        hf_model=config["hf_model"]
    )
