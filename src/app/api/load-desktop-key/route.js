import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Windows Desktop Path: C:\Users\LG\Desktop\gemini_api_key.txt
  const keyPath = 'C:\\Users\\LG\\Desktop\\gemini_api_key.txt';

  try {
    if (fs.existsSync(keyPath)) {
      let key = fs.readFileSync(keyPath, 'utf-8').trim();
      if (key) {
        // Auto-strip prefixes like "gemini api_KEY=" or "API_KEY="
        if (key.includes('=')) {
          key = key.split('=').pop().trim();
        }

        const obfuscated = key.length > 8 
          ? key.substring(0, 4) + '...' + key.substring(key.length - 4)
          : 'Valid Key';

        return NextResponse.json({ 
          success: true, 
          key: key, 
          obfuscated: obfuscated,
          source: 'desktop'
        });
      }
    }
    
    // Fallback: Check local environment variables
    if (process.env.GEMINI_API_KEY) {
      let envKey = process.env.GEMINI_API_KEY.trim();
      if (envKey.includes('=')) {
        envKey = envKey.split('=').pop().trim();
      }

      const obfuscated = envKey.length > 8
        ? envKey.substring(0, 4) + '...' + envKey.substring(envKey.length - 4)
        : 'Valid Key';

      return NextResponse.json({
        success: true,
        key: envKey,
        obfuscated: obfuscated,
        source: 'env'
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: '바탕화면에서 gemini_api_key.txt 파일을 찾을 수 없거나 환경 변수(GEMINI_API_KEY)가 설정되어 있지 않습니다.' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: `바탕화면 키 파일을 읽는 중 오류 발생: ${error.message}` 
    });
  }
}
