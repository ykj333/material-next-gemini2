export default function AgentModeBadge({ isRealGeneration }) {
  return (
    <div className="agent-mode-badge">
      <span className="badge-dot animate-pulse"></span>
      <span className="badge-text">
        에이전트 모드: 계층 트리 오케스트레이션 ({isRealGeneration ? '실제 Gemini API 생성' : '인터랙티브 시뮬레이션'})
      </span>
    </div>
  );
}
