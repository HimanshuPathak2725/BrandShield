import React, { useState, useEffect } from 'react';
import './ActionCenter.css';

const ActionCenter = () => {
  const [actionData, setActionData] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fetchLatestAction = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/action-center/latest');
      if (res.ok) {
        const data = await res.json();
        setActionData(data);
        // If already approved/selected previously, set validation
        if (data.selected_response) {
            // Find index of selected if possible, or just don't select draft cards
        }
      }
    } catch (err) {
      console.error("Failed to fetch action center:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestAction();
    // Poll every 5 seconds for simulation
    const interval = setInterval(fetchLatestAction, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async () => {
    if (selectedIdx === null || !actionData) return;
    
    setIsLoading(true);
    try {
       const res = await fetch('/api/action-center/approve', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ 
               response_id: actionData.id, 
               selected_index: selectedIdx 
           })
       });
       if (res.ok) fetchLatestAction();
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!actionData) return;
    setIsSending(true);
    try {
        const res = await fetch('/api/action-center/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                response_id: actionData.id, 
                channel: 'All Channels' 
            })
        });
        if (res.ok) fetchLatestAction();
    } catch (err) {
        console.error(err);
    } finally {
        setIsSending(false);
    }
  };

  if (!actionData) return null;

  return (
    <div className="action-center">
      <div className="action-header">
        <div>
            <h2>Action Center</h2>
            <p className="subtitle">Review and approve AI-generated response strategies.</p>
        </div>
        <span className={`status-badge ${actionData.status}`}>
            {actionData.status}
        </span>
      </div>

      {actionData.status === 'sent' ? (
          <div className="success-message">
              <h3>✅ Response Successfully Deployed</h3>
              <p>Sent via {actionData.channel} at {new Date(actionData.sent_at).toLocaleTimeString()}</p>
              <div className="response-card selected" style={{marginTop: '1.5rem', textAlign: 'left', cursor: 'default'}}>
                  <span className="response-style">{actionData.selected_response.style}</span>
                  <p className="response-text">{actionData.selected_response.text}</p>
              </div>
          </div>
      ) : (
        <>
            <div className="responses-grid">
                {actionData.draft_responses.map((resp, idx) => (
                <div 
                    key={idx} 
                    className={`response-card ${selectedIdx === idx ? 'selected' : ''} ${actionData.status === 'approved' && actionData.selected_response?.text === resp.text ? 'selected' : ''}`}
                    onClick={() => actionData.status === 'draft' && setSelectedIdx(idx)}
                >
                    <span className="response-style">{resp.style} Strategy</span>
                    <p className="response-text">{resp.text}</p>
                </div>
                ))}
            </div>

            <div className="action-footer">
                {actionData.status === 'draft' && (
                    <button 
                        className="btn-primary" 
                        onClick={handleApprove}
                        disabled={selectedIdx === null || isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Approve Selected'}
                    </button>
                )}
                
                {actionData.status === 'approved' && (
                    <button 
                        className="btn-primary" 
                        onClick={handleSend}
                        disabled={isSending}
                    >
                        {isSending ? 'Sending...' : '🚀 Execute Response'}
                    </button>
                )}
            </div>
        </>
      )}
    </div>
  );
};

export default ActionCenter;
