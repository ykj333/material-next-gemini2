export default function AgentTree({ agentStates, activeManagerName }) {
  const getClassName = (id) => {
    return `agent-node ${agentStates[id]?.state || ''}`;
  };

  const getStatusText = (id) => {
    return agentStates[id]?.status || '대기 중';
  };

  return (
    <div className="agent-tree-wrapper">
      <div className="tree-title">🖥️ 실시간 에이전트 트리 상태</div>
      <div className="agent-tree">
        {/* 1레벨: Chief Orchestrator */}
        <div className="tree-level level-root">
          <div className={getClassName('chief')} id="node-chief">
            <span className="node-badge">Root</span>
            <span className="node-icon">👑</span>
            <span className="node-name">Chief Orchestrator</span>
            <span className="node-status">{getStatusText('chief')}</span>
          </div>
        </div>
        
        <div className="tree-connector-v"></div>
        
        {/* 2레벨: Type Manager */}
        <div className="tree-level level-manager">
          <div className={getClassName('manager')} id="node-manager">
            <span className="node-badge">Manager</span>
            <span className="node-icon">📋</span>
            <span className="node-name">{activeManagerName || 'Material Manager'}</span>
            <span className="node-status">{getStatusText('manager')}</span>
          </div>
        </div>
        
        <div className="tree-connector-v"></div>
        
        {/* 3레벨: Specialist Workers */}
        <div className="tree-level level-workers">
          <div className={getClassName('writer')} id="node-writer">
            <span className="node-badge">Worker</span>
            <span className="node-icon">📝</span>
            <span className="node-name">Writer Agent</span>
            <span className="node-status">{getStatusText('writer')}</span>
          </div>
          <div className={getClassName('illustrator')} id="node-illustrator">
            <span className="node-badge">Worker</span>
            <span className="node-icon">🎨</span>
            <span className="node-name">Illustrator Agent</span>
            <span className="node-status">{getStatusText('illustrator')}</span>
          </div>
          <div className={getClassName('layout')} id="node-layout">
            <span className="node-badge">Publisher</span>
            <span className="node-icon">📐</span>
            <span className="node-name">Layout Publisher</span>
            <span className="node-status">{getStatusText('layout')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
