'use client';

import { useState } from 'react';

export default function Flashcard3D({ data, items, age }) {
  const [activeCards, setActiveCards] = useState({});

  const fallbackCards = [
    { kor: '사과', eng: 'Apple', emoji: '🍎', desc: '빨갛고 맛있는 가을에 열리는 과일이에요.' },
    { kor: '나비', eng: 'Butterfly', emoji: '🦋', desc: '알록달록 예쁜 날개로 날아다니는 곤충이에요.' },
    { kor: '해바라기', eng: 'Sunflower', emoji: '🌻', desc: '해가 쨍쨍 비추면 해를 바라보는 노란 꽃이에요.' },
    { kor: '고양이', eng: 'Cat', emoji: '🐱', desc: '야옹 소리를 내며 꼬리를 살랑살랑 흔드는 다정한 동물이에요.' }
  ];

  const cardsList = data?.cards || items || fallbackCards;

  const toggleCard = (idx) => {
    setActiveCards(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="flashcards-layout-header">🃏 단어 플래시카드 (마우스 커서를 올리거나 탭하면 설명이 보여요)</div>
      <div className="flashcards-grid printable-card-grid">
        {cardsList.map((item, idx) => (
          <div key={idx} className="bananacard-container" style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '360px' }}>
            <div className="bananacard-header" style={{ marginBottom: '10px', paddingBottom: '6px' }}>
              <span className="bananacard-badge" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>🎨 nano-banana 2 (pro)</span>
              <span className="bananacard-model-tag" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>High-Fi Card</span>
            </div>

            <div 
              className={`flashcard-3d ${activeCards[idx] ? 'active' : ''}`}
              onClick={() => toggleCard(idx)}
              style={{ flex: 1, position: 'relative', height: '240px' }}
            >
              <div className="flashcard-inner">
                {/* 앞면 */}
                <div className="flashcard-front">
                  <div className="drawing-sketch-frame" style={{ width: '100%', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', marginBottom: '8px', border: '3px solid white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
                    <span className="card-art" style={{ fontSize: '3.5rem', margin: 0, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}>{item.emoji}</span>
                  </div>
                  <div className="card-title-kor" style={{ fontSize: '1.35rem', fontWeight: 'bold' }}>{item.kor}</div>
                  <div className="card-title-eng" style={{ fontSize: '0.95rem' }}>{item.eng}</div>
                </div>

                {/* 뒷면 */}
                <div className="flashcard-back">
                  <div className="card-back-icon">💡</div>
                  <p className="card-description" style={{ fontSize: '0.9rem', marginBottom: '8px', lineHeight: 1.6 }}>{item.desc}</p>
                  <div className="card-age-tag">만 {age}세 발달 맞춤</div>
                </div>
              </div>
            </div>

            <div className="bananacard-footer" style={{ marginTop: '10px', paddingTop: '6px', fontSize: '0.65rem' }}>
              <span>Resolution: 2048x2048 | CFG: 8.5</span>
              <span>Model: banana-2-pro-sketch</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
