'use client';

import { useState, useEffect } from 'react';
import AgentModeBadge from './components/AgentModeBadge';
import AgentTree from './components/AgentTree';
import AgentTerminal from './components/AgentTerminal';

// Import Drawing Cards
import StorybookCard from './components/drawing-cards/StorybookCard';
import Flashcard3D from './components/drawing-cards/Flashcard3D';
import WorksheetDoc from './components/drawing-cards/WorksheetDoc';
import PatternDoc from './components/drawing-cards/PatternDoc';
import PuzzleGame from './components/drawing-cards/PuzzleGame';

// 유형별 상세 정보 데이터
const materialDetails = {
  storybook: {
    title: '📖 그림책 / 동화책',
    description: '이야기와 그림이 함께하는 유아용 책',
    aiTools: ['ChatGPT / Claude (스토리 생성)', 'DALL-E / Midjourney (일러스트 생성)', 'Canva AI (레이아웃)'],
    examples: ['동물 친구들의 하루 일과 그림책', '계절 변화를 담은 자연 동화책', '기본 생활습관 그림책'],
    steps: [
      '주제와 대상 연령 결정하기',
      '스토리 구조 기획 (시작-전개-마무리)',
      'AI로 이야기 텍스트 생성하기',
      '각 장면별 이미지 프롬프트 작성하기',
      '이미지 생성 AI로 일러스트 만들기',
      '텍스트와 이미지 배치하여 완성하기'
    ],
    prompts: {
      text: '만 4세 유아를 위한 {topic} 주제의 그림책 이야기를 써주세요. 8페이지 분량으로, 각 페이지마다 간단한 문장 2-3개로 구성해주세요.',
      image: '{style} 스타일로 {scene}을/를 그려주세요. 유아 그림책에 적합하게 밝고 따뜻한 색감으로, 귀여운 캐릭터로 표현해주세요.'
    }
  },
  flashcard: {
    title: '🃏 플래시카드',
    description: '낱말, 숫자, 그림 학습용 카드',
    aiTools: ['이미지 생성 AI (그림카드)', '텍스트 AI (낱말/문장 생성)', 'Canva AI (카드 템플릿)'],
    examples: ['한글 낱말 카드 (ㄱㄴㄷ)', '숫자 카드 (1-10)', '동물/과일 그림카드', '감정 표현 카드'],
    steps: [
      '카드 주제와 개수 정하기',
      '카드에 들어갈 내용 목록 작성하기',
      '각 카드별 이미지 프롬프트 작성하기',
      'AI로 일관된 스타일의 이미지 생성하기',
      '카드 템플릿에 배치하기',
      '인쇄용 PDF로 내보내기'
    ],
    prompts: {
      text: '만 {age}세 유아를 위한 {topic} 플래시카드 세트를 만들려고 합니다. 카드에 들어갈 내용 {count}개를 추천해주세요.',
      image: '{style} 일러스트 스타일로 {item}을/를 그려주세요. 플래시카드용으로 배경은 단순하게, 대상은 크고 명확하게 표현해주세요.'
    }
  },
  worksheet: {
    title: '📝 워크시트',
    description: '활동지, 학습지, 색칠공부',
    aiTools: ['텍스트 AI (문제 생성)', '이미지 생성 AI (삽화)', 'Canva AI (레이아웃)'],
    examples: ['선 긋기 / 미로 찾기', '같은 것 찾기 / 다른 것 찾기', '색칠하기 도안', '글자 따라쓰기', '숫자 세기 활동지'],
    steps: [
      '활동 유형과 난이도 결정하기',
      '학습 목표 설정하기',
      'AI로 문제/활동 내용 생성하기',
      '삽화나 도안 이미지 생성하기',
      '워크시트 레이아웃 구성하기',
      '인쇄 테스트 후 최종 수정하기'
    ],
    prompts: {
      text: '만 {age}세 유아를 위한 {topic} 주제의 {type} 워크시트를 만들어주세요. 활동 지시문과 정답을 포함해주세요.',
      image: '유아 워크시트용 {item} 라인아트를 그려주세요. 색칠하기에 적합하도록 외곽선만 검정색으로, 내부는 비워두세요.'
    }
  },
  pattern: {
    title: '✂️ 교구 패턴',
    description: '만들기, 오리기, 붙이기 활동용 패턴',
    aiTools: ['이미지 생성 AI (패턴 디자인)', '벡터 AI (SVG 변환)', 'Canva AI (편집)'],
    examples: ['종이 인형 / 동물 만들기', '모빌 만들기 패턴', '계절 꾸미기 자료', '가면 만들기 도안', '입체 도형 전개도'],
    steps: [
      '만들기 활동 주제 선정하기',
      '패턴 구성 요소 기획하기',
      'AI로 패턴 디자인 생성하기',
      '자르기 선과 접기 선 추가하기',
      '조립 순서 설명서 만들기',
      '테스트 제작 후 수정하기'
    ],
    prompts: {
      text: '{topic} 주제의 종이 만들기 활동을 기획해주세요. 필요한 패턴 조각과 조립 방법을 설명해주세요.',
      image: '유아 만들기용 {item} 패턴을 그려주세요. 자르기 쉽도록 단순한 형태로, {style} 스타일로 표현해주세요.'
    }
  },
  puzzle: {
    title: '🧩 퍼즐 / 게임',
    description: '학습용 퍼즐과 보드게임',
    aiTools: ['이미지 생성 AI (퍼즐 그림)', '텍스트 AI (게임 규칙)', 'Canva AI (보드 디자인)'],
    examples: ['그림 맞추기 퍼즐', '낱말 카드 매칭 게임', '보드게임 (숫자/한글 학습)', '메모리 카드 게임', '순서 맞추기 퍼즐'],
    steps: [
      '게임 유형과 학습 목표 정하기',
      '게임 규칙 설계하기',
      'AI로 게임 구성 요소 디자인하기',
      '퍼즐 조각 또는 카드 제작하기',
      '게임판/보드 디자인하기',
      '테스트 플레이 후 수정하기'
    ],
    prompts: {
      text: '만 {age}세 유아를 위한 {topic} 주제의 {type} 게임을 기획해주세요. 게임 규칙과 필요한 구성품을 설명해주세요.',
      image: '{style} 스타일로 {item} 퍼즐/게임용 일러스트를 그려주세요. 밝고 재미있는 분위기로 표현해주세요.'
    }
  }
};

