import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './viewfeed.css';

function Viewfeed({ loggedUser }) {
  useEffect(() => {
    document.title = 'View Feedback';
  }, []);
  const navigate = useNavigate();
  const { id } = useParams();

  const [feedback, setFeedback] = useState(null);
  const [managerApproval, setManagerApproval] = useState('');
  const [managerReason, setManagerReason] = useState('');
  const [tlApproval, setTlApproval] = useState('');
  const [tlReason, setTlReason] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/feedback/${id}/`);
        setFeedback(res.data);

        if (res.data.manager_approval && res.data.manager_approval !== 'Pending') {
          setManagerApproval(res.data.manager_approval.toLowerCase());
          setManagerReason(res.data.ReasonManager || '');
        }
        if (res.data.tl_approval && res.data.tl_approval !== 'Pending') {
          setTlApproval(res.data.tl_approval.toLowerCase());
          setTlReason(res.data.ReasonTL || '');
        }
      } catch (err) {
        console.error('Error fetching feedback:', err);
      }
    };

    fetchFeedback();
  }, [id]);

  const role = loggedUser?.role?.toLowerCase();
  const isManager = role === 'manager';
  const isTeamLead = role === 'team lead';
  const isHR = role === 'hr';

  const showManagerButtons =
    isManager && feedback?.manager_approval === 'Pending';
  const showTLButtons =
    isTeamLead && feedback?.tl_approval === 'Pending';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showManagerButtons && !managerApproval) {
      alert('Please approve or reject as Manager.');
      return;
    }
    if (showManagerButtons && managerApproval === 'rejected' && managerReason.trim() === '') {
      alert('Please provide a reason for Manager rejection.');
      return;
    }

    if (showTLButtons && !tlApproval) {
      alert('Please approve or reject as Team Lead.');
      return;
    }
    if (showTLButtons && tlApproval === 'rejected' && tlReason.trim() === '') {
      alert('Please provide a reason for TL rejection.');
      return;
    }

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toTimeString().split(' ')[0];

    const payload = {
      manager_name: showManagerButtons
        ? `${loggedUser.firstName} ${loggedUser.lastName}`
        : feedback.manager_name,
      manager_approval: showManagerButtons
        ? (managerApproval === 'approved' ? 'Approved' : 'Rejected')
        : feedback.manager_approval,
      ReasonManager: showManagerButtons
        ? (managerApproval === 'rejected' ? managerReason : '')
        : feedback.ReasonManager,

      tl_name: showTLButtons
        ? `${loggedUser.firstName} ${loggedUser.lastName}`
        : feedback.tl_name,
      tl_approval: showTLButtons
        ? (tlApproval === 'approved' ? 'Approved' : 'Rejected')
        : feedback.tl_approval,
      ReasonTL: showTLButtons
        ? (tlApproval === 'rejected' ? tlReason : '')
        : feedback.ReasonTL,

      last_modified_date: formattedDate,
      last_modified_time: formattedTime,
    };

    try {
      await axios.patch(`http://127.0.0.1:8000/api/feedback/${id}/`, payload);
      alert('Feedback updated successfully!');
      navigate('/listfeed');
    } catch (err) {
      console.error('Error updating feedback:', err);
    }
  };

  const handleCancel = () => {
    navigate('/listfeed');
  };

  if (!feedback) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1 className="heads">Feedback Approval</h1>

        <div className="row-horizontal">
          <div className="field-box">
            <label className="form-label">ID:</label>
            <input className="text-input" type="text" value={feedback.employee.id} readOnly />
          </div>
          <div className="field-box">
            <label className="form-label">Employee:</label>
            <input
              className="text-input"
              type="text"
              value={`${feedback.employee.firstName} ${feedback.employee.lastName}`}
              readOnly
            />
          </div>
        </div>

        <label className="form-label">Performed By:</label>
        <input className="text-input" type="text" value={feedback.performed_by || ''} readOnly />

        <label className="form-label">Rating:</label>
        <input className="text-input" type="text" value={feedback.Rating || ''} readOnly />

        <label className="form-label">Year:</label>
        <input className="text-input" type="text" value={feedback.year} readOnly />

        <label className="form-label">Month:</label>
        <input className="text-input" type="text" value={feedback.month} readOnly />

        <label className="form-label">HR Comment:</label>
        <input className="text-input" type="text" value={feedback.comment} readOnly />

        {/* Manager Section */}
        <label className="form-label">Manager Name:</label>
        <input
          className="text-input"
          type="text"
          value={
            feedback.manager_approval === 'Pending' && isManager
              ? `${loggedUser.firstName} ${loggedUser.lastName}`
              : feedback.manager_name || ''
          }
          readOnly
        />

        <label className="form-label">Manager Approval:</label>
        <input
          className="text-input"
          type="text"
          value={feedback.manager_approval}
          readOnly
        />

        {feedback.manager_approval === 'Rejected' && !showManagerButtons && (
          <>
            <label className="form-label">Manager Reason:</label>
            <textarea
              className="textarea-input"
              value={feedback.ReasonManager}
              readOnly
              rows="3"
            />
          </>
        )}

        {showManagerButtons && (
          <>
            <div className="approve-reject-group">
              <button
                type="button"
                className={`small-btn approve-btn ${managerApproval === 'approved' ? 'active' : ''}`}
                onClick={() => {
                  setManagerApproval('approved');
                  setManagerReason('');
                }}
              >
                Approve
              </button>
              <button
                type="button"
                className={`small-btn reject-btn ${managerApproval === 'rejected' ? 'active' : ''}`}
                onClick={() => setManagerApproval('rejected')}
              >
                Reject
              </button>
            </div>

            {managerApproval === 'rejected' && (
              <>
                <label className="form-label">Reason for Rejection:</label>
                <textarea
                  className="textarea-input"
                  value={managerReason}
                  onChange={(e) => setManagerReason(e.target.value)}
                  rows="3"
                />
              </>
            )}
          </>
        )}

        {/* Team Lead Section */}
        <label className="form-label">Team Lead Name:</label>
        <input
          className="text-input"
          type="text"
          value={
            feedback.tl_approval === 'Pending' && isTeamLead
              ? `${loggedUser.firstName} ${loggedUser.lastName}`
              : feedback.tl_name || ''
          }
          readOnly
        />

        <label className="form-label">Team Lead Approval:</label>
        <input
          className="text-input"
          type="text"
          value={feedback.tl_approval}
          readOnly
        />

        {feedback.tl_approval === 'Rejected' && !showTLButtons && (
          <>
            <label className="form-label">TL Reason:</label>
            <textarea
              className="textarea-input"
              value={feedback.ReasonTL}
              readOnly
              rows="3"
            />
          </>
        )}

        {showTLButtons && (
          <>
            <div className="approve-reject-group">
              <button
                type="button"
                className={`small-btn approve-btn ${tlApproval === 'approved' ? 'active' : ''}`}
                onClick={() => {
                  setTlApproval('approved');
                  setTlReason('');
                }}
              >
                Approve
              </button>
              <button
                type="button"
                className={`small-btn reject-btn ${tlApproval === 'rejected' ? 'active' : ''}`}
                onClick={() => setTlApproval('rejected')}
              >
                Reject
              </button>
            </div>

            {tlApproval === 'rejected' && (
              <>
                <label className="form-label">Reason for Rejection:</label>
                <textarea
                  className="textarea-input"
                  value={tlReason}
                  onChange={(e) => setTlReason(e.target.value)}
                  rows="3"
                />
              </>
            )}
          </>
        )}

        <div className="action-buttons">
          {(showManagerButtons || showTLButtons) && (
            <button type="submit" className="big-btn update-btn">
              Update
            </button>
          )}
          <button type="button" className="big-btn cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Viewfeed;
