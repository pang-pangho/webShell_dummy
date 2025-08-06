// execute/route.ts

import { NextRequest, NextResponse } from 'next/server';
// --- 추가: Node.js에서 시스템 명령어를 실행하기 위한 모듈 ---
import { exec } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();

    if (!command || typeof command !== 'string') {
      return new NextResponse('No command provided or invalid format', { status: 400 });
    }

    // --- ✨ 핵심 수정 부분: 실제 명령어 실행 로직 ---
    const output = await new Promise<string>((resolve, reject) => {
      // exec 함수로 실제 시스템 명령어를 실행
      exec(command, (error, stdout, stderr) => {
        if (error) {
          // 에러가 발생해도 그 에러 메시지를 결과로 보여주는 것이 학습에 도움됨
          resolve(`Error: ${error.message}\n${stderr}`);
          return;
        }
        // 표준 출력과 표준 에러를 합쳐서 결과로 반환
        resolve(stdout + stderr);
      });
    });

    return new NextResponse(output);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new NextResponse('Command execution failed: ' + errorMessage, { status: 500 });
  }
}