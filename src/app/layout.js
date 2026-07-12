import "./globals.css";

export const metadata = {
  title: "AI 활용 유아교재교구 제작 대시보드 - Gemini + GPT Image",
  description: "계층형 에이전트 오케스트레이션 기반 gpt-image-2 최고 품질 교구 생성 플랫폼",
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
