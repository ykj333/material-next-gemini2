export default function WorksheetDoc({ topic, age, items, data }) {
  const fallbackCards = [
    { kor: '사과', eng: 'Apple', emoji: '🍎' },
    { kor: '나비', eng: 'Butterfly', emoji: '🦋' },
    { kor: '햇님', eng: 'Sun', emoji: '☀️' },
    { kor: '나무', eng: 'Tree', emoji: '🌳' }
  ];

  const title = data?.title || `🎨 ${topic} 창의 배움 활동지`;
  const cardsList = data?.cards || items || fallbackCards;

  const isFlower = data?.isFlower !== undefined 
    ? data.isFlower 
    : (topic.includes('꽃') || topic.includes('봄') || topic.includes('식물') || topic.includes('flower') || topic.includes('spring'));
  const isAnimal = data?.isAnimal !== undefined
    ? data.isAnimal
    : (topic.includes('동물') || topic.includes('곤충') || topic.includes('바다') || topic.includes('animal') || topic.includes('bug') || topic.includes('fish'));

  return (
    <div className="bananacard-container printable-book-page" style={{ padding: '30px' }}>
      <div className="bananacard-header">
        <span className="bananacard-badge">🎨 nano-banana 2 (pro) DRAWING CARD</span>
        <span className="bananacard-model-tag">Model: nano-banana 2 (pro) (Line-Art HD)</span>
      </div>

      <div className="worksheet-border">
        <div className="worksheet-header">
          <h2>{title}</h2>
          <div className="worksheet-meta-grid">
            <span><strong>대상 연령:</strong> 만 {age}세</span>
            <span><strong>주제:</strong> {topic}</span>
            <span><strong>이름:</strong> ____________</span>
          </div>
        </div>
        
        <div className="worksheet-section">
          <div className="section-title">✏️ [활동 1] 단어를 소리 내어 읽고 선을 따라 예쁘게 따라 써 보세요.</div>
          <div className="tracing-word-container">
            {cardsList.map((item, idx) => (
              <div key={idx} className="tracing-card">
                <div className="tracing-emoji">{item.emoji}</div>
                <div className="tracing-text-box">
                  <div className="tracing-guide-line">{item.kor}</div>
                  <div className="tracing-dotted-line">{item.kor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="worksheet-section">
          <div className="section-title">🖍️ [활동 2] 아래 그림 속 "{topic}"을 내 맘대로 멋지게 색칠해 보세요!</div>
          <div className="coloring-canvas-mock">
            <div className="drawing-sketch-frame" style={{ padding: '20px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg className="coloring-svg-mock" viewBox="0 0 100 100" width="120" height="120">
                {isFlower ? (
                  <>
                    <circle cx="50" cy="50" r="14" fill="none" stroke="#2D3748" strokeWidth="2"/>
                    <circle cx="50" cy="22" r="12" fill="none" stroke="#2D3748" strokeWidth="2"/>
                    <circle cx="50" cy="78" r="12" fill="none" stroke="#2D3748" strokeWidth="2"/>
                    <circle cx="22" cy="50" r="12" fill="none" stroke="#2D3748" strokeWidth="2"/>
                    <circle cx="78" cy="50" r="12" fill="none" stroke="#2D3748" strokeWidth="2"/>
                    <path d="M 50 64 L 50 96" stroke="#2D3748" strokeWidth="3" fill="none"/>
                    <path d="M 50 80 Q 30 75 35 65" stroke="#2D3748" strokeWidth="2" fill="none"/>
                  </>
                ) : isAnimal ? (
                  <>
                    <circle cx="50" cy="52" r="26" fill="none" stroke="#2D3748" strokeWidth="2"/>
                    <circle cx="30" cy="24" r="10" fill="none" stroke="#2D3748" strokeWidth="2"/>
                    <circle cx="70" cy="24" r="10" fill="none" stroke="#2D3748" strokeWidth="2"/>
                    <circle cx="42" cy="46" r="3" fill="#2D3748"/>
                    <circle cx="58" cy="46" r="3" fill="#2D3748"/>
                    <path d="M 50 56 Q 47 62 50 64 Q 53 62 50 56" stroke="#2D3748" strokeWidth="2" fill="none"/>
                    <path d="M 44 64 Q 50 68 56 64" stroke="#2D3748" strokeWidth="2" fill="none"/>
                  </>
                ) : (
                  <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="none" stroke="#2D3748" strokeWidth="2"/>
                )}
              </svg>
            </div>
            
            <div className="coloring-palette-mock">
              <span style={{ backgroundColor: '#FFB7B2' }}></span>
              <span style={{ backgroundColor: '#FFDAC1' }}></span>
              <span style={{ backgroundColor: '#FFF5E6' }}></span>
              <span style={{ backgroundColor: '#B5E2FA' }}></span>
              <span style={{ backgroundColor: '#E2C9FF' }}></span>
              <span style={{ backgroundColor: '#A8E6CF' }}></span>
            </div>
          </div>
        </div>
      </div>

      <div className="bananacard-footer">
        <span>Model Version: nano-banana-v2-pro-lineart</span>
        <span>Resolution: 2048x2048 | CFG: 8.5</span>
      </div>
      <div className="bananacard-watermark">banana2</div>
    </div>
  );
}
