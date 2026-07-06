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
      icon: '🌬️',
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
      icon: '🌍',
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
      icon: '✨',
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
      title: 'Journaling',
      description: 'Process your thoughts',
      icon: '📝',
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

  const moodEmoji = (num) => {
    if (num <= 2) return '😢';
    if (num <= 4) return '😟';
    if (num <= 6) return '😐';
    if (num <= 8) return '🙂';
    return '😊';
  };

  // LANDING PAGE
  if (page === 'landing') {
    return (
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', minHeight: '100vh', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}>
        {/* Animated background elements */}
        <div style={{ position: 'fixed', top: '-50%', right: '-50%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(147, 112, 219, 0.1) 0%, transparent 70%)', pointerEvents: 'none', animation: 'float 20s infinite ease-in-out' }} />
        
        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(30px, 30px); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>Solace</div>
            <button
              onClick={() => setPage('signin')}
              style={{ 
                padding: '10px 24px', 
                background: 'rgba(255,255,255,0.15)', 
                color: 'white', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.25)';
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              Sign In
            </button>
          </div>

          {/* Hero */}
          <div style={{ padding: '120px 40px 80px', textAlign: 'center', maxWidth: '900px', margin: '0 auto', animation: 'slideUp 0.8s ease-out' }}>
            <h1 style={{ fontSize: '64px', margin: '0 0 24px', lineHeight: '1.1', fontWeight: '800', letterSpacing: '-1px', background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your Mental Health Matters
            </h1>
            <p style={{ fontSize: '20px', opacity: 0.8, margin: '0 0 48px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6', fontWeight: '400', color: '#e0e7ff' }}>
              AI-powered support, always available. 24/7 coaching, mood tracking, and healing exercises—all in one beautiful app.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px' }}>
              <button
                onClick={() => setPage('signin')}
                style={{
                  padding: '16px 48px',
                  fontSize: '16px',
                  background: 'linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 24px rgba(147, 112, 219, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(147, 112, 219, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(147, 112, 219, 0.3)';
                }}
              >
                Start Free
              </button>
              <button
                style={{
                  padding: '16px 48px',
                  fontSize: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
            {[
              { icon: '💬', title: 'AI Therapist', desc: 'Compassionate 24/7 support trained in CBT and mindfulness' },
              { icon: '📊', title: 'Track Progress', desc: 'Daily mood logging with intelligent trend analysis' },
              { icon: '🧘', title: 'Healing Exercises', desc: 'Curated breathing, grounding, and journaling techniques' }
            ].map((feature, i) => (
              <div key={i} style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '40px',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '700' }}>{feature.title}</h3>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '14px', lineHeight: '1.5' }}>{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div style={{ padding: '80px 40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '42px', margin: '0 0 60px', fontWeight: '800', letterSpacing: '-0.5px' }}>Plans That Work For You</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
              {[
                { name: 'Free', price: '$0', features: ['Daily mood tracking', 'Limited AI chat (3/day)', 'Basic exercises', 'Journal entries'] },
                { name: 'Pro', price: '$20', period: '/month', features: ['Unlimited AI chat', 'Advanced exercises', 'Crisis resources', 'Detailed insights'], featured: true }
              ].map((plan, i) => (
                <div key={i} style={{
                  background: plan.featured ? 'linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  padding: '48px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  transform: plan.featured ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '24px', fontWeight: '700' }}>{plan.name}</h3>
                  <p style={{ margin: '0 0 32px', fontSize: '48px', fontWeight: '800' }}>{plan.price}<span style={{ fontSize: '16px', opacity: 0.7, fontWeight: '500' }}>{plan.period}</span></p>
                  <ul style={{ textAlign: 'left', margin: '0 0 32px', paddingLeft: 0, listStyle: 'none', fontSize: '14px', lineHeight: '2' }}>
                    {plan.features.map((feature, j) => (
                      <li key={j} style={{ opacity: 0.9 }}>✓ {feature}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setPage('signin')}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: plan.featured ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)',
                      color: 'white',
                      border: plan.featured ? '1px solid rgba(255,255,255,0.3)' : 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      backdropFilter: plan.featured ? 'blur(10px)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SIGNIN PAGE
  if (page === 'signin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.1)', padding: '48px', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', color: 'white' }}>
          <h2 style={{ marginBottom: '12px', textAlign: 'center', color: 'white', fontSize: '28px', fontWeight: '700' }}>Welcome to Solace</h2>
          <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '14px', marginBottom: '32px' }}>Your healing journey begins here</p>
          <button
            onClick={() => {
              setUser({ id: 'user_' + Math.random(), email: 'user@example.com' });
              setPage('app');
            }}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', marginBottom: '16px', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s ease', boxShadow: '0 8px 24px rgba(147, 112, 219, 0.3)' }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Sign In with Google
          </button>
          <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '12px', marginBottom: '24px' }}>No credit card required. Always free to try.</p>
          <button
            onClick={() => setPage('landing')}
            style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)' }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h1 style={{ margin: 0, color: '#9333ea', fontSize: '24px', fontWeight: '700' }}>Solace</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {!isPremium && (
            <button onClick={handlePayment} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(147, 112, 219, 0.2)' }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
              Upgrade
            </button>
          )}
          {isPremium && <span style={{ color: '#9333ea', fontWeight: '600', fontSize: '13px' }}>★ Pro</span>}
          <button onClick={() => { setUser(null); setPage('landing'); }} style={{ padding: '10px 16px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.3s ease' }}
          onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Crisis Banner */}
        <div style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '1px solid #fca5a5', padding: '24px', borderRadius: '16px', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '24px' }}>🆘</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 8px', color: '#991b1b', fontWeight: '700', fontSize: '16px' }}>In Crisis?</h3>
            <p style={{ margin: '0 0 12px', color: '#7c2d12', fontSize: '14px' }}>Call <strong>988</strong> (24/7) or text <strong>HOME to 741741</strong></p>
            <button onClick={() => setSelectedExercise('crisis')} style={{ padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
              Get Resources
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Left Column */}
          <div>
            {/* Mood Tracker */}
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '24px', color: '#1e293b', fontWeight: '700', fontSize: '18px' }}>How are you today?</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center', gap: '8px' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <button
                    key={num}
                    onClick={() => setMood(num)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      border: mood === num ? '2px solid #9333ea' : '2px solid #e2e8f0',
                      background: mood === num ? 'linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)' : '#f8fafc',
                      color: mood === num ? 'white' : '#64748b',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (mood !== num) e.target.style.borderColor = '#cbd5e1';
                    }}
                    onMouseLeave={(e) => {
                      if (mood !== num) e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    {mood === num ? moodEmoji(num) : num}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="What's on your mind today?"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', minHeight: '100px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit', resize: 'none', transition: 'all 0.3s ease' }}
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                onClick={logMood}
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(147, 112, 219, 0.2)' }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Save Mood
              </button>
            </div>

            {/* Mood Chart */}
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '24px', color: '#1e293b', fontWeight: '700', fontSize: '18px' }}>Your Progress</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '160px', gap: '6px', marginBottom: '16px' }}>
                {moodHistory.map((m, idx) => (
                  <div key={idx} style={{ flex: 1, background: `linear-gradient(135deg, rgba(147, 112, 219, 0.${3 + idx}) 0%, rgba(147, 112, 219, 0.${2 + idx}) 100%)`, borderRadius: '6px', height: (m / 10) * 140 + 'px', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.target.style.opacity = '1'}
                  onMouseLeave={(e) => e.target.style.opacity = '0.7'} />
                ))}
              </div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>
                Average: <strong style={{ color: '#9333ea' }}>{Math.round(moodHistory.reduce((a,b) => a+b) / moodHistory.length)}/10</strong>
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* AI Chat */}
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', height: '540px', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', fontWeight: '700', fontSize: '18px' }}>Your Coach</h3>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                {chatMessages.length === 0 && (
                  <p style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '60px', fontSize: '14px' }}>
                    Hi there. I'm here to listen. What's on your mind?
                  </p>
                )}
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: '16px', textAlign: msg.role === 'user' ? 'right' : 'left', animation: 'slideUp 0.4s ease-out' }}>
                    <div style={{
                      display: 'inline-block',
                      background: msg.role === 'user' ? 'linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)' : '#f1f5f9',
                      color: msg.role === 'user' ? 'white' : '#1e293b',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      maxWidth: '80%',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      wordWrap: 'break-word',
                      boxShadow: msg.role === 'user' ? '0 4px 12px rgba(147, 112, 219, 0.2)' : 'none'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Type your thoughts..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  style={{ flex: 1, padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.3s ease' }}
                  onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  style={{ padding: '12px 24px', background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(147, 112, 219, 0.2)' }}
                  onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                >
                  {loading ? '...' : 'Send'}
                </button>
              </div>
            </div>

            {/* Exercises */}
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', fontWeight: '700', fontSize: '18px' }}>Exercises</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {exercises.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex.id)}
                    style={{
                      padding: '16px',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ fontSize: '24px', flexShrink: 0 }}>{ex.icon}</div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px', fontSize: '14px' }}>{ex.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{ex.description} • {ex.duration}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Modal */}
      {selectedExercise && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '48px', borderRadius: '20px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto', fontFamily: 'inherit', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s ease-out' }}>
            {selectedExercise === 'crisis' ? (
              <>
                <h2 style={{ marginTop: 0, color: '#dc2626', marginBottom: '16px', fontSize: '24px', fontWeight: '700' }}>You're Not Alone</h2>
                <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '32px', fontSize: '14px' }}>
                  If you're thinking about harming yourself, please reach out right now. These services are free, confidential, and available 24/7.
                </p>
                {crisisResources.map(res => (
                  <div key={res.name} style={{ background: '#fee2e2', padding: '16px', borderRadius: '12px', marginBottom: '12px', border: '1px solid #fecaca' }}>
                    <div style={{ fontWeight: '700', color: '#991b1b', marginBottom: '4px', fontSize: '14px' }}>{res.name}</div>
                    <div style={{ color: '#7c2d12', fontSize: '13px' }}>
                      {res.phone && <div><strong>{res.phone}</strong></div>}
                      {res.text && <div>{res.text}</div>}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
                  <div style={{ fontSize: '32px' }}>{exercises.find(e => e.id === selectedExercise)?.icon}</div>
                  <h2 style={{ margin: 0, color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>
                    {exercises.find(e => e.id === selectedExercise)?.title}
                  </h2>
                </div>
                <ol style={{ color: '#475569', lineHeight: '1.8', marginBottom: '32px', paddingLeft: '20px', fontSize: '14px' }}>
                  {exercises.find(e => e.id === selectedExercise)?.steps.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '12px' }}>{step}</li>
                  ))}
                </ol>
              </>
            )}
            <button
              onClick={() => setSelectedExercise(null)}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(147, 112, 219, 0.2)' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
