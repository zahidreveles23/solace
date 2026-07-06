import React, { useState, useEffect } from 'react';

export default function Solace() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState(5);
  const [journalEntry, setJournalEntry] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [moodHistory, setMoodHistory] = useState([5,5,5,5,5,5,5]);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const exercises = [
    {
      id: 'breathing',
      title: '4-7-8 Breathing',
      description: 'Calm your nervous system',
      duration: '2 min',
      steps: [
        'Breathe in through nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through mouth for 8 counts',
        'Repeat 4 times'
      ]
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      description: 'When you feel overwhelmed',
      duration: '5 min',
      steps: [
        'Name 5 things you see',
        'Name 4 things you can touch',
        'Name 3 things you hear',
        'Name 2 things you smell',
        'Name 1 thing you taste'
      ]
    },
    {
      id: 'gratitude',
      title: 'Gratitude Practice',
      description: 'Shift your perspective',
      duration: '3 min',
      steps: [
        'Name 3 things you\'re grateful for',
        'Say why each one matters',
        'Feel the gratitude in your body',
        'Write them down if possible'
      ]
    },
    {
      id: 'journal',
      title: 'Journaling Prompt',
      description: 'Process your thoughts',
      duration: '10 min',
      steps: [
        'What am I feeling right now?',
        'Why do you think I feel this way?',
        'What do I need?',
        'What\'s one small thing that would help?'
      ]
    }
  ];

  const crisisResources = [
    { name: '988 Suicide & Crisis Lifeline', phone: '988', available: '24/7' },
    { name: 'Crisis Text Line', text: 'Text HOME to 741741', available: '24/7' },
  ];

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    setLoading(true);
    const userMsg = currentMessage;
    setChatMessages([...chatMessages, { role: 'user', content: userMsg }]);
    setCurrentMessage('');

    try {
      const response = await fetch('/api/solace-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, userId: user.id }),
      });

      const data = await response.json();
      if (data.response) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'I\'m here to listen. Please try again.' }]);
    }
    setLoading(false);
  };

  const logMood = () => {
    const newHistory = [...moodHistory.slice(1), mood];
    setMoodHistory(newHistory);
    setJournalEntry('');
  };

  const handlePayment = async () => {
    const response = await fetch('/api/solace-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
    const { sessionId } = await response.json();
    window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
  };

  // LANDING PAGE
  if (page === 'landing') {
    return (
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', color: 'white', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Solace</h1>
          <button
            onClick={() => setPage('signin')}
            style={{ padding: '10px 20px', background: 'white', color: '#667eea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            Sign In
          </button>
        </div>

        <div style={{ padding: '80px 40px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '52px', margin: '0 0 20px', lineHeight: '1.2', fontWeight: 'bold' }}>
            Your refuge for mental healing
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.95, margin: '0 0 40px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
            AI-powered mental health support, available 24/7. Journal, chat with your coach, track your mood, and access healing exercises whenever you need them.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '60px' }}>
            <button
              onClick={() => setPage('signin')}
              style={{
                padding: '16px 40px',
                fontSize: '16px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Start Free
            </button>
            <button
              style={{
                padding: '16px 40px',
                fontSize: '16px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '40px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>💬</div>
            <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 'bold' }}>AI Therapist</h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px', lineHeight: '1.6' }}>Talk anytime. Get compassionate support from your AI coach, trained in CBT and mindfulness.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '40px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
            <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 'bold' }}>Track Progress</h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px', lineHeight: '1.6' }}>Log your mood daily, journal your thoughts, and see your progress over time.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '40px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🧘</div>
            <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 'bold' }}>Healing Exercises</h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px', lineHeight: '1.6' }}>Breathing techniques, grounding exercises, and journaling prompts.</p>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '60px 40px', textAlign: 'center', marginTop: '40px' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '30px', fontWeight: 'bold' }}>Simple pricing that works for everyone</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ background: 'white', color: '#333', padding: '40px', borderRadius: '12px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 'bold' }}>Free</h4>
              <p style={{ fontSize: '32px', margin: '0 0 20px', fontWeight: 'bold' }}>$0</p>
              <ul style={{ textAlign: 'left', margin: '0 0 30px', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li>Daily mood tracking</li>
                <li>Limited AI chat (3/day)</li>
                <li>Basic exercises</li>
                <li>Journal entries</li>
              </ul>
              <button onClick={() => setPage('signin')} style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                Get Started
              </button>
            </div>
            <div style={{ background: 'white', color: '#333', padding: '40px', borderRadius: '12px', border: '3px solid #667eea' }}>
              <div style={{ background: '#667eea', color: 'white', display: 'inline-block', padding: '8px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>
                Most Popular
              </div>
              <h4 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 'bold' }}>Pro</h4>
              <p style={{ fontSize: '32px', margin: '0 0 5px', fontWeight: 'bold' }}>$20<span style={{ fontSize: '14px', fontWeight: 'normal' }}>/month</span></p>
              <p style={{ fontSize: '12px', color: '#999', margin: '0 0 20px' }}>14-day free trial</p>
              <ul style={{ textAlign: 'left', margin: '0 0 30px', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li>Unlimited AI chat</li>
                <li>Advanced exercises</li>
                <li>Crisis resources</li>
                <li>Detailed mood insights</li>
              </ul>
              <button onClick={() => setPage('signin')} style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SIGNIN PAGE
  if (page === 'signin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ background: 'white', padding: '50px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '10px', textAlign: 'center', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>Welcome to Solace</h2>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '30px' }}>Your journey to healing starts here</p>
          <button
            onClick={() => {
              setUser({ id: 'user_' + Math.random(), email: 'user@example.com' });
              setPage('app');
            }}
            style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold', fontSize: '14px' }}
          >
            Sign In with Google
          </button>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '13px', marginBottom: '20px' }}>No credit card required. Free tier available forever.</p>
          <button
            onClick={() => setPage('landing')}
            style={{ width: '100%', padding: '12px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e0e0e0', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, color: '#667eea', fontSize: '24px', fontWeight: 'bold' }}>Solace</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {!isPremium && (
            <button onClick={handlePayment} style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
              Upgrade to Pro
            </button>
          )}
          {isPremium && <span style={{ color: '#667eea', fontWeight: 'bold', fontSize: '14px' }}>✓ Pro Member</span>}
          <button onClick={() => { setUser(null); setPage('landing'); }} style={{ padding: '10px 15px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Crisis Alert */}
        <div style={{ background: '#fee8e8', border: '1px solid #f5a5a5', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ fontSize: '20px' }}>🆘</div>
            <div>
              <h3 style={{ margin: '0 0 10px', color: '#d32f2f', fontWeight: 'bold' }}>In Crisis? Get Immediate Help</h3>
              <p style={{ margin: '0 0 15px', color: '#666', fontSize: '14px' }}>
                Call <strong>988</strong> (24/7) or text <strong>HOME to 741741</strong>. You're not alone.
              </p>
              <button onClick={() => setSelectedExercise('crisis')} style={{ padding: '8px 16px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                View Resources
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Left Column */}
          <div>
            {/* Mood Tracker */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>How are you feeling?</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <button
                    key={num}
                    onClick={() => setMood(num)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: mood === num ? '3px solid #667eea' : '1px solid #ddd',
                      background: mood === num ? '#667eea' : 'white',
                      color: mood === num ? 'white' : '#666',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Write about what's on your mind..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', minHeight: '80px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '15px', fontFamily: 'inherit' }}
              />
              <button
                onClick={logMood}
                style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
              >
                Save Mood
              </button>
            </div>

            {/* Mood Trend */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>Your 7-Day Trend</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '8px', marginBottom: '15px' }}>
                {moodHistory.map((m, idx) => (
                  <div key={idx} style={{ flex: 1, background: '#667eea', borderRadius: '4px', height: (m / 10) * 120 + 'px', opacity: 0.6 + (idx / 14) }} />
                ))}
              </div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
                Average: {Math.round(moodHistory.reduce((a,b) => a+b) / moodHistory.length)}/10
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* AI Chat */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', height: '500px', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>Chat with Your Coach</h3>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                {chatMessages.length === 0 && (
                  <p style={{ color: '#999', textAlign: 'center', paddingTop: '40px', fontSize: '14px' }}>
                    Hi there. I'm here to listen and support you. What's on your mind?
                  </p>
                )}
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: '15px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    <div style={{
                      display: 'inline-block',
                      background: msg.role === 'user' ? '#667eea' : '#f0f0f0',
                      color: msg.role === 'user' ? 'white' : '#333',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      maxWidth: '80%',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      wordWrap: 'break-word'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Share what's on your heart..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  style={{ padding: '12px 20px', background: loading ? '#ccc' : '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                >
                  {loading ? '...' : 'Send'}
                </button>
              </div>
            </div>

            {/* Exercises */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>Healing Exercises</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {exercises.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex.id)}
                    style={{
                      padding: '15px',
                      background: '#f9f9f9',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                    onMouseLeave={(e) => e.target.style.background = '#f9f9f9'}
                  >
                    <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', fontSize: '14px' }}>{ex.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{ex.description} • {ex.duration}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Modal */}
      {selectedExercise && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto', fontFamily: 'inherit' }}>
            {selectedExercise === 'crisis' ? (
              <>
                <h2 style={{ marginTop: 0, color: '#d32f2f', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>You're Not Alone</h2>
                <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '25px', fontSize: '14px' }}>
                  If you're thinking about harming yourself, please reach out right now. These services are free, confidential, and available 24/7.
                </p>
                {crisisResources.map(res => (
                  <div key={res.name} style={{ background: '#fee8e8', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                    <div style={{ fontWeight: 'bold', color: '#d32f2f', marginBottom: '5px', fontSize: '14px' }}>{res.name}</div>
                    <div style={{ color: '#666', fontSize: '13px' }}>
                      {res.phone && <div>Call: <strong>{res.phone}</strong></div>}
                      {res.text && <div>{res.text}</div>}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Available: {res.available}</div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <h2 style={{ marginTop: 0, color: '#667eea', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                  {exercises.find(e => e.id === selectedExercise)?.title}
                </h2>
                <ol style={{ color: '#333', lineHeight: '1.8', marginBottom: '25px', paddingLeft: '20px', fontSize: '14px' }}>
                  {exercises.find(e => e.id === selectedExercise)?.steps.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '10px' }}>{step}</li>
                  ))}
                </ol>
              </>
            )}
            <button
              onClick={() => setSelectedExercise(null)}
              style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
