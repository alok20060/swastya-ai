import { useState } from "react";
import './ProfileFeatures.css';

const TIPS = [
    {
        category: "Morning Routine",
        icon: "🌅",
        title: "Wake Before Sunrise",
        desc: "Waking during Brahma Muhurta (about 1.5 hours before sunrise) aligns your body with nature's rhythm, boosting immunity and mental clarity.",
        tag: "Dinacharya",
    },
    {
        category: "Morning Routine",
        icon: "💧",
        title: "Drink Warm Water",
        desc: "Start your day with a glass of warm water with lemon. It ignites your digestive fire (Agni) and helps flush toxins naturally.",
        tag: "Detox",
    },
    {
        category: "Diet",
        icon: "🍵",
        title: "Golden Turmeric Milk",
        desc: "Warm milk with turmeric, black pepper, and a pinch of saffron before bed reduces inflammation and promotes deep, restful sleep.",
        tag: "Anti-inflammatory",
    },
    {
        category: "Herbs",
        icon: "🌿",
        title: "Ashwagandha for Stress",
        desc: "This adaptogenic herb reduces cortisol, fights anxiety, and improves sleep quality. Take with warm milk at night.",
        tag: "Adaptogen",
    },
    {
        category: "Lifestyle",
        icon: "🧘",
        title: "Pranayama Breathing",
        desc: "Practice Anulom Vilom (alternate nostril breathing) for 10 minutes daily. It balances the nervous system and reduces blood pressure.",
        tag: "Breathing",
    },
];

const CATEGORIES = ["All", "Morning Routine", "Diet", "Herbs", "Lifestyle", "Seasonal"];

export default function AyurvedaTips() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered =
        activeCategory === "All"
            ? TIPS
            : TIPS.filter((t) => t.category === activeCategory);

    return (
        <div className="feature-container fade-up">
            <div className="ayurveda-header">
                <div className="icon">🌿</div>
                <h3>Ayurveda Wellness Tips</h3>
                <p>Ancient wisdom for modern health.</p>
            </div>

            <div className="tip-category-tabs">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        className={`tip-tab ${activeCategory === cat ? "active" : ""}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="card-grid">
                {filtered.map((tip, i) => (
                    <div key={i} className="tip-card">
                        <span className="tip-icon">{tip.icon}</span>
                        <h4>{tip.title}</h4>
                        <p>{tip.desc}</p>
                        <span className="tip-tag">{tip.tag}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
