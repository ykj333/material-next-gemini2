import { NextResponse } from 'next/server';

function normalizeKey(value) {
  if (!value) return '';
  const trimmed = value.trim();
  return trimmed.includes('=') ? trimmed.split('=').pop().trim() : trimmed;
}

export async function POST(request) {
  try {
    const { type, topic, age, style, additional, key } = await request.json();

    // Use user-provided API key from settings or fallback to the system environment variable
    const apiKey = normalizeKey(key || process.env.GEMINI_API_KEY);

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: 'Gemini API Key가 누락되었습니다. 바탕화면에 gemini_api_key.txt 파일을 생성해 두시거나, 대시보드의 API 설정 Drawer를 열고 입력해 주세요.'
      }, { status: 400 });
    }

    // 유형별 JSON 스키마 상세 가이드
    let schemaGuide = '';
    if (type === 'storybook') {
      schemaGuide = `Return JSON format: { "pages": [ { "text": "Page text in Korean. Keep it 2-3 short sentences appropriate for age 만 ${age}세", "art": "A single representative emoji", "prompt": "Watercolor drawing prompt for this page in English" } ] } Generate exactly 8 pages representing a story starting, rising, climaxing, and concluding.`;
    } else if (type === 'flashcard') {
      schemaGuide = `Return JSON format: { "cards": [ { "kor": "Korean word representing the card noun", "eng": "English translation", "emoji": "A single emoji representing the object", "desc": "Short educational description in Korean" } ] } Generate exactly 4 cards.`;
    } else if (type === 'worksheet') {
      schemaGuide = `Return JSON format: { "title": "Creative Worksheet Title in Korean", "cards": [ { "kor": "Short trace word in Korean", "eng": "English", "emoji": "Emoji" } ], "isFlower": true/false (true if topic is flower/spring, false otherwise), "isAnimal": true/false (true if animal, false otherwise) } Generate exactly 4 cards.`;
    } else if (type === 'pattern') {
      schemaGuide = `Return JSON format: { "title": "Paper craft crown title in Korean", "directions": "Brief step-by-step paper craft folding instructions in Korean", "parts": [ { "name": "Part name in Korean", "emoji": "Representative emoji" } ] } Generate exactly 1 part.`;
    } else if (type === 'puzzle') {
      schemaGuide = `Return JSON format: { "cards": [ { "kor": "Word in Korean", "emoji": "Emoji" } ] } Generate exactly 4 unique matching pairs.`;
    }

    const systemPrompt = `You are a professional Early Childhood Education Content Planner and Props Designer.
Create a high-quality educational resource for age 만 ${age}세 about the topic "${topic}".
The visual assets will be rendered separately by OpenAI gpt-image-2 at high quality.
Write precise, concrete visual descriptions suitable for a high-end children's educational illustration pipeline.
Style context: ${style || 'Cozy watercolor sketch style'}, bright pastel palettes, warm harmonious lighting, cute child-friendly textbook illustration with clean silhouettes.

Additional requirements: ${additional || 'None'}.

CRITICAL: You must return ONLY a JSON object that strictly complies with the following schema guidelines:
${schemaGuide}

Do not wrap the response in markdown code blocks like \`\`\`json. Return a raw, valid JSON string.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({
        success: false,
        message: `Gemini API 호출 오류: ${errText}`
      }, { status: response.status });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json({
        success: false,
        message: 'Gemini API로부터 응답 텍스트를 받지 못했습니다.'
      }, { status: 500 });
    }

    // 마크다운 코드 블록 (```json ... ```) 또는 공백이 섞여 돌아왔을 때 완벽하게 JSON만 발라내는 지능형 클렌징 가드
    let cleanText = rawText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    }

    try {
      const parsedData = JSON.parse(cleanText);
      return NextResponse.json({
        success: true,
        data: parsedData
      });
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        message: `API 응답 JSON 파싱 실패: ${rawText}`
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `서버 내부 오류: ${error.message}`
    }, { status: 500 });
  }
}