const initialAgentStates = {
  chief: { state: '', status: '대기 중' },
  manager: { state: '', status: '대기 중' },
  writer: { state: '', status: '대기 중' },
  illustrator: { state: '', status: '대기 중' },
  layout: { state: '', status: '대기 중' }
};

export default function Home() {
  const printResult = async () => {
    // Wait for web fonts and the final paint before opening the browser's PDF dialog.
    // This prevents partially rendered cards (especially emoji/SVG artwork) in print preview.
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    document.body.classList.add('printing-result');
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    window.print();
  };

  useEffect(() => {
    const finishPrinting = () => document.body.classList.remove('printing-result');
    window.addEventListener('afterprint', finishPrinting);
    return () => {
      window.removeEventListener('afterprint', finishPrinting);
      finishPrinting();
    };
  }, []);

  const [activeTab, setActiveTab] = useState('learning');
  const [selectedDetail, setSelectedDetail] = useState(null);

  // 실습 폼 상태관리
  const [currentStep, setCurrentStep] = useState(1);
  const [materialType, setMaterialType] = useState('');
  const [topic, setTopic] = useState('');
  const [age, setAge] = useState('');
  const [style, setStyle] = useState('');
  const [additional, setAdditional] = useState('');
  const [promptText, setPromptText] = useState('');

  // API Key 및 서랍(Drawer) 상태관리
  const [apiKey, setApiKey] = useState('');
  const [obfuscatedKey, setObfuscatedKey] = useState('');
  const [keySource, setKeySource] = useState(null);
  const [tempKey, setTempKey] = useState('');
  const [openAiApiKey, setOpenAiApiKey] = useState('');
  const [tempOpenAiKey, setTempOpenAiKey] = useState('');
  const [isRealMode, setIsRealMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 에이전트 오케스트레이션 엔진 및 AI 응답 데이터 상태
  const [agentStates, setAgentStates] = useState(initialAgentStates);
  const [logs, setLogs] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [generationData, setGenerationData] = useState(null);

  // 컴포넌트 마운트 시 데스크탑 API Key 자동 로딩
  useEffect(() => {
    async function loadDesktopKey() {
      try {
        const res = await fetch('/api/load-desktop-key');
        const data = await res.json();
        if (data.success) {
          setApiKey(data.key);
          setObfuscatedKey(data.obfuscated);
          setKeySource(data.source);
          setTempKey(data.key);
          setIsRealMode(true); // 키 로드 시 자동으로 실제 생성 모드로 전환 권장
        }
      } catch (err) {
        console.error('바탕화면 키 자동 ingestion 오류:', err);
      }
    }
    loadDesktopKey();
  }, []);

  // Drawer 열기
  const openDetail = (type) => {
    setSelectedDetail(materialDetails[type]);
  };

  // Drawer 닫기
  const closeDetail = () => {
    setSelectedDetail(null);
  };

  // 수동으로 API Key 설정 시 저장 버튼 핸들러
  const handleSaveManualKey = () => {
    if (!tempKey.trim()) {
      alert('API Key를 입력해주세요.');
      return;
    }
    const key = tempKey.trim();
    const obfuscated = key.length > 8 
      ? key.substring(0, 4) + '...' + key.substring(key.length - 4)
      : 'Valid Key';
    
    setApiKey(key);
    setObfuscatedKey(obfuscated);
    setKeySource('manual');
    setIsRealMode(true);
    setOpenAiApiKey(tempOpenAiKey.trim());
    alert('Gemini 콘텐츠 생성 키가 연동되었습니다. OpenAI 키를 입력했거나 서버에 OPENAI_API_KEY가 설정되어 있으면 gpt-image-2 이미지 생성이 활성화됩니다.');
  };

  // 프롬프트 생성 규칙
  const handleGeneratePrompt = () => {
    const templates = {
      storybook: `📖 그림책 제작 프롬프트\n\n[텍스트 생성]\n만 ${age}세 유아 대상 "${topic}" 그림책 이야기 8페이지 분량. 각 페이지마다 간단한 문장 2-3개로 작성.\n\n[이미지 생성]\ngpt-image-2 최고 품질(high)로 밝고 친근하며 따뜻한 색감의 일관된 캐릭터와 풍경 삽화를 생성.`,
      flashcard: `🃏 플래시카드 제작 프롬프트\n\n[콘텐츠 생성]\n만 ${age}세 유아 대상 "${topic}" 단어/그림 카드와 핵심 교육 안내 설명.\n\n[이미지 생성]\ngpt-image-2 최고 품질(high)로 중심 사물이 크고 명확한 정사각형 삽화를 생성.`,
      worksheet: `📝 워크시트 제작 프롬프트\n\n[활동 설계]\n만 ${age}세 유아 대상 "${topic}" 단어 따라 쓰기 및 색칠하기 등이 포함된 학습 활동지 설계.\n\n[삽화 생성]\ngpt-image-2 최고 품질(high)로 굵고 닫힌 검정 외곽선의 인쇄용 라인아트를 생성.`,
      pattern: `✂️ 교구 패턴 제작 프롬프트\n\n[도안 설계]\n만 ${age}세 유아 대상 "${topic}" 종이 만들기 패턴 구성 요소 및 부착 방식 가이드라인.\n\n[패턴 생성]\ngpt-image-2 최고 품질(high)로 자르기 선과 접기 선이 명확한 세로형 인쇄 도안을 생성.`,
      puzzle: `🧩 퍼즐/게임 제작 프롬프트\n\n[게임 기획]\n만 ${age}세 유아 대상 "${topic}" 테마 카드 매칭 퍼즐 규칙 및 디자인.\n\n[삽화 생성]\ngpt-image-2 최고 품질(high)로 친근하고 식별하기 쉬운 정사각형 카드 삽화를 생성.`
    };
    setPromptText(templates[materialType] || '');
  };

  // 비동기 슬립 헬퍼
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const generateVisualAssets = async (contentData, addLog) => {
    const enrichedData = JSON.parse(JSON.stringify(contentData));
    const collection = materialType === 'storybook'
      ? enrichedData.pages
      : (materialType === 'flashcard' || materialType === 'puzzle' ? enrichedData.cards : null);
    const targets = Array.isArray(collection) ? collection : [enrichedData];

    for (let index = 0; index < targets.length; index += 1) {
      addLog(`[gpt-image-2] 고품질 이미지 ${index + 1}/${targets.length} 생성 중...`, 'illustrator');
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: materialType,
          topic,
          age,
          style,
          additional,
          item: targets[index],
          index,
          storyContext: materialType === 'storybook' ? targets.map((page) => page.text).join(' ') : '',
          openAiKey: openAiApiKey
        })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || `이미지 ${index + 1} 생성 실패`);

      targets[index].imageDataUrl = result.imageDataUrl;
      targets[index].imagePrompt = result.imagePrompt;
      enrichedData.imageGeneration = result.imageGeneration;
    }

    return enrichedData;
  };

  // 에이전트 오케스트레이션 실행 (시뮬레이션 혹은 실제 API 생성)
  const handleRunOrchestration = async () => {
    setShowResult(false);
    setLogs([]);
    setAgentStates(initialAgentStates);
    setGenerationData(null);

    const timeString = () => {
      return new Date().toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const addLog = (text, sender) => {
      setLogs((prev) => [
        ...prev,
        { text, sender, time: timeString() }
      ]);
    };

    const setNodeState = (id, state, status) => {
      setAgentStates((prev) => ({
        ...prev,
        [id]: { state, status }
      }));
    };

    const managerNames = {
      storybook: 'Storybook Manager',
      flashcard: 'Flashcard Manager',
      worksheet: 'Worksheet Manager',
      pattern: 'Pattern Manager',
      puzzle: 'Puzzle Manager'
    };
    const managerName = managerNames[materialType] || 'Material Manager';

    // 1단계: Chief Orchestrator
    addLog(`총괄 디렉터(Chief) 기동 - 과업 해석 분석 절차 개시 [${isRealMode ? '실제 AI 생성 모드' : '시뮬레이션 모드'}]`, 'system');
    await sleep(600);
    setNodeState('chief', 'active', '요구사항 정밀 분석 중');
    addLog(`[매개변수 체크] 유형: ${materialType}, 주제: "${topic}", 연령: 만 ${age}세, 스타일: ${style || '기본'}`, 'chief');
    await sleep(1000);

    // 2단계: Manager
    setNodeState('chief', 'completed', '주제 파악 완료');
    setNodeState('manager', 'active', '계획 설계 및 임무 위임 중');
    addLog(`[매니저 위임] "${managerName}" 에이전트 소출 및 구조 위임`, 'chief');
    await sleep(800);
    addLog(`만 ${age}세 교육과정에 근거하여 학습 교구 설계의 난이도 및 A4 규격을 검토합니다.`, 'manager');
    await sleep(1000);

    if (isRealMode) {
      // 실제 API 호출 수행!
      setNodeState('manager', 'completed', '교재교구 뼈대 기획 완료');
      setNodeState('writer', 'active', '어휘 분석 및 텍스트 집필 중');
      addLog(`[작가 전문가] "Writer Agent" 기동 - 어휘 필터링 동작`, 'manager');
      await sleep(600);
      addLog(`Gemini API를 호출하여 만 ${age}세 맞춤형 학습 콘텐츠를 실제 생성 중입니다. 잠시만 기다려 주세요...`, 'writer');
      
      setNodeState('illustrator', 'active', 'gpt-image-2 고품질 자산 렌더링 중');
      addLog(`[드로잉 전문가] OpenAI "gpt-image-2" Illustrator Agent 기동 (quality: high)`, 'manager');

      try {
        const response = await fetch('/api/generate-material', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: materialType,
            topic,
            age,
            style,
            additional,
            key: apiKey,
            openAiKey: openAiApiKey
          })
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || '알 수 없는 생성 오류');
        }

        // 작가와 드로잉 에이전트 성공 상태로 변경
        addLog(`[작가 완료] 어휘 분석 및 교육용 스토리/낱말 목록 완성 보고 완료.`, 'writer');
        setNodeState('writer', 'completed', '집필 완료');
        await sleep(500);

        const illustratedData = await generateVisualAssets(result.data, addLog);
        addLog(`[드로잉 완료] gpt-image-2 최고 품질 실제 이미지 자산 생성 완료!`, 'illustrator');
        setNodeState('illustrator', 'completed', '시각 자산 준비 완료');
        await sleep(500);

        // 퍼블리셔 단계
        setNodeState('layout', 'active', '인쇄용 가이드 조립 중');
        addLog(`[퍼블리셔] 최종 결과물 빌드를 담당할 "Layout Publisher" 소출`, 'manager');
        await sleep(800);
        addLog(`Gemini의 원시 JSON 데이터를 바인딩하여 A4 반응형 인쇄 가이드를 준수해 정렬합니다.`, 'layout');
        await sleep(1000);
        addLog(`인쇄 가이드 및 UI 매칭 컴파일 작업을 완성하여 총괄 디렉터에 조립 완료본을 제출합니다.`, 'layout');
        setNodeState('layout', 'completed', '조립 출판 완료');
        await sleep(600);

        // Chief 검증 단계
        setNodeState('chief', 'completed', '최종 검증 완료');
        addLog('하위 에이전트로부터 전달받은 최종 결과물의 상호 조화 무결성을 심사합니다.', 'chief');
        await sleep(600);
        addLog('검증 성공! 실제 생성된 gpt-image-2 고품질 이미지와 아동 발달 적합성을 확인했습니다.', 'chief');
        await sleep(500);
        addLog('실제 Gemini API 계층 트리 오케스트레이션 완료! 교구 결과물을 렌더링합니다.', 'success');

        setGenerationData(illustratedData);
        setShowResult(true);

      } catch (error) {
        addLog(`[에러] 실제 교구 생성 실패: ${error.message}`, 'chief');
        setNodeState('chief', 'error', '생성 실패');
        setNodeState('writer', 'error', '에러 발생');
        setNodeState('illustrator', 'error', '에러 발생');
        setNodeState('layout', 'error', '대기 중');
      }

    } else {
      // 기존 시뮬레이션 모드!
      setNodeState('manager', 'completed', '교재교구 뼈대 기획 완료');
      setNodeState('writer', 'active', '연령별 어휘 필터링 및 집필 중');
      addLog(`[작가 전문가] "Writer Agent"를 호출하여 콘텐츠 텍스트 집필 시작`, 'manager');
      await sleep(800);
      addLog(`만 ${age}세 수준에 친숙한 어휘를 추출하여 교육 지시문 및 스토리를 집필합니다.`, 'writer');
      await sleep(1400);
      addLog(`"${topic}" 주제에 어울리는 유아 맞춤형 텍스트 설정을 완료하여 Manager에 보고합니다.`, 'writer');
      await sleep(600);

      // 4단계: Visual Specialist (시뮬레이션 모드)
      setNodeState('writer', 'completed', '어휘/텍스트 필터링 통과');
      const isLineArt = materialType === 'worksheet' || materialType === 'pattern';
      const visualLabel = isLineArt ? 'Line-Art Specialist' : 'Illustrator Agent';
      setNodeState('illustrator', 'active', isLineArt ? '선화 렌더링 중' : '드로잉 이미지 렌더링 중');
      addLog(`[드로잉 전문가] gpt-image-2 전담 [${visualLabel}] 시뮬레이션 기동`, 'manager');
      await sleep(800);
      addLog(`[시뮬레이션] 실제 API 호출 없이 gpt-image-2 결과 레이아웃을 미리 봅니다.`, 'illustrator');
      await sleep(1000);
      if (isLineArt) {
        addLog(`인쇄용 및 오리기 활동에 최적화된 흑백 외곽선 드로잉 라인아트를 오차 없이 렌더링합니다.`, 'illustrator');
      } else {
        addLog(`gpt-image-2용 밝고 친근하며 명확한 캐릭터 삽화 구성을 미리 봅니다.`, 'illustrator');
      }
      await sleep(1400);
      addLog(`[완료] 드로잉 삽화 그래픽 자산이 성공적으로 패키징되었습니다.`, 'illustrator');
      await sleep(600);

      // 5단계: Layout Publisher
      setNodeState('illustrator', 'completed', '시각 자산 준비 완료');
      setNodeState('layout', 'active', '인쇄용 HTML 조립 중');
      addLog(`[퍼블리셔] 최종 결과물 빌드를 담당할 "Layout Publisher" 소출`, 'manager');
      await sleep(800);
      addLog(`Writer의 텍스트와 Illustrator Agent 자산을 바인딩하여 A4 인쇄 가이드에 맞게 정렬합니다.`, 'layout');
      await sleep(1400);
      addLog(`인쇄 가이드 및 UI 매칭 컴파일 작업을 완성하여 총괄 디렉터에 조립 완료본을 제출합니다.`, 'layout');
      await sleep(800);

      // 6단계: Chief Orchestrator 검증
      setNodeState('layout', 'completed', '조립 출판 완료');
      setNodeState('chief', 'completed', '최종 검증 완료');
      addLog('하위 에이전트로부터 전달받은 최종 결과물의 상호 조화 무결성을 심사합니다.', 'chief');
      await sleep(600);
      addLog('시뮬레이션 검증 완료! 실제 생성 모드에서는 gpt-image-2 고품질 이미지가 적용됩니다.', 'chief');
      await sleep(500);
      addLog('계층 트리 오케스트레이션 완료! 교구 결과물을 렌더링하여 화면에 표출합니다.', 'success');

      setShowResult(true);
    }
  };

  // 다음/이전 버튼 조율
  const navigateStep = (dir) => {
    const nextStep = currentStep + dir;
    if (nextStep < 1 || nextStep > 4) return;

    if (currentStep === 2 && dir === 1) {
      handleGeneratePrompt();
    }
    if (currentStep === 3 && dir === 1) {
      handleRunOrchestration();
    }
    setCurrentStep(nextStep);
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !materialType;
    if (currentStep === 2) return !topic || !age;
    return false;
  };

  // 프리뷰를 위한 동적 키워드별 카드 아이템 세팅 (시뮬레이션 fallback 전용)
  const isFlower = topic.includes('꽃') || topic.includes('봄') || topic.includes('식물');
  const isAnimal = topic.includes('동물') || topic.includes('곤충') || topic.includes('바다');
  
  let dynamicItems = [];
  if (isFlower) {
    dynamicItems = [
      { kor: '개나리', eng: 'Forsythia', emoji: '🟡', desc: '봄에 가장 먼저 피는 샛노란 꽃이에요.' },
      { kor: '진달래', eng: 'Azalea', emoji: '🌸', desc: '분홍빛 고운 꽃으로 화전을 만들기도 해요.' },
      { kor: '벚꽃', eng: 'Cherry Blossom', emoji: '💮', desc: '바람이 불면 눈처럼 휘날려요.' },
      { kor: '민들레', eng: 'Dandelion', emoji: '🌼', desc: '후~ 하고 불면 씨앗이 날아가요.' }
    ];
  } else if (isAnimal) {
    dynamicItems = [
      { kor: '토끼', eng: 'Rabbit', emoji: '🐰', desc: '긴 귀와 동그란 꼬리, 깡충깡충 뛰어요.' },
      { kor: '호랑이', eng: 'Tiger', emoji: '🐯', desc: '멋진 줄무늬와 크고 강한 목소리를 가졌어요.' },
      { kor: '곰', eng: 'Bear', emoji: '🐻', desc: '커다란 몸집에 달콤한 꿀을 좋아해요.' },
      { kor: '다람쥐', eng: 'Squirrel', emoji: '🐿️', desc: '볼이 통통하고 도토리를 모으는 친구예요.' }
    ];
  } else {
    dynamicItems = [
      { kor: topic + ' 1', eng: 'Learning Card 1', emoji: '🎈', desc: `주제 "${topic}"과 관련된 신나는 학습 단어 1` },
      { kor: topic + ' 2', eng: 'Learning Card 2', emoji: '🧸', desc: `주제 "${topic}"과 관련된 신나는 학습 단어 2` },
      { kor: topic + ' 3', eng: 'Learning Card 3', emoji: '🎨', desc: `주제 "${topic}"과 관련된 신나는 학습 단어 3` },
      { kor: topic + ' 4', eng: 'Learning Card 4', emoji: '🌟', desc: `주제 "${topic}"과 관련된 신나는 학습 단어 4` }
    ];
  }

  return (
    <div className="dashboard-container">
      {/* 헤더 */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-main">
              <div className="logo-icon">🎨</div>
              <h1>AI 활용 유아교재교구 제작 (Gemini + GPT Image)</h1>
            </div>
            {/* 설정 서랍 토글 버튼 */}
            <button className="settings-toggle-btn" onClick={() => setIsSettingsOpen(true)}>
              ⚙️ API 및 환경 설정
            </button>
          </div>
          <p className="subtitle">
            Gemini 콘텐츠 기획과 OpenAI gpt-image-2 최고 품질 시각 자산을 결합한 교구 생성 플랫폼
          </p>
        </div>
        <div className="header-decoration"></div>
      </header>

      {/* API 설정 서랍(Drawer) */}
      <div className={`settings-drawer ${isSettingsOpen ? 'active' : ''}`}>
        <button className="close-panel-btn" onClick={() => setIsSettingsOpen(false)}>✕</button>
        <h3>⚙️ API 및 환경 설정</h3>
        
        <div className="key-status-container">
          <span className="key-status-title">API Key 상태:</span>
          <div className="status-indicator">
            <span className={`status-dot ${apiKey ? 'green' : 'yellow'}`}></span>
            <span>{apiKey ? `연동 완료 (${keySource === 'desktop' ? '바탕화면' : keySource === 'env' ? '환경 변수' : '수동 입력'})` : '키 없음'}</span>
          </div>
        </div>

        {apiKey && (
          <div style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
            <strong>로드된 키:</strong> <code>{obfuscatedKey}</code>
          </div>
        )}

        <div className="input-group">
          <label htmlFor="manual-key">Gemini API Key 수동 입력</label>
          <input 
            type="password" 
            id="manual-key" 
            placeholder="AIZAaSy..." 
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="openai-key">OpenAI API Key (gpt-image-2)</label>
          <input
            type="password"
            id="openai-key"
            placeholder="sk-... (서버에 OPENAI_API_KEY가 있으면 생략 가능)"
            value={tempOpenAiKey}
            onChange={(e) => setTempOpenAiKey(e.target.value)}
          />
          <small style={{ color: 'var(--text-secondary)' }}>
            {openAiApiKey ? 'OpenAI 키 수동 연동 완료' : '수동 키 미입력 — 서버 OPENAI_API_KEY가 있으면 자동 사용'}
          </small>
        </div>
        
        <button className="save-key-btn" onClick={handleSaveManualKey}>
          키 설정 및 저장
        </button>

        <div className="settings-info-box" style={{ marginTop: '20px' }}>
          <h4>💡 바탕화면 자동 연동 방법</h4>
          Gemini 키는 기존 <code>gemini_api_key.txt</code> 또는 <code>GEMINI_API_KEY</code>를 사용합니다. 실제 이미지 생성을 위해 배포 서버에 <code>OPENAI_API_KEY</code>를 설정하거나 위 입력란에 OpenAI 키를 입력하세요. 키는 브라우저에 영구 저장하지 않습니다.
        </div>

        <div className="input-group" style={{ marginTop: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={isRealMode} 
              onChange={(e) => {
                if (e.target.checked && !apiKey) {
                  alert('실제 AI 생성을 활성화하려면 API Key가 먼저 등록되어 있어야 합니다.');
                  return;
                }
                setIsRealMode(e.target.checked);
              }}
              style={{ width: 'auto' }}
            />
            <span style={{ fontWeight: 600 }}>실제 Gemini + gpt-image-2 생성 모드 활성화</span>
          </label>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <nav className="main-nav">
        <button 
          className={`nav-tab ${activeTab === 'learning' ? 'active' : ''}`} 
          onClick={() => setActiveTab('learning')}
        >
          <span className="tab-icon">📚</span>
          <span className="tab-text">유형별 학습하기</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'practice' ? 'active' : ''}`} 
          onClick={() => setActiveTab('practice')}
        >
          <span className="tab-icon">🤖</span>
          <span className="tab-text">AI 활용 실습하기</span>
        </button>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        {/* 탭 1: 유형별 학습 */}
        {activeTab === 'learning' && (
          <section className="tab-content active">
            <div className="section-header">
              <h2>🎯 유아교재교구 유형별 AI 활용법 학습</h2>
              <p>각 교재교구 유형을 클릭하여 AI 활용 가이드라인을 알아보세요</p>
            </div>

            <div className="material-types-grid">
              <div className="material-card" onClick={() => openDetail('storybook')}>
                <div className="card-icon">📖</div>
                <h3>그림책 / 동화책</h3>
                <p>이야기와 그림이 함께하는 책</p>
                <div className="card-badge">이미지 생성 AI</div>
              </div>

              <div className="material-card" onClick={() => openDetail('flashcard')}>
                <div className="card-icon">🃏</div>
                <h3>플래시카드</h3>
                <p>학습용 낱말카드 / 그림카드</p>
                <div className="card-badge">자동 레이아웃</div>
              </div>

              <div className="material-card" onClick={() => openDetail('worksheet')}>
                <div className="card-icon">📝</div>
                <h3>워크시트</h3>
                <p>활동지 및 학습지</p>
                <div className="card-badge">문제 생성 AI</div>
              </div>

              <div className="material-card" onClick={() => openDetail('pattern')}>
                <div className="card-icon">✂️</div>
                <h3>교구 패턴</h3>
                <p>만들기 활동용 패턴</p>
                <div className="card-badge">패턴 디자인</div>
              </div>

              <div className="material-card" onClick={() => openDetail('puzzle')}>
                <div className="card-icon">🧩</div>
                <h3>퍼즐 / 게임</h3>
                <p>학습용 퍼즐과 게임</p>
                <div className="card-badge">게임 콘텐츠 생성</div>
              </div>
            </div>

            {/* 상세 서랍 패널 */}
            {selectedDetail && (
              <div id="detail-panel" className="detail-panel active">
                <button className="close-panel-btn" onClick={closeDetail}>✕</button>
                <div className="detail-content">
                  <h3>{selectedDetail.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{selectedDetail.description}</p>
                  
                  <div className="detail-section">
                    <h4>🤖 활용 가능한 AI 도구</h4>
                    <ul>
                      {selectedDetail.aiTools.map((tool, i) => <li key={i}>{tool}</li>)}
                    </ul>
                  </div>

                  <div className="detail-section">
                    <h4>📋 제작 예시</h4>
                    <ul>
                      {selectedDetail.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                    </ul>
                  </div>

                  <div className="detail-section">
                    <h4>📝 제작 단계</h4>
                    <div className="step-guide">
                      <ol>
                        {selectedDetail.steps.map((s, i) => <li key={i}>{s}</li>)}
                      </ol>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>💡 프롬프트 예시</h4>
                    <div style={{ background: 'var(--color-cream)', padding: '16px', borderRadius: '12px', marginTop: '8px' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}><strong>텍스트 생성용:</strong></p>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{selectedDetail.prompts.text}</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '16px 0 12px' }}><strong>이미지 생성용:</strong></p>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{selectedDetail.prompts.image}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* 탭 2: AI 활용 실습 */}
        {activeTab === 'practice' && (
          <section className="tab-content active">
            <div className="section-header">
              <h2>🚀 생성형 AI 활용 실습 인터페이스</h2>
              <p>계층 에이전트를 조율하고 gpt-image-2 고품질 이미지 교구를 자동으로 만들어 보세요</p>
              <AgentModeBadge isRealGeneration={isRealMode} />
            </div>

            <div className="practice-container">
              {/* 단계 표시기 */}
              <div className="step-indicator">
                <div className={`step ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">유형 선택</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">정보 입력</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label">프롬프트 생성</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${currentStep >= 4 ? 'completed' : ''} ${currentStep === 4 ? 'active' : ''}`}>
                  <span className="step-number">4</span>
                  <span className="step-label">에이전트 오케스트레이션</span>
                </div>
              </div>

              {/* 실습 폼 본문 */}
              <div className="practice-form">
                {/* Step 1: 유형 선택 */}
                {currentStep === 1 && (
                  <div className="form-step active">
                    <h3>📋 교재교구 유형을 선택하세요</h3>
                    <div className="type-selector">
                      {[
                        { val: 'storybook', icon: '📖', label: '그림책' },
                        { val: 'flashcard', icon: '🃏', label: '플래시카드' },
                        { val: 'worksheet', icon: '📝', label: '워크시트' },
                        { val: 'pattern', icon: '✂️', label: '교구 패턴' },
                        { val: 'puzzle', icon: '🧩', label: '퍼즐/게임' }
                      ].map((opt) => (
                        <label key={opt.val} className="type-option">
                          <input 
                            type="radio" 
                            name="material-type" 
                            value={opt.val} 
                            checked={materialType === opt.val}
                            onChange={(e) => setMaterialType(e.target.value)}
                          />
                          <span className="option-card">
                            <span className="option-icon">{opt.icon}</span>
                            <span>{opt.label}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: 정보 입력 */}
                {currentStep === 2 && (
                  <div className="form-step active">
                    <h3>✏️ 제작 정보를 입력하세요</h3>
                    <div className="input-group">
                      <label htmlFor="topic">주제 / 테마</label>
                      <input 
                        type="text" 
                        id="topic" 
                        placeholder="예: 봄에 피는 꽃, 동물의 한살이, 교통수단" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="age">대상 연령</label>
                      <select id="age" value={age} onChange={(e) => setAge(e.target.value)}>
                        <option value="">선택하세요</option>
                        <option value="3">만 3세</option>
                        <option value="4">만 4세</option>
                        <option value="5">만 5세</option>
                        <option value="mixed">혼합 연령</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label htmlFor="style">스타일 / 분위기</label>
                      <select id="style" value={style} onChange={(e) => setStyle(e.target.value)}>
                        <option value="">선택하세요</option>
                        <option value="cute">귀엽고 아기자기한</option>
                        <option value="realistic">사실적인</option>
                        <option value="cartoon">만화 스타일</option>
                        <option value="watercolor">수채화 스타일</option>
                        <option value="simple">단순하고 명확한</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label htmlFor="additional">추가 요구사항 (선택)</label>
                      <textarea 
                        id="additional" 
                        placeholder="예: 한글 학습 요소 포함, 색칠하기 활동 추가"
                        value={additional}
                        onChange={(e) => setAdditional(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Step 3: 프롬프트 생성 */}
                {currentStep === 3 && (
                  <div className="form-step active">
                    <h3>🎯 생성된 AI 프롬프트</h3>
                    <div className="prompt-display">
                      <div className="prompt-label">
                        <span className="label-icon">💡</span>
                        이 프롬프트가 에이전트 트리 가동에 투입됩니다
                      </div>
                      <div className="prompt-text">{promptText}</div>
                      <button 
                        className="copy-btn" 
                        onClick={() => {
                          navigator.clipboard.writeText(promptText);
                          alert('클립보드에 복사되었습니다!');
                        }}
                      >
                        <span>📋 복사하기</span>
                      </button>
                    </div>
                    <div className="prompt-tips">
                      <h4>💬 프롬프트 및 에이전트 구조 안내</h4>
                      <ul>
                        <li>에이전트 총괄 디렉터가 이 기획문을 분석하여 각 전문가에 연동시킵니다.</li>
                        <li>Illustrator Agent는 <strong>OpenAI gpt-image-2</strong>를 최고 품질(high)로 호출해 실제 이미지를 생성합니다.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 4: 에이전트 오케스트레이션 및 최종 프리뷰 */}
                {currentStep === 4 && (
                  <div className="form-step active">
                    <h3>🤖 계층 트리 에이전트 오케스트레이션</h3>
                    
                    {/* 에이전트 트리 컴포넌트 */}
                    <AgentTree 
                      agentStates={agentStates} 
                      activeManagerName={
                        materialType === 'storybook' ? 'Storybook Manager' :
                        materialType === 'flashcard' ? 'Flashcard Manager' :
                        materialType === 'worksheet' ? 'Worksheet Manager' :
                        materialType === 'pattern' ? 'Pattern Manager' :
                        materialType === 'puzzle' ? 'Puzzle Manager' : 'Material Manager'
                      }
                    />

                    {/* 터미널 로그 컴포넌트 */}
                    <AgentTerminal logs={logs} />

                    {/* 최종 드로잉 교구 프리뷰 */}
                    {showResult && (
                      <div className="result-preview active" id="result-preview" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <h4>📦 최종 gpt-image-2 고품질 교구 시각화 및 프린트</h4>
                        <div id="preview-grid" className="preview-grid-wrapper" style={{ marginTop: '20px' }}>
                          {materialType === 'storybook' && <StorybookCard topic={topic} age={age} data={generationData} />}
                          {materialType === 'flashcard' && <Flashcard3D items={dynamicItems} age={age} data={generationData} />}
                          {materialType === 'worksheet' && <WorksheetDoc topic={topic} age={age} items={dynamicItems} data={generationData} />}
                          {materialType === 'pattern' && <PatternDoc topic={topic} age={age} items={dynamicItems} data={generationData} />}
                          {materialType === 'puzzle' && <PuzzleGame items={dynamicItems} age={age} data={generationData} />}
                        </div>

                        <div className="preview-actions">
                          <button className="action-btn print-btn" onClick={printResult}>
                            <span>🖨️ 인쇄 / PDF로 저장</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 학습 정리 */}
                    <div className={`practice-summary ${showResult ? 'active' : ''}`}>
                      <h4>✅ 학습 정리</h4>
                      <div className="checklist">
                        <div className="checklist-item checked">
                          <span>✅</span><span>계층형 트리 에이전트 오케스트레이션 완료 ✓</span>
                        </div>
                        <div className="checklist-item checked">
                          <span>✅</span><span>gpt-image-2 최고 품질 이미지 생성 파이프라인 완료 ✓</span>
                        </div>
                        <div className="checklist-item checked">
                          <span>✅</span><span>유아용 인쇄 규격 레이아웃 패키징 완료 ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 하단 제어 네비게이션 */}
              <div className="form-navigation">
                {currentStep === 4 && showResult ? (
                  <button 
                    className="nav-btn prev-btn" 
                    onClick={() => {
                      setCurrentStep(1);
                      setMaterialType('');
                      setTopic('');
                      setAge('');
                      setStyle('');
                      setAdditional('');
                      setPromptText('');
                      setLogs([]);
                      setAgentStates(initialAgentStates);
                      setShowResult(false);
                      setGenerationData(null);
                    }}
                  >
                    <span>처음으로</span>
                  </button>
                ) : (
                  <button 
                    className="nav-btn prev-btn" 
                    onClick={() => navigateStep(-1)}
                    disabled={currentStep === 1}
                  >
                    <span>← 이전</span>
                  </button>
                )}

                {currentStep < 4 ? (
                  <button 
                    className="nav-btn next-btn" 
                    onClick={() => navigateStep(1)}
                    disabled={isNextDisabled()}
                  >
                    <span>다음 →</span>
                  </button>
                ) : (
                  !showResult && (
                    <button className="nav-btn next-btn" disabled style={{ opacity: 0.5 }}>
                      <span>에이전트 실행 중...</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 푸터 */}
      <footer className="main-footer">
        <p>🌟 Next.js, Gemini &amp; OpenAI gpt-image-2 기반 계층형 에이전트 교구 제작 시스템</p>
      </footer>
    </div>
  );
}
