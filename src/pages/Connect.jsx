// src/pages/Connect.jsx
import { useState, useRef, useEffect } from 'react';
import styles from './Connect.module.css';

/* ─── Mock Data ────────────────────────────────────────── */
const CONDITIONS = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'diabetes', label: 'Diabetes', icon: '🩸' },
  { id: 'heart', label: 'Heart', icon: '❤️' },
  { id: 'bp', label: 'BP', icon: '💉' },
  { id: 'asthma', label: 'Asthma', icon: '🫁' },
  { id: 'arthritis', label: 'Arthritis', icon: '🦴' },
  { id: 'thyroid', label: 'Thyroid', icon: '🔵' },
];

const USERS = {
  u1: { id: 'u1', name: 'Priya S.', avatar: '👩', age: 52, city: 'Mumbai', condition: 'diabetes', bio: 'Managing diabetes for 6 years. Love sharing home remedies and Ayurvedic tips.', posts: 14, friends: 38, streak: 12 },
  u2: { id: 'u2', name: 'Ramesh K.', avatar: '👨', age: 67, city: 'Chennai', condition: 'heart', bio: 'Heart patient post-surgery. Walking 40 mins daily. Staying positive! 💪', posts: 9, friends: 21, streak: 5 },
  u3: { id: 'u3', name: 'Sunita M.', avatar: '👩‍🦳', age: 59, city: 'Delhi', condition: 'bp', bio: 'Hypertension for 10 years. Low sodium cooking expert. Happy to help!', posts: 22, friends: 54, streak: 21 },
  u4: { id: 'u4', name: 'Arjun T.', avatar: '🧑', age: 34, city: 'Pune', condition: 'asthma', bio: 'Managing asthma since childhood. Air quality enthusiast and tech lover.', posts: 7, friends: 17, streak: 3 },
  u5: { id: 'u5', name: 'Kamala R.', avatar: '👴', age: 68, city: 'Kolkata', condition: 'arthritis', bio: 'Retired teacher. Knee arthritis since 2018. Turmeric milk evangelist! 🌿', posts: 31, friends: 62, streak: 45 },
  u6: { id: 'u6', name: 'Deepa V.', avatar: '👩‍🔬', age: 41, city: 'Bengaluru', condition: 'thyroid', bio: 'Hypothyroidism warrior. Nutritionist by profession. DM for diet tips!', posts: 18, friends: 45, streak: 8 },
};

const POSTS_INIT = [
  { id: 1, userId: 'u1', condition: 'diabetes', time: '2h ago', title: 'Managing sugar levels with home remedies', body: 'I have been using karela juice every morning for 3 months now. My HbA1c dropped from 8.2 to 7.1! Happy to share the recipe with anyone interested. 🌿', likes: 47, comments: 18, liked: false },
  { id: 2, userId: 'u2', condition: 'heart', time: '5h ago', title: 'Post surgery recovery tips', body: "Had a stent placed 4 months ago. The cardiac rehab walking plan has been life-changing. Starting with 10 mins and now doing 40 mins daily. Don't give up! 💪", likes: 93, comments: 34, liked: false },
  { id: 3, userId: 'u3', condition: 'bp', time: '1d ago', title: 'Low sodium cooking that actually tastes good', body: 'My husband refused to eat low-sodium food for months. Found a trick — lemon and fresh coriander together. It replaces salt beautifully. BP is now 128/82! 🍋', likes: 61, comments: 22, liked: true },
  { id: 4, userId: 'u4', condition: 'asthma', time: '1d ago', title: 'Air purifier recommendations for Indian homes', body: 'Tried 4 brands over 2 years. For pollution-heavy cities, Dyson or Philips AC series work best. Night attacks reduced by 80%.', likes: 38, comments: 11, liked: false },
  { id: 5, userId: 'u5', condition: 'arthritis', time: '2d ago', title: 'Turmeric milk daily for joint pain', body: 'I am 68 years old and have had knee arthritis since 2018. Adding haldi milk every night has visibly reduced swelling. 🌿', likes: 112, comments: 45, liked: false },
  { id: 6, userId: 'u6', condition: 'thyroid', time: '3d ago', title: 'Hypothyroidism and weight management', body: 'Two years of struggle. Finally saw results with Brazil nuts (selenium) and cutting gluten. Combined with levothyroxine — lost 6 kg in 4 months.', likes: 74, comments: 29, liked: false },
];

