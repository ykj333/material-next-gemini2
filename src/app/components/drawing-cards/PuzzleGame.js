'use client';

import { useState, useEffect } from 'react';

export default function PuzzleGame({ data, items, age }) {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);

  const fallbackItems = [
    { kor: '해', emoji: '☀️' },
    { kor: '구름', emoji: '☁️' },
    { kor: '우산', emoji: '☂️' },
    { kor: '물방울', emoji: '💧' }
  ];

  const cardsList = data?.cards || items || fallbackItems;

  // Initialize and shuffle
  useEffect(() => {
    const gameItems = [...cardsList, ...cardsList].map((item, index) => ({
      ...item,
      uniqueId: index,
      matched: false,
      flipped: false
    }));

    // Fisher-Yates shuffle
    for (let i = gameItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameItems[i], gameItems[j]] = [gameItems[j], gameItems[i]];
    }

    setCards(gameItems);
    setSelectedCards([]);
    setScore(0);
    setWon(false);
  }, [cardsList]);

  const handleCardClick = (card, idx) => {
    if (card.flipped || card.matched || selectedCards.length >= 2) return;

    // Flip card
    const updatedCards = [...cards];
    updatedCards[idx].flipped = true;
    setCards(updatedCards);

    const newSelection = [...selectedCards, { card, idx }];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      const first = newSelection[0];
      const second = newSelection[1];

      if (first.card.kor === second.card.kor) {
        // Matched
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first.idx].matched = true;
          matchedCards[second.idx].matched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          const newScore = score + 1;
          setScore(newScore);

          if (newScore === 4) {
            setWon(true);
          }
        }, 300);
      } else {
        // Not Matched
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first.idx].flipped = false;
          resetCards[second.idx].flipped = false;
          setCards(resetCards);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="bananacard-container" style={{ padding: '24px' }}>
      <div className="bananacard-header">
        <span className="bananacard-badge">🎨 nano-banana 2 (pro) DRAWING CARD</span>
        <span className="bananacard-model-tag">Model: nano-banana 2 (pro) (Game Pack)</span>
      </div>

      <div className="puzzle-game-mockup" style={{ border: 'none', padding: 0, width: '100%' }}>
        <div className="game-header">
          <span className="game-badge">만 {age}세 🧠 매칭 두뇌 게임</span>
          <div className="game-stats">맞춘 개수: <strong id="game-score">{score} / 4 쌍</strong></div>
        </div>
        
        <div className="puzzle-card-grid">
          {cards.map((card, idx) => (
            <div 
              key={card.uniqueId} 
              className={`puzzle-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
              onClick={() => handleCardClick(card, idx)}
            >
              <div className="puzzle-card-front">❓</div>
              <div className="puzzle-card-back">{card.emoji}</div>
            </div>
          ))}
        </div>
        
        <div className="game-message" style={{ color: won ? '#10B981' : 'var(--text-secondary)', fontSize: won ? '1.1rem' : '0.85rem', fontWeight: won ? '700' : 'normal', textAlign: 'center', marginTop: '16px' }}>
          {won ? '🎉 모두 맞췄어요! 🏆 대단해요!' : '카드 뒤집기 게임을 통해 단어를 직관적으로 관찰해 보세요!'}
        </div>
      </div>

      <div className="bananacard-footer">
        <span>Game Seed: 94029 | Cards: 8</span>
        <span>Drawing: nano-banana-v2-pro-game</span>
      </div>
      <div className="bananacard-watermark">banana2</div>
    </div>
  );
}
