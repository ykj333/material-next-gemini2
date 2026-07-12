'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';

export default function StorybookCard({ topic, age, data }) {
  const [currentPage, setCurrentPage] = useState(0);

  const fallbackPages = [
    { text: `옛날 옛적에, 귀여운 숲속 나라에 "${topic}" 친구가 살고 있었어요.`, art: '🏡', prompt: 'A cozy forest village house, cute watercolor style' },
    { text: `어느 봄날, "${topic}" 친구는 신비한 숲속으로 모험을 떠나기로 했어요.`, art: '🌲', prompt: 'Distant mysterious forest path, soft warm pastel sketch' },
    { text: `모험길에 다정한 꽃 요정을 만났어요! "안녕? 반가워!" 요정이 윙크했어요.`, art: '🧚', prompt: 'A cute flower fairy smiling, watercolor outline drawing' },
    { text: `꽃 요정은 비밀을 알려주었어요. "사랑 가득한 눈으로 세상을 바라보렴!"`, art: '💖', prompt: 'Hearts flying out of a magic wand, bright pastel' },
    { text: `길을 걷다 졸졸 흐르는 맑은 숲속 시냇물을 발견해 발을 담가 보았지요.`, art: '🌊', prompt: 'Pure dynamic stream in a sunny meadow, watercolor sketch' },
    { text: `시냇물 속에 예쁜 무지개 물고기가 꼬리를 치며 살며시 노래했어요.`, art: '🐟', prompt: 'A colorful rainbow fish jumping out of water, soft outline' },
    { text: `하늘에는 어느새 아름다운 노을빛과 알록달록 무지개가 두 둥실 떠올랐답니다.`, art: '🌈', prompt: 'Vibrant rainbow crossing sunset sky, cute' },
    { text: `친구들과 한데 모여 춤을 추며 소리쳤어요. "${topic}의 세상은 참 신기하고 아름다워!"`, art: '🥳', prompt: 'Forest creatures partying together happily, watercolor masterwork' }
  ];

  const bookPages = data?.pages || fallbackPages;
  const pageData = bookPages[currentPage] || bookPages[0] || fallbackPages[0];

  const gradients = [
    'linear-gradient(135deg, #FFE5EC 0%, #FFCAD4 100%)',
    'linear-gradient(135deg, #E0F4FF 0%, #B5E2FA 100%)',
    'linear-gradient(135deg, #F0E6FF 0%, #E2C9FF 100%)',
    'linear-gradient(135deg, #DCEDC1 0%, #A8E6CF 100%)',
    'linear-gradient(135deg, #E0F4FF 0%, #B5E2FA 100%)',
    'linear-gradient(135deg, #FFF5E6 0%, #FFCAD4 100%)',
    'linear-gradient(135deg, #FFE5EC 0%, #F0E6FF 100%)',
    'linear-gradient(135deg, #DCEDC1 0%, #FFD3B6 100%)'
  ];
  const bgGradient = gradients[currentPage % gradients.length];

  return (
    <div className="bananacard-container printable-book-page" style={{ padding: '24px 30px' }}>
      <div className="bananacard-header">
        <span className="bananacard-badge">🎨 GPT-IMAGE-2 ILLUSTRATION</span>
        <span className="bananacard-model-tag">Quality: {data?.imageGeneration?.quality || 'Preview'} · {data?.imageGeneration?.size || 'Responsive'}</span>
      </div>

      <div className="storybook-container" style={{ width: '100%' }}>
        <div className="storybook-header" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '20px' }}>
          📖 “{topic}” 그림책 (만 {age}세 발달 맞춤형)
        </div>
        
        <div className="storybook-page-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 실제 생성 이미지 또는 시뮬레이션용 대체 시각 자산 */}
          <div className="drawing-sketch-frame" style={{ background: bgGradient, fontSize: '6.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '340px', borderRadius: 'var(--border-radius-md)', border: '6px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', transition: 'all 0.3s ease' }}>
            {pageData.imageDataUrl ? (
              <img src={pageData.imageDataUrl} alt={`${topic} 그림책 ${currentPage + 1}쪽 삽화`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))' }}>{pageData.art || '📖'}</span>
            )}
          </div>
          
          <div className="storybook-text" style={{ fontSize: '1.15rem', lineHeight: '1.9', textAlign: 'center', fontWeight: '600', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', padding: '0 16px' }}>
            {pageData.text}
          </div>
        </div>

        <div className="storybook-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <button 
            className="nav-btn prev-btn" 
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 'bold' }} 
            onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            이전
          </button>
          <span className="page-indicator" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{currentPage + 1} / {bookPages.length} 페이지</span>
          <button 
            className="nav-btn next-btn" 
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 'bold' }} 
            onClick={() => currentPage < bookPages.length - 1 && setCurrentPage(currentPage + 1)}
            disabled={currentPage === bookPages.length - 1}
          >
            다음
          </button>
        </div>
      </div>

      <div className="bananacard-footer">
        <span>Prompt: “{pageData.prompt || 'Cute watercolor sketch'}”</span>
        <span>Model: {data?.imageGeneration?.model || 'Preview'} | Quality: {data?.imageGeneration?.quality || 'simulation'}</span>
      </div>
      <div className="bananacard-watermark">image2</div>
    </div>
  );
}
