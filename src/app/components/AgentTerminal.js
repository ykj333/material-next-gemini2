'use client';

import { useEffect, useRef } from 'react';

export default function AgentTerminal({ logs }) {
  const terminalBodyRef = useRef(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="agent-terminal">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="terminal-title">Agent Orchestration Console</div>
      </div>
      <div className="terminal-body" ref={terminalBodyRef} id="terminal-logs">
        {logs.length === 0 ? (
          <div className="log-line system">
            &gt; 에이전트 시스템을 실행하면 실시간 로그가 여기에 출력됩니다.
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className={`log-line ${log.sender}`}>
              [{log.time}] [{log.sender.toUpperCase()}] {log.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
