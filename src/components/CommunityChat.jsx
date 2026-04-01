import { useState, useEffect, useRef } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import './ProfileFeatures.css';

export default function CommunityChat({ disease, onBack }) {
    const { user } = useAuth();
    const username = user?.name || "Anonymous";

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [uploading, setUploading] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();

        const channel = supabase
            .channel("realtime-messages")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    setMessages((prev) => {
                        const exists = prev.find((m) => m.id === payload.new.id);
                        if (exists) return prev;
                        if (payload.new.disease === disease) return [...prev, payload.new];
                        return prev;
                    });
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [disease]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("disease", disease)
            .order("created_at", { ascending: true });
        if (!error) setMessages(data || []);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        await uploadAndSendMedia(file);
    };

    const uploadAndSendMedia = async (file, isAudio = false) => {
        setUploading(true);
        try {
            const fileExt = file.name ? file.name.split('.').pop() : 'webm';
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${disease}/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('chat-media').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('chat-media').getPublicUrl(filePath);
            const mediaUrl = data.publicUrl;

            let mediaType = 'file';
            if (isAudio || (file.type && file.type.startsWith('audio/'))) mediaType = 'audio';
            else if (file.type && file.type.startsWith('image/')) mediaType = 'image';

            const messagePayload = JSON.stringify({ text: "", username, user_id: user?.id || null, media_url: mediaUrl, media_type: mediaType });
            await supabase.from("messages").insert([{ disease, message: messagePayload }]);
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];
                mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    stream.getTracks().forEach(track => track.stop());
                    uploadAndSendMedia(audioBlob, true);
                };
                mediaRecorder.start();
                setIsRecording(true);
            } catch (err) { }
        }
    };

    const sendMessage = async () => {
        if (!text.trim()) return;
        const currentText = text;
        setText("");
        const messagePayload = JSON.stringify({ text: currentText, username, user_id: user?.id || null });
        const { error } = await supabase.from("messages").insert([{ disease, message: messagePayload }]);
        if (error) setText(currentText);
    };

    const formatTime = (ts) => {
        if (!ts) return "";
        return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="feature-container fade-up">
            <button className="btn btn-outline" onClick={onBack} style={{ marginBottom: 15, padding: '8px 16px', minHeight: '40px' }}>
                ← Back
            </button>
            <div className="chat-container">
                <div className="chat-header">
                    <span style={{ fontSize: "1.2rem" }}>💬</span>
                    <h3 style={{color: 'white', margin: 0, fontSize: '1.2rem'}}>{disease} Community</h3>
                </div>
                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="chat-empty">No messages yet. Start the conversation!</div>
                    ) : (
                        messages.map((m) => {
                            let mText = m.message, mUser = "Anonymous", mUserId = null, mMediaUrl = null, mMediaType = null;
                            try {
                                const parsed = JSON.parse(m.message);
                                if (parsed && (parsed.text !== undefined || parsed.media_url)) {
                                    mText = parsed.text; mUser = parsed.username || "Anonymous"; mUserId = parsed.user_id; mMediaUrl = parsed.media_url; mMediaType = parsed.media_type;
                                }
                            } catch (e) { mText = m.message; }
                            const isSelf = mUserId === user?.id && mUserId !== null;
                            return (
                                <div key={m.id} className={`chat-bubble ${isSelf ? 'self' : 'other'}`}>
                                    <div className="username">{mUser}</div>
                                    <div className="message-text">
                                        {mText && <div style={{ marginBottom: mMediaUrl ? 8 : 0 }}>{mText}</div>}
                                        {mMediaUrl && mMediaType === 'image' && <img src={mMediaUrl} alt="attachment" style={{ maxWidth: "100%", borderRadius: 8 }} />}
                                        {mMediaUrl && mMediaType === 'audio' && <audio controls src={mMediaUrl} style={{ width: "100%", height: 35 }} />}
                                    </div>
                                    <div className="timestamp">{formatTime(m.created_at)}</div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-bar">
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*,audio/*,.pdf" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ padding: '10px', minWidth: '40px', background: '#f4f3ec', color: '#000' }}>📎</button>
                    <button type="button" onClick={toggleRecording} disabled={uploading} style={{ padding: '10px', minWidth: '40px', background: isRecording ? '#ff4444' : '#f4f3ec', color: isRecording ? '#fff' : '#000' }}>{isRecording ? '⏹' : '🎤'}</button>
                    <input value={uploading ? "Uploading..." : text} disabled={uploading} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()} placeholder="Type message..." style={{ flex: 1 }} />
                    <button onClick={sendMessage} disabled={uploading} style={{ padding: '10px 15px', minWidth: '60px' }}>Send</button>
                </div>
            </div>
        </div>
    );
}
