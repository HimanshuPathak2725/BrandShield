import aiosqlite
import json
from typing import List, Dict, Optional
from datetime import datetime
from services.new_db_models import ActionResponse, IncidentLog

DB_PATH = "brandshield.db"

class ActionCenterService:
    async def init_db(self):
        async with aiosqlite.connect(DB_PATH) as db:
            await db.execute("""
                CREATE TABLE IF NOT EXISTS action_responses (
                    id TEXT PRIMARY KEY,
                    incident_id TEXT,
                    draft_responses TEXT,
                    selected_response TEXT,
                    status TEXT,
                    sent_at TEXT,
                    channel TEXT
                )
            """)
            await db.execute("""
                CREATE TABLE IF NOT EXISTS incident_logs (
                    id TEXT PRIMARY KEY,
                    brand_id TEXT,
                    timestamp TEXT,
                    crisis_level TEXT,
                    summary TEXT,
                    response_used TEXT
                )
            """)
            await db.commit()

    async def create_response_plan(self, incident_id: str, drafts: List[Dict[str, str]]) -> ActionResponse:
        response_plan = ActionResponse(
            incident_id=incident_id,
            draft_responses=drafts
        )
        async with aiosqlite.connect(DB_PATH) as db:
            await db.execute(
                "INSERT INTO action_responses (id, incident_id, draft_responses, status) VALUES (?, ?, ?, ?)",
                (
                    response_plan.id,
                    response_plan.incident_id,
                    json.dumps(response_plan.draft_responses),
                    response_plan.status
                )
            )
            await db.commit()
        return response_plan

    async def approve_response(self, response_id: str, selected_idx: int) -> Optional[ActionResponse]:
        async with aiosqlite.connect(DB_PATH) as db:
            cursor = await db.execute("SELECT draft_responses FROM action_responses WHERE id = ?", (response_id,))
            row = await cursor.fetchone()
            if not row:
                return None
            
            drafts = json.loads(row[0])
            if selected_idx < 0 or selected_idx >= len(drafts):
                raise ValueError("Invalid response index")
                
            selected = drafts[selected_idx]
            
            await db.execute(
                "UPDATE action_responses SET selected_response = ?, status = 'approved' WHERE id = ?",
                (json.dumps(selected), response_id)
            )
            await db.commit()
            
            # Re-fetch
            # (simplified return)
            return ActionResponse(
                id=response_id, 
                incident_id="unknown", # fetch properly in real app
                draft_responses=drafts,
                selected_response=selected,
                status="approved"
            )

    async def send_response(self, response_id: str, channel: str = "simulation") -> bool:
        # Simulate sending
        print(f"🚀 Sending response {response_id} via {channel}...")
        async with aiosqlite.connect(DB_PATH) as db:
            await db.execute(
                "UPDATE action_responses SET status = 'sent', sent_at = ?, channel = ? WHERE id = ?",
                (datetime.now().isoformat(), channel, response_id)
            )
            await db.commit()
        return True
    
    async def get_latest_action(self) -> Optional[Dict[str, Any]]:
        async with aiosqlite.connect(DB_PATH) as db:
            cursor = await db.execute("SELECT * FROM action_responses ORDER BY sent_at DESC LIMIT 1")
            row = await cursor.fetchone()
            if not row:
                return None
            return {
                "id": row[0],
                "incident_id": row[1],
                "draft_responses": json.loads(row[2]),
                "selected_response": json.loads(row[3]) if row[3] else None,
                "status": row[4],
                "sent_at": row[5],
                "channel": row[6]
            }

    async def log_incident(self, log: IncidentLog):
        async with aiosqlite.connect(DB_PATH) as db:
             await db.execute(
                "INSERT INTO incident_logs (id, brand_id, timestamp, crisis_level, summary, response_used) VALUES (?, ?, ?, ?, ?, ?)",
                (log.id, log.brand_id, log.timestamp.isoformat(), log.crisis_level, log.summary, log.response_used)
             )
             await db.commit()

action_center = ActionCenterService()
