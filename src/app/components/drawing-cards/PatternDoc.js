export default function PatternDoc({ topic, age, items, data }) {
  const fallbackParts = [
    { name: '왕관 띠', emoji: '👑' }
  ];

  const title = data?.title || `✂️ ${topic} 만들기 입체 도안`;
  const directions = data?.directions || '1. 실선을 따라 오려줍니다. 2. 빨간 점선은 안쪽으로 접어 풀칠 🧴 하거나 연결해 줍니다.';
  const partsList = data?.parts || items || fallbackParts;

  return (
    <div className="bananacard-container printable-book-page" style={{ padding: '30px' }}>
      <div className="bananacard-header">
        <span className="bananacard-badge">🎨 nano-banana 2 (pro) DRAWING CARD</span>
        <span className="bananacard-model-tag">Model: nano-banana 2 (pro) (Blueprint HD)</span>
      </div>

      <div className="pattern-blueprint" style={{ width: '100%' }}>
        <div className="pattern-header">{title} (만 {age}세용)</div>
        <div className="pattern-directions">
          <strong>조립 방법:</strong> {directions}
        </div>
        
        <div className="blueprint-canvas">
          <div className="drawing-sketch-frame" style={{ padding: '10px', background: '#FAF8F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg className="blueprint-svg" viewBox="0 0 200 120" width="100%" height="220">
              {/* 외곽 실선 오리기선 */}
              <rect x="10" y="40" width="180" height="40" fill="none" stroke="#2D3748" strokeWidth="2"/>
              {/* 접기 점선 */}
              <line x1="45" y1="40" x2="45" y2="80" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="155" y1="40" x2="155" y2="80" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4"/>
              
              {/* 풀칠 날개 */}
              <polygon points="10,40 0,45 0,75 10,80" fill="#F3F4F6" stroke="#2D3748" strokeWidth="1" strokeDasharray="2 2"/>
              <text x="1" y="64" fontSize="6" fill="#6B7280">🧴 풀칠</text>
              
              {/* 꾸미기 요소 */}
              <circle cx="100" cy="30" r="15" fill="none" stroke="#2D3748" strokeWidth="1.5"/>
              <text x="94" y="34" fontSize="12">{partsList[0]?.emoji || '🌸'}</text>
              
              {/* 오리기 캡션 */}
              <text x="75" y="70" fontSize="9" fontWeight="700" fill="#2D3748">{partsList[0]?.name || `${topic} 띠`}</text>
              
              {/* 가위 아이콘 장식 */}
              <text x="182" y="36" fontSize="10">✂️</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="bananacard-footer">
        <span>Model Version: nano-banana-v2-pro-blueprint</span>
        <span>Resolution: 2048x2048 | Steps: 50</span>
      </div>
      <div className="bananacard-watermark">banana2</div>
    </div>
  );
}
