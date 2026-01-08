"""
LLM Utilities for BrandShield
Primary: Google Gemini API (fast, high quality)
Fallback: HuggingFace Inference API
"""
import os
from typing import Optional

# Google Gemini
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("⚠️ google-generativeai not installed. Run: pip install google-generativeai")

# HuggingFace (fallback)
try:
    from langchain_huggingface import HuggingFaceEndpoint
    HUGGINGFACE_AVAILABLE = True
except ImportError:
    try:
        from langchain_community.llms import HuggingFaceHub
        HuggingFaceEndpoint = HuggingFaceHub  # Fallback
        HUGGINGFACE_AVAILABLE = True
    except ImportError:
        HUGGINGFACE_AVAILABLE = False
        print("⚠️ langchain-huggingface not installed. Run: pip install langchain-huggingface")


class GeminiLLM:
    """Wrapper for Google Gemini to work like LangChain LLM"""
    def __init__(self, model_name="gemini-pro", temperature=0.7, max_tokens=2048):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise Exception("GEMINI_API_KEY not found in .env file")
        genai.configure(api_key=api_key)
        
        # Use standard gemini-pro model
        self.model = genai.GenerativeModel("gemini-pro")
        self.model_name = "gemini-pro"
        self.temperature = temperature
        self.max_tokens = max_tokens
    
    def invoke(self, prompt):
        """Generate response from Gemini"""
        generation_config = genai.types.GenerationConfig(
            temperature=self.temperature,
            max_output_tokens=self.max_tokens,
        )
        response = self.model.generate_content(
            prompt,
            generation_config=generation_config
        )
        # Return object with .content attribute for compatibility
        class Response:
            def __init__(self, text):
                self.content = text
        return Response(response.text)


def get_llm(
    model_type: str = "gemini",
    temperature: float = 0.7, 
    max_tokens: int = 2048,
    ollama_model: str = "llama3.2",
    hf_model: str = "mistralai/Mistral-7B-Instruct-v0.2"
):
    """
    Get an LLM instance. Prefers Google Gemini, falls back to HuggingFace.
    
    Args:
        model_type: "gemini" (default) or "huggingface"
        temperature: Creativity of the model (0.0 to 1.0)
        max_tokens: Maximum tokens to generate
        ollama_model: Ignored (kept for compatibility)
        hf_model: HuggingFace model ID
        
    Returns:
        LLM instance
    """
    
    # Try Gemini first if available
    if GEMINI_AVAILABLE and os.getenv("GEMINI_API_KEY") and False:  # Temporarily disabled
        try:
            llm = GeminiLLM(
                temperature=temperature,
                max_tokens=max_tokens
            )
            print(f"✅ Using Google Gemini ({llm.model_name}, temperature={temperature})")
            return llm
        except Exception as e:
            print(f"⚠️ Gemini failed: {e}. Falling back to HuggingFace...")
            print(f"   Note: Make sure your API key is valid and has Gemini API enabled")
    
    # Fallback to HuggingFace
    if not HUGGINGFACE_AVAILABLE:
        raise Exception("Neither Gemini nor HuggingFace available. Install: pip install google-generativeai")
    
    sec_key = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    if not sec_key:
        raise Exception("HUGGINGFACEHUB_API_TOKEN not found. Add it to .env file.")
    
    try:
        # Use HuggingFaceEndpoint with the new API
        llm = HuggingFaceEndpoint(
            repo_id=hf_model,
            temperature=temperature,
            max_new_tokens=max_tokens,
            huggingfacehub_api_token=sec_key,
        )
        print(f"✅ Using HuggingFace Inference: {hf_model}")
        return llm
    except Exception as e:
        raise Exception(f"Failed to initialize HuggingFace: {e}")


def get_agent_llm(agent_name: str, temperature: float = 0.7):
    """
    Get optimized LLM for specific agent tasks.
    Uses HuggingFace with simpler models.
    
    Agent-specific configurations:
    - search/planning: Fast generation
    - extraction: Accurate analysis  
    - report: Creative writing
    - critic: Strict evaluation
    """
    
    agent_configs = {
        "search": {
            "max_tokens": 512,
            "temperature": 0.5,
            "hf_model": "google/flan-t5-base"
        },
        "extraction": {
            "max_tokens": 1024,
            "temperature": 0.3,
            "hf_model": "google/flan-t5-base"
        },
        "report": {
            "max_tokens": 2048,
            "temperature": 0.7,
            "hf_model": "google/flan-t5-large"
        },
        "critic": {
            "max_tokens": 1024,
            "temperature": 0.2,
            "hf_model": "google/flan-t5-base"
        }
    }
    
    config = agent_configs.get(agent_name, agent_configs["report"])
    config["temperature"] = temperature
    
    # Use HuggingFace
    return get_llm(
        model_type="huggingface",
        temperature=config["temperature"],
        max_tokens=config["max_tokens"],
        hf_model=config["hf_model"]
    )
