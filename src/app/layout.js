import "./globals.css";

export const metadata = {
  title: "AI 활용 유아교재교구 제작 대시보드 - Gemini Live",
  description: "계층형 트리 에이전트 오케스트레이션 기반 'nano-banana 2' 모델 드로잉 교구 생성 플랫폼 (Gemini API 연동)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
