// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
// --- 추가: 파일 시스템(fs)과 경로(path) 제어를 위한 모듈 ---
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const filename = formData.get('filename') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const finalFilename = filename || file.name;

    // --- ✨ 핵심 수정 부분 시작 ✨ ---

    // 1. 실제 파일 내용을 버퍼(데이터 조각) 형태로 읽어옵니다.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. 파일을 저장할 실제 서버 경로를 지정합니다.
    // 'public' 폴더 하위에 저장해야 웹에서 접근할 수 있습니다.
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // 'public/uploads' 폴더가 없으면 자동으로 생성합니다.
    await mkdir(uploadDir, { recursive: true });

    const path = join(uploadDir, finalFilename);

    // 3. Buffer 데이터를 사용해 실제로 서버에 파일을 씁니다. (가장 중요한 부분!)
    await writeFile(path, buffer);

    // --- ✨ 핵심 수정 부분 끝 ✨ ---

    // 성공 메시지는 기존과 동일하게 사용합니다.
    const responseText = `업로드 완료!

파일명: ${finalFilename}
크기: ${(file.size / 1024).toFixed(2)} KB
타입: ${file.type || 'unknown'}
설명: ${description || '설명 없음'}

파일이 /uploads/${finalFilename} 경로에 저장되었습니다.
커뮤니티에서 다른 유저들과 공유할 수 있습니다!`;

    return new NextResponse(responseText);
  } catch (error) {
    // 에러 타입에 따라 더 구체적인 메시지를 반환할 수 있습니다.
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new NextResponse('업로드 실패: ' + errorMessage, { status: 500 });
  }
}