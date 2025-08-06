import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();

    if (!command || typeof command !== 'string') {
      return new NextResponse('No command provided or invalid format', { status: 400 });
    }

    const output = await new Promise<string>((resolve) => { // 'reject'를 여기서 삭제
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve(`Error: ${error.message}\n${stderr}`);
          return;
        }
        resolve(stdout + stderr);
      });
    });

    return new NextResponse(output);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new NextResponse('Command execution failed: ' + errorMessage, { status: 500 });
  }
}