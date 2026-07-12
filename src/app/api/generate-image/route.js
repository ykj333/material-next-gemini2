import { NextResponse } from 'next/server';

const IMAGE_MODEL = 'gpt-image-2';

function normalizeKey(value) {
  if (!value) return '';
  const trimmed = value.trim();
  return trimmed.includes('=') ? trimmed.split('=').pop().trim() : trimmed;
}

function imageSettings(type) {
  if (type === 'storybook') return { size: '1536x1024', aspect: 'landscape illustration' };
  if (type === 'worksheet' || type === 'pattern') return { size: '1024x1536', aspect: 'portrait A4 artwork' };
  return { size: '1024x1024', aspect: 'square educational card artwork' };
}

function buildPrompt({ type, topic, age, style, additional, item, index, storyContext }) {
  const requestedStyle = style || 'warm hand-painted watercolor and colored-pencil illustration';
  const common = `Create a production-quality ${imageSettings(type).aspect} for an early-childhood educational material.
Audience: Korean children age ${age}. Topic: ${topic}.
Visual direction: ${requestedStyle}; friendly original characters; clear focal subject; harmonious bright pastel palette; polished lighting; clean composition; age-appropriate, joyful, non-frightening, and culturally inclusive.
Keep important subjects away from edges for printing. Do not include logos, watermarks, model names, UI elements, or unreadable decorative text.`;

  if (type === 'storybook') {
    return `${common}\nFull story context: ${storyContext || topic}\nScene ${index + 1}: ${item.prompt || item.text}\nUse the same clearly defined protagonist appearance, clothing colors, proportions, and visual language throughout the series. No text inside the image.`;
  }
  if (type === 'flashcard' || type === 'puzzle') {
    return `${common}\nMain subject: ${item.kor}${item.eng ? ` (${item.eng})` : ''}. ${item.desc || ''}\nShow one unmistakable large subject centered on a simple, softly colored background. No text inside the image.`;
  }
  if (type === 'worksheet') {
    return `Create a high-resolution black-and-white coloring-page line drawing for Korean children age ${age}, topic: ${topic}. Use bold, smooth, closed outlines, large open coloring areas, simple recognizable shapes, no shading, no gray, no color, no text, no border, no watermark, and generous white space. Keep every line printable and developmentally appropriate. ${additional || ''}`;
  }
  if (type === 'pattern') {
    return `Create a high-resolution printable paper-craft pattern for Korean children age ${age}, topic: ${topic}. Use a white background, bold black solid cut lines, clearly separated red dashed fold lines, simple large pieces, safe rounded shapes, ample spacing, and an easy assembly layout. No logos, no watermark, and no tiny text. ${additional || ''}`;
  }
  return `${common}\n${additional || ''}`;
}

export async function POST(request) {
  try {
    const input = await request.json();
    const apiKey = normalizeKey(input.openAiKey || process.env.OPENAI_API_KEY);
    if (!apiKey) {
      return NextResponse.json({ success: false, message: 'gpt-image-2를 사용하려면 OpenAI API Key 또는 OPENAI_API_KEY 환경 변수가 필요합니다.' }, { status: 400 });
    }

    const settings = imageSettings(input.type);
    const prompt = buildPrompt(input);
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt,
        quality: 'high',
        size: settings.size,
        output_format: 'webp',
        output_compression: 95,
        background: 'opaque',
        n: 1
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json({ success: false, message: `OpenAI 이미지 API 오류 (${response.status}): ${errorBody}` }, { status: response.status });
    }

    const payload = await response.json();
    const base64 = payload.data?.[0]?.b64_json;
    if (!base64) throw new Error('OpenAI 이미지 API가 이미지 데이터를 반환하지 않았습니다.');

    return NextResponse.json({
      success: true,
      imageDataUrl: `data:image/webp;base64,${base64}`,
      imagePrompt: prompt,
      imageGeneration: { provider: 'OpenAI', model: IMAGE_MODEL, quality: 'high', size: settings.size, format: 'webp' }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: `이미지 생성 서버 오류: ${error.message}` }, { status: 500 });
  }
}
