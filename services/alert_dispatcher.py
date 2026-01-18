import os
import smtplib
from email.mime.text import MIMEText
from typing import Dict, Any

class AlertDispatcherService:
    def check_and_alert(self, risk_metrics: Dict[str, float], velocity_metrics: Dict[str, float], brand: str):
        risk_score = risk_metrics.get("risk_score", 0.0)
        trend_prob = velocity_metrics.get("trend_probability", 0.0)
        
        threshold_risk = float(os.getenv("ALERT_THRESHOLD_RISK", 0.7))
        threshold_trend = float(os.getenv("ALERT_THRESHOLD_TREND", 80.0))
        
        alerts = []
        
        if risk_score > threshold_risk:
            msg = f"CRITICAL: High Risk Score ({risk_score:.2f}) detected for {brand}."
            self.send_email(brand, msg)
            alerts.append({"type": "risk", "msg": msg})
            
        if trend_prob > threshold_trend:
            msg = f"WARNING: High Viral Velocity ({trend_prob:.1f}%) detected for {brand}."
            self.send_slack(msg)
            alerts.append({"type": "trend", "msg": msg})
            
        return alerts

    def send_email(self, brand: str, body: str):
        # Mock or real implementation
        smtp_server = os.getenv("SMTP_SERVER")
        if not smtp_server:
            print(f"[Simulated Email Alert] To Executives: {body}")
            return

        # Implementation of SMTP send would go here
        pass

    def send_slack(self, message: str):
        webhook = os.getenv("SLACK_WEBHOOK_URL")
        # if webhook: requests.post(webhook, json={"text": message})
        if not webhook:
            print(f"[Simulated Slack Alert] {message}")

alert_dispatcher = AlertDispatcherService()
