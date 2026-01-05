"""
LLM Utilities for BrandShield
Handles connection to Hugging Face Inference Endpoints.
"""
import os
from langchain_huggingface import HuggingFaceEndpoint

def get_llm(repo_id="mistralai/Mistral-7B-Instruct-v0.2", temperature=0.7, max_new_tokens=2048):
    """
    Get a Hugging Face LLM instance.
    
    Args:
        repo_id: The Hugging Face model ID to use. 
                 Defaults to 'mistralai/Mistral-7B-Instruct-v0.2' (reliable open source instruction model).
        temperature: Creativity of the model (0.0 to 1.0).
        max_new_tokens: Maximum number of tokens to generate.
        
    Returns:
        HuggingFaceEndpoint: Configured LLM instance.
    """
    sec_key = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    if not sec_key:
        print("⚠️ WARNING: HUGGINGFACEHUB_API_TOKEN not found in environment variables.")
        print("   LLM features will fail. Please add it to your .env file.")
        
    llm = HuggingFaceEndpoint(
        repo_id=repo_id,
        task="text-generation",
        max_new_tokens=max_new_tokens,
        do_sample=True,
        temperature=temperature,
        huggingfacehub_api_token=sec_key,
        repetition_penalty=1.1  # Reduces repetition
    )
    return llm
