import json
from typing import List, Dict, Any
from src.llm_utils import GeminiLLM, get_llm

class ResponseGeneratorService:
    def __init__(self):
        self.llm = get_llm() # Assumes get_llm returns the best available LLM

    def generate_responses(self, brand: str, crisis_context: str) -> List[Dict[str, str]]:
        prompt = f"""
        You are a PR Crisis Manager for {brand}.
        Situation: {crisis_context}

        Draft 3 short, distinct press responses:
        1. Empathetic (Apologetic, focused on victims/customers)
        2. Defensive (Factual, correcting misinformation)
        3. Transparent (Admitting fault, outlining steps to fix)

        Format strictly as JSON:
        [
            {{"style": "empathetic", "text": "..."}},
            {{"style": "defensive", "text": "..."}},
            {{"style": "transparent", "text": "..."}}
        ]
        """
        
        try:
            # invoke returns an object with .content usually in LangChain, but GeminiLLM.invoke might return string or object
            # Let's check typical usage or assume .content or string
            response = self.llm.invoke(prompt)
            content = response.content if hasattr(response, 'content') else str(response)
            
            # Clean markdown json blocks
            content = content.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
        except Exception as e:
            print(f"Error generating responses: {e}")
            return [
                {"style": "empathetic", "text": f"We are deeply sorry to hear about the issues with {brand}."},
                {"style": "defensive", "text": f"{brand} follows all industry protocols strictly."},
                {"style": "transparent", "text": f"We have identified a potential issue at {brand} and are investigating."}
            ]

response_generator = ResponseGeneratorService()
