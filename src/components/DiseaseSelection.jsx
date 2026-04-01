import './ProfileFeatures.css';

export default function DiseaseSelection({ onSelectDisease }) {
    const diseases = [
        { name: "Diabetes", icon: "🩸", desc: "Connect with others managing blood sugar levels" },
        { name: "Hypertension", icon: "❤️", desc: "Share tips for healthy blood pressure management" },
        { name: "Heart Disease", icon: "🫀", desc: "Support community for heart health journeys" },
        { name: "Arthritis", icon: "🦴", desc: "Discuss joint care and pain management" },
        { name: "Asthma", icon: "🫁", desc: "Breathing exercises and respiratory wellness" },
        { name: "Thyroid", icon: "🦋", desc: "Thyroid health discussions and lifestyle tips" },
    ];

    return (
        <div className="feature-container fade-up">
            <div className="disease-header">
                <h3>🏥 Health Communities</h3>
                <p>Join a supportive community. Share experiences and ask questions.</p>
            </div>

            <div className="card-grid">
                {diseases.map((d) => (
                    <button
                        key={d.name}
                        className="disease-card"
                        onClick={() => onSelectDisease(d.name)}
                    >
                        <span className="icon">{d.icon}</span>
                        <div className="info">
                            <h4>{d.name}</h4>
                            <p>{d.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