const MOCK_MESSAGES = {
  u1: [{ from: 'them', text: 'Hi! Thanks for your kind words on my post 😊', time: '10:30 AM' }, { from: 'me', text: 'Of course! Your karela juice tip was amazing. Can you share the recipe?', time: '10:31 AM' }, { from: 'them', text: 'Sure! 2 karela, squeeze juice, add pinch of turmeric and ginger. Drink empty stomach 🌿', time: '10:33 AM' }],
  u3: [{ from: 'them', text: 'Hello! Saw you joined the BP community.', time: 'Yesterday' }, { from: 'me', text: 'Yes! My BP has been high lately. Any tips?', time: 'Yesterday' }, { from: 'them', text: 'Cut down salt and try deep breathing 10 mins every morning. It really helps!', time: 'Yesterday' }],
  community: [{ from: 'u1', text: 'Good morning Swastya Community! ☀️', time: '08:00 AM' }, { from: 'u5', text: 'Namaste! Doing my walking exercise now. 🚶', time: '08:15 AM' }, { from: 'u3', text: 'Stay hydrated everyone! 💧', time: '09:45 AM' }],
};

/* ─── Component ────────────────────────────────────────── */
export default function Connect() {
  const [tab, setTab] = useState('feed');       // 'feed' | 'friends' | 'messages'
  const [activeCondition, setActiveCondition] = useState('all');
  const [posts, setPosts] = useState(POSTS_INIT);
  const [friends, setFriends] = useState(['u1', 'u3']); // pre-seeded
  const [pendingReqs, setPending] = useState(['u5']);
  const [selectedUser, setSelectedUser] = useState(null);     // user profile panel
  const [chatUser, setChatUser] = useState(null);         // chat drawer
  const [callUser, setCallUser] = useState(null);         // video call overlay
  const [chatMsg, setChatMsg] = useState('');
  const [chatLogs, setChatLogs] = useState(MOCK_MESSAGES);
  const [showCompose, setShowCompose] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', condition: 'diabetes' });
  const [friendSearch, setFriendSearch] = useState('');

  // --- Video Call State ---
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  /* helpers */
  const conditionLabel = id => CONDITIONS.find(c => c.id === id)?.label || id;
  const conditionIcon = id => CONDITIONS.find(c => c.id === id)?.icon || '🏥';
  const isFriend = id => friends.includes(id);
  const isPending = id => pendingReqs.includes(id);

  const addFriend = (id) => {
    if (isPending(id)) return;
    if (!isFriend(id)) setPending(p => [...p, id]);
  };
  const acceptFriend = (id) => {
    setPending(p => p.filter(x => x !== id));
    setFriends(f => [...f, id]);
  };
  const removeFriend = (id) => setFriends(f => f.filter(x => x !== id));

  const toggleLike = id => setPosts(prev =>
    prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)
  );

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    const log = { from: 'me', text: chatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatLogs(prev => ({ ...prev, [chatUser.id]: [...(prev[chatUser.id] || []), log] }));
    setChatMsg('');
  };

  const startVideoCall = async (user) => {
    setCallUser(user);
    if (chatUser) setChatUser(null);
    if (selectedUser) setSelectedUser(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Please allow camera and microphone permissions to start a video call.");
    }
  };

  const endVideoCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setCallUser(null);
  };

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callUser]);

  const submitPost = () => {
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    setPosts(prev => [{ id: Date.now(), userId: 'me', condition: newPost.condition, time: 'Just now', title: newPost.title, body: newPost.body, likes: 0, comments: 0, liked: false }, ...prev]);
    setNewPost({ title: '', body: '', condition: 'diabetes' });
    setShowCompose(false);
  };

  const filtered = activeCondition === 'all' ? posts : posts.filter(p => p.condition === activeCondition);
  const friendList = friends.map(id => USERS[id]).filter(Boolean);
  const filteredFriends = friendSearch.trim()
    ? friendList.filter(u =>
      u.name.toLowerCase().includes(friendSearch.toLowerCase()) ||
      u.city.toLowerCase().includes(friendSearch.toLowerCase()) ||
      u.condition.toLowerCase().includes(friendSearch.toLowerCase())
    )
    : friendList;

  /* ─── Render ─────────────────────────────────────────── */
  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Connect</h1>
          <p className={styles.subtitle}>Share · Support · Heal Together</p>
        </div>
        <button className={styles.composeBtn} onClick={() => setShowCompose(true)}>+ Share</button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'feed' ? styles.tabActive : ''}`} onClick={() => setTab('feed')}>Community Feed</button>
        <button className={`${styles.tab} ${tab === 'friends' ? styles.tabActive : ''}`} onClick={() => setTab('friends')}>
          Friends {friends.length > 0 && <span className={styles.badge}>{friends.length}</span>}
        </button>
        <button className={`${styles.tab} ${tab === 'messages' ? styles.tabActive : ''}`} onClick={() => setTab('messages')}>
          Messages
        </button>
      </div>

      {/* ── FEED TAB ── */}
      {tab === 'feed' && (
        <>
          {/* Condition chips */}
          <div className={styles.chipsRow}>
            {CONDITIONS.map(c => (
              <button key={c.id} className={`${styles.chip} ${activeCondition === c.id ? styles.chipActive : ''}`} onClick={() => setActiveCondition(c.id)}>
                <span>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>

          <div className={styles.feed}>
            {filtered.map(post => {
              const user = USERS[post.userId];
              const u = user || { name: 'You', avatar: '🧑‍⚕️', id: 'me' };
              return (
                <div key={post.id} className={styles.postCard}>
                  {/* Author row — clickable */}
                  <div className={styles.postHeader} onClick={() => user && setSelectedUser(user)} style={{ cursor: user ? 'pointer' : 'default' }}>
                    <div className={styles.avatarWrap}><span className={styles.avatar}>{u.avatar}</span></div>
                    <div className={styles.postMeta}>
                      <span className={styles.authorName}>{u.name}</span>
                      <span className={styles.postTime}>{post.time}</span>
                    </div>
                    <span className={styles.conditionBadge}>{conditionIcon(post.condition)} {conditionLabel(post.condition)}</span>
                  </div>

                  <div className={styles.postTitle}>{post.title}</div>
                  <p className={styles.postBody}>{post.body}</p>

                  <div className={styles.postActions}>
                    <button className={`${styles.actionBtn} ${post.liked ? styles.actionBtnLiked : ''}`} onClick={() => toggleLike(post.id)}>
                      {post.liked ? '❤️' : '🤍'} {post.likes}
                    </button>
                    <button className={styles.actionBtn}>💬 {post.comments}</button>
                    {user && (
                      <button className={styles.actionBtnGreen} onClick={() => setSelectedUser(user)}>
                        👤 View Profile
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── MESSAGES TAB ── */}
      {tab === 'messages' && (
        <div className={styles.messagesHub}>
          {/* Group Chat at top */}
          <div className={styles.messageThread} onClick={() => setChatUser({ id: 'community', name: 'Global Health Hub', avatar: '🏘️', isGroup: true })}>
            <div className={styles.threadAvatar} style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>🏘️</div>
            <div className={styles.threadInfo}>
              <div className={styles.threadHeader}>
                <span className={styles.threadName}>Global Health Hub</span>
                <span className={styles.threadTime}>Active</span>
              </div>
              <div className={styles.threadLastMsg}>Active community discussion channel</div>
            </div>
            <div className={styles.groupBadge}>GROUP</div>
          </div>

          <div className={styles.sectionLabel} style={{ marginTop: '16px' }}>Direct Messages</div>

          {Object.keys(chatLogs).filter(id => id !== 'community').map(id => {
            const user = USERS[id] || { name: 'Health Partner', avatar: '🧑‍⚕️' };
            const last = chatLogs[id][chatLogs[id].length - 1];
            return (
              <div key={id} className={styles.messageThread} onClick={() => setChatUser({ ...user, id })}>
                <div className={styles.avatarWrap}><span className={styles.avatar}>{user.avatar}</span></div>
                <div className={styles.threadInfo}>
                  <div className={styles.threadHeader}>
                    <span className={styles.threadName}>{user.name}</span>
                    <span className={styles.threadTime}>{last?.time}</span>
                  </div>
                  <div className={styles.threadLastMsg}>{last?.from === 'me' ? 'You: ' : ''}{last?.text}</div>
                </div>
              </div>
            );
          })}

          {Object.keys(chatLogs).filter(id => id !== 'community').length === 0 && (
            <div className={styles.empty}><span style={{ fontSize: '2rem' }}>💬</span><p>No messages yet. Start a conversation!</p></div>
          )}
        </div>
      )}

      {/* ── FRIENDS TAB ── */}
      {tab === 'friends' && (
        <div className={styles.friendsList}>
          {/* Search Bar */}
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="Search by name, city or condition…"
              value={friendSearch}
              onChange={e => setFriendSearch(e.target.value)}
            />
            {friendSearch && (
              <button className={styles.searchClear} onClick={() => setFriendSearch('')}>✕</button>
            )}
          </div>
          {/* Pending Requests */}
          {pendingReqs.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Pending Sent</div>
              {pendingReqs.map(id => {
                const u = USERS[id];
                if (!u) return null;
                return (
                  <div key={id} className={styles.friendCard}>
                    <div className={styles.friendCardLeft} onClick={() => setSelectedUser(u)}>
                      <div className={styles.avatarWrap}><span className={styles.avatar}>{u.avatar}</span></div>
                      <div>
                        <div className={styles.friendName}>{u.name}</div>
                        <div className={styles.friendMeta}>{conditionIcon(u.condition)} {conditionLabel(u.condition)} · {u.city}</div>
                      </div>
                    </div>
                    <span className={styles.pendingBadge}>Pending</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Friends */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              {friendSearch ? `Results (${filteredFriends.length})` : `Friends (${friends.length})`}
            </div>
            {friendList.length === 0 && (
              <div className={styles.empty}><span style={{ fontSize: '2.5rem' }}>🤝</span><p>No friends yet. Browse the feed and connect!</p></div>
            )}
            {friendList.length > 0 && filteredFriends.length === 0 && (
              <div className={styles.empty}><span style={{ fontSize: '2rem' }}>🔍</span><p>No friends match your search.</p></div>
            )}
            {filteredFriends.map(u => (
              <div key={u.id} className={styles.friendCard}>
                <div className={styles.friendCardLeft} onClick={() => setSelectedUser(u)}>
                  <div className={styles.avatarWrap}><span className={styles.avatar}>{u.avatar}</span></div>
                  <div>
                    <div className={styles.friendNameRow}>
                      <div className={styles.friendName}>{u.name}</div>
                      {u.streak > 0 && <span className={styles.friendStreakBadge}>🔥 {u.streak}</span>}
                    </div>
                    <div className={styles.friendMeta}>{conditionIcon(u.condition)} {conditionLabel(u.condition)} · {u.city}</div>
                  </div>
                </div>
                <div className={styles.friendActions}>
                  <button className={styles.iconBtn} title="Message" onClick={() => { setChatUser(u); }}>💬</button>
                  <button className={styles.iconBtnGreen} title="Video Call" onClick={() => startVideoCall(u)}>📹</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          USER PROFILE PANEL (slide-up)
      ════════════════════════════════════════════ */}
      {selectedUser && (
        <div className={styles.overlay} onClick={() => setSelectedUser(null)}>
          <div className={styles.panel} onClick={e => e.stopPropagation()}>
            <button className={styles.panelClose} onClick={() => setSelectedUser(null)}>✕</button>

            {/* Avatar + Name */}
            <div className={styles.profileTop}>
              <div className={styles.profileAvatar}>{selectedUser.avatar}</div>
              <div className={styles.profileNameRowCentered}>
                <div className={styles.profileName}>{selectedUser.name}</div>
                {selectedUser.streak > 0 && <span className={styles.profileStreakBadge}>🔥 {selectedUser.streak} Day Streak</span>}
              </div>
              <div className={styles.profileSub}>{selectedUser.age} yrs · {selectedUser.city}</div>
              <span className={styles.conditionBadge} style={{ marginTop: '6px' }}>
                {conditionIcon(selectedUser.condition)} {conditionLabel(selectedUser.condition)}
              </span>
            </div>

            {/* Bio */}
            <p className={styles.profileBio}>{selectedUser.bio}</p>

            {/* Stats */}
            <div className={styles.profileStats}>
              <div className={styles.stat}><span>{selectedUser.posts}</span>Posts</div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><span>{selectedUser.friends}</span>Friends</div>
            </div>

            {/* Action Buttons */}
            <div className={styles.profileBtns}>
              <button className={styles.btnPrimary} onClick={() => { setChatUser(selectedUser); setSelectedUser(null); }}>
                💬 Message
              </button>
              {isFriend(selectedUser.id) ? (
                <>
                  <button className={styles.btnVideo} onClick={() => startVideoCall(selectedUser)}>
                    📹 Video Call
                  </button>
                  <button className={styles.btnOutline} onClick={() => removeFriend(selectedUser.id)}>
                    Remove Friend
                  </button>
                </>
              ) : isPending(selectedUser.id) ? (
                <button className={styles.btnOutline} disabled>⏳ Request Sent</button>
              ) : (
                <button className={styles.btnOutline} onClick={() => { addFriend(selectedUser.id); }}>
                  🤝 Add Friend
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          CHAT DRAWER
      ════════════════════════════════════════════ */}
      {chatUser && (
        <div className={styles.chatOverlay}>
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <button className={styles.chatBack} onClick={() => setChatUser(null)}>←</button>
            <div className={styles.chatAvatar}>{chatUser.avatar}</div>
            <div>
              <div className={styles.chatName}>{chatUser.name}</div>
              <div className={styles.chatStatus}>
                {chatUser.isGroup ? '12 Members Active' : '🟢 Online'}
              </div>
            </div>
            <button className={styles.chatCallBtn} onClick={() => startVideoCall(chatUser)}>📹</button>
          </div>

          {/* Messages */}
          <div className={styles.chatMessages}>
            {(chatLogs[chatUser.id] || []).map((msg, i) => (
              <div key={i} className={`${styles.msgBubble} ${msg.from === 'me' ? styles.msgMe : styles.msgThem}`}>
                {msg.text}
                <span className={styles.msgTime}>{msg.time}</span>
              </div>
            ))}
            {(!chatLogs[chatUser.id] || chatLogs[chatUser.id].length === 0) && (
              <div className={styles.chatEmpty}>Say hi to {chatUser.name}! 👋</div>
            )}
          </div>

          {/* Input */}
          <div className={styles.chatInput}>
            <input
              placeholder={`Message ${chatUser.name}…`}
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className={styles.chatInputField}
            />
            <button className={styles.sendBtn} onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          VIDEO CALL OVERLAY
      ════════════════════════════════════════════ */}
      {callUser && (
        <div className={styles.callOverlay}>
          <div className={styles.callBg}>
            <div className={styles.callRemoteVideo}>
              <span className={styles.callRemoteAvatar}>{callUser.avatar}</span>
              <div className={styles.callRemoteName}>{callUser.name}</div>
              <div className={styles.callStatusText}>Swastya Health Connect · Calling…</div>
            </div>

            {/* Self preview */}
            <div className={styles.callSelfPreview} style={{ background: '#000', overflow: 'hidden', padding: 0 }}>
              {localStream ? (
                <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.6rem', color: '#fff', padding: '10px' }}>📹 Off</span>
              )}
            </div>

            {/* Controls */}
            <div className={styles.callControls}>
              <button className={styles.callCtrlBtn} title="Mute">🎤</button>
              <button className={styles.callCtrlBtn} title="Camera">📷</button>
              <button className={styles.callCtrlBtn} title="Speaker">🔊</button>
              <button className={styles.callEndBtn} title="End Call" onClick={endVideoCall}>📵</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          COMPOSE POST MODAL
      ════════════════════════════════════════════ */}
      {showCompose && (
        <div className={styles.overlay} onClick={() => setShowCompose(false)}>
          <div className={styles.panel} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Share Your Story</span>
              <button className={styles.panelClose} onClick={() => setShowCompose(false)}>✕</button>
            </div>
            <div className={styles.field}>
              <label>Condition</label>
              <select className={styles.selectInput} value={newPost.condition} onChange={e => setNewPost(p => ({ ...p, condition: e.target.value }))}>
                {CONDITIONS.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Title</label>
              <input className={styles.inputField} placeholder="e.g. My journey with Diabetes…" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label>Your Story</label>
              <textarea className={styles.textareaField} rows={5} placeholder="Share your experience, tips, or questions…" value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} />
            </div>
            <button className={styles.btnPrimary} style={{ width: '100%', marginTop: '6px' }} onClick={submitPost}>Post to Community</button>
          </div>
        </div>
      )}
    </div>
  );
}
