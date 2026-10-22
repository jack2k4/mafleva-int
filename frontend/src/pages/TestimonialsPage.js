import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Testimonials from '../components/common/Testimonials';
import SocialMedia from '../components/SocialMedia';

const API_BASE_URL = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
const ADMIN_AUTH_TOKEN_KEY = 'mf_admin_token';

const socialFeedSamples = [
  {
    id: 's1',
    platform: 'Instagram',
    text: 'I absolutely love this dress. The stitching is perfect and delivery was fast. 5/5!'
  },
  {
    id: 's2',
    platform: 'Facebook',
    text: 'Amazing perfume quality and long lasting scent. Highly recommend Mafleva to everyone.'
  },
  {
    id: 's3',
    platform: 'TikTok',
    text: 'This order came late and I am disappointed with the package.'
  }
];

function TestimonialsPage() {
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dropFeedback, setDropFeedback] = useState('Drop a social media testimony here. Positive submissions are queued for approval.');
  const [loading, setLoading] = useState(true);
  const [isModerating, setIsModerating] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminAuthorized, setAdminAuthorized] = useState(false);

  const token = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY) || '';

  const withAdminHeaders = useCallback((baseHeaders = {}) => {
    if (!token) {
      return baseHeaders;
    }

    return {
      ...baseHeaders,
      Authorization: `Bearer ${token}`
    };
  }, [token]);

  const fetchTestimonials = useCallback(async (includePending = false) => {
    try {
      const approvedPromise = fetch(`${API_BASE_URL}/api/testimonials?status=approved`);
      const pendingPromise = includePending
        ? fetch(`${API_BASE_URL}/api/testimonials?status=pending`, {
            headers: withAdminHeaders()
          })
        : Promise.resolve({ ok: true, json: async () => ({ testimonials: [] }) });

      const [approvedResponse, pendingResponse] = await Promise.all([approvedPromise, pendingPromise]);
      const approvedData = await approvedResponse.json();
      const pendingData = await pendingResponse.json();

      setApprovedTestimonials(Array.isArray(approvedData.testimonials) ? approvedData.testimonials : []);

      if (includePending && pendingResponse.ok) {
        setPendingTestimonials(Array.isArray(pendingData.testimonials) ? pendingData.testimonials : []);
      } else {
        setPendingTestimonials([]);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      setDropFeedback('Could not load testimonials from the server.');
    } finally {
      setLoading(false);
    }
  }, [withAdminHeaders]);

  useEffect(() => {
    fetchTestimonials(false);
  }, [fetchTestimonials]);

  useEffect(() => {
    if (!token) {
      setAdminAuthorized(false);
      setPendingTestimonials([]);
      return;
    }

    const verifyAdminToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/testimonials/admin/check`, {
          headers: withAdminHeaders()
        });

        if (!response.ok) {
          setAdminAuthorized(false);
          setPendingTestimonials([]);
          return;
        }

        setAdminAuthorized(true);
        await fetchTestimonials(true);
      } catch (error) {
        setAdminAuthorized(false);
        setPendingTestimonials([]);
      }
    };

    verifyAdminToken();
  }, [token, withAdminHeaders, fetchTestimonials]);

  const handleSampleDragStart = (event, sample) => {
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({ text: sample.text, source: sample.platform })
    );
    event.dataTransfer.setData('text/plain', sample.text);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);

    let droppedText = '';
    let source = 'Social media';
    const jsonPayload = event.dataTransfer.getData('application/json');

    if (jsonPayload) {
      try {
        const parsed = JSON.parse(jsonPayload);
        droppedText = (parsed.text || '').trim();
        source = parsed.source || source;
      } catch (_error) {
        droppedText = event.dataTransfer.getData('text/plain').trim();
      }
    } else {
      droppedText = event.dataTransfer.getData('text/plain').trim();
    }

    if (!droppedText) {
      setDropFeedback('No testimony text detected. Drag highlighted review text and try again.');
      return;
    }

    setIsModerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonials/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: droppedText, source })
      });
      const data = await response.json();

      if (!response.ok) {
        setDropFeedback(data.message || 'Could not process the testimony.');
        return;
      }

      const moderation = data.moderation || {};
      if (data.testimonial?.status === 'pending') {
        setDropFeedback(
          `Positive testimony queued for admin approval (score ${moderation.score ?? 'n/a'}, confidence ${moderation.confidence ?? 'n/a'}).`
        );
      } else {
        setDropFeedback(
          `Rejected by moderation model (${moderation.model || 'sentiment-service'}): ${moderation.reason || 'Not positive enough.'}`
        );
      }

      await fetchTestimonials(adminAuthorized);
    } catch (error) {
      console.error('Error submitting testimony:', error);
      setDropFeedback('Failed to submit testimony to moderation service.');
    } finally {
      setIsModerating(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (!adminAuthorized) {
      setDropFeedback('Admin login is required to moderate testimonies.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonials/${id}/status`, {
        method: 'PUT',
        headers: withAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) {
        setDropFeedback(data.message || 'Could not update testimonial status.');
        return;
      }
      setDropFeedback(`Testimonial ${status}.`);
      await fetchTestimonials(true);
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      setDropFeedback('Failed to update testimonial status.');
    }
  };

  const removeTestimonial = async (id) => {
    if (!adminAuthorized) {
      setDropFeedback('Admin login is required to remove testimonies.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: withAdminHeaders()
      });
      const data = await response.json();
      if (!response.ok) {
        setDropFeedback(data.message || 'Could not remove testimonial.');
        return;
      }
      setDropFeedback('Testimonial removed.');
      await fetchTestimonials(true);
    } catch (error) {
      console.error('Error removing testimonial:', error);
      setDropFeedback('Failed to remove testimonial.');
    }
  };

  const testimonialsProps = useMemo(() => (
    approvedTestimonials.length
      ? {
          title: 'Approved Social Media Testimonials',
          subtitle: 'Curated and moderated social testimonials',
          items: approvedTestimonials,
          autoPlayInterval: 6000
        }
      : {}
  ), [approvedTestimonials]);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#2d3436' }}>
        Customer Testimonials
      </h1>
      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#6c757d', marginBottom: '40px' }}>
        What our customers say about us
      </p>

      <div style={{ marginBottom: '28px', background: '#f8f4ed', padding: '18px', borderRadius: '14px' }}>
        <h2 style={{ marginTop: 0, color: '#2d3436', fontSize: '1.3rem' }}>
          Drag Social Testimonies
        </h2>
        <p style={{ marginTop: '0', color: '#5f6368' }}>
          Drag a social media review into the drop zone below. A sentiment moderation service decides acceptance.
        </p>

        <SocialMedia />

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px', marginBottom: '16px' }}>
          {socialFeedSamples.map((sample) => (
            <div
              key={sample.id}
              draggable
              onDragStart={(event) => handleSampleDragStart(event, sample)}
              style={{
                width: '300px',
                background: '#ffffff',
                border: '1px solid #e6dfd3',
                borderRadius: '10px',
                padding: '12px',
                cursor: 'grab',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              <strong style={{ display: 'block', marginBottom: '6px', color: '#2d3436' }}>{sample.platform}</strong>
              <span style={{ color: '#4b4b4b', fontSize: '0.95rem' }}>{sample.text}</span>
            </div>
          ))}
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? '#2d3436' : '#c8b8a3'}`,
            background: isDragging ? '#f1ece2' : (isModerating ? '#f8f1e4' : '#fffaf3'),
            borderRadius: '12px',
            minHeight: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#5f6368',
            padding: '14px'
          }}
        >
          <span>{isModerating ? 'Moderating testimony with sentiment model...' : dropFeedback}</span>
        </div>

        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.95rem', color: '#6c757d' }}>
            Pending approvals: {adminAuthorized ? pendingTestimonials.length : 'Login required'} | Approved: {approvedTestimonials.length}
          </span>
          <button
            onClick={() => setShowAdminPanel((value) => !value)}
            style={{
              border: '1px solid #b8a88f',
              borderRadius: '8px',
              background: '#fff',
              padding: '8px 14px',
              color: '#2d3436',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {showAdminPanel ? 'Hide Admin Moderation' : 'Show Admin Moderation'}
          </button>
        </div>

        {showAdminPanel && (
          <div style={{ marginTop: '16px', background: '#fff', borderRadius: '10px', border: '1px solid #e6dfd3', padding: '14px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#2d3436' }}>Admin Moderation Panel</h3>
            {!adminAuthorized ? (
              <p style={{ margin: 0, color: '#6c757d' }}>Login to the admin dashboard first to unlock moderation controls.</p>
            ) : pendingTestimonials.length === 0 ? (
              <p style={{ margin: 0, color: '#6c757d' }}>No pending testimonies.</p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {pendingTestimonials.map((item) => (
                  <div key={item.id} style={{ border: '1px solid #ece5d9', borderRadius: '8px', padding: '12px' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#374151' }}>
                      "{item.comment}"
                    </p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#6b7280' }}>
                      Source: {item.source} | Model: {item.moderation?.model || 'n/a'} | Score: {item.moderation?.score ?? 'n/a'} | Confidence: {item.moderation?.confidence ?? 'n/a'}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => updateStatus(item.id, 'approved')}
                        style={{ background: '#1f8a4c', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 12px', cursor: 'pointer' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'rejected')}
                        style={{ background: '#b33a3a', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 12px', cursor: 'pointer' }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => removeTestimonial(item.id)}
                        style={{ background: '#3a3f45', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 12px', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#6c757d' }}>Loading testimonials...</p>
      ) : (
        <Testimonials {...testimonialsProps} />
      )}
    </div>
  );
}

export default TestimonialsPage;
