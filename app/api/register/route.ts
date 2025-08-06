import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, confirmPassword } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: '필수 정보를 입력해주세요' }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ message: '비밀번호가 일치하지 않습니다' }, { status: 400 });
    }

    const db = await openDb();

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const params = [username, email, password]; 

    try {
      await db.run(sql, params);
    } catch (error: unknown) { // any를 unknown으로 수정
      // unknown 타입의 에러를 안전하게 처리하는 로직 추가
      if (error && typeof error === 'object' && 'code' in error && error.code === 'SQLITE_CONSTRAINT') {
        return NextResponse.json({ message: '이미 사용 중인 아이디 또는 이메일입니다.' }, { status: 409 });
      }
      throw error;
    }
    
    return NextResponse.json({ message: '회원가입이 완료되었습니다!' }, { status: 201 });

  } catch (error: unknown) { // any를 unknown으로 수정
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: `서버 에러가 발생했습니다: ${errorMessage}` }, { status: 500 });
  }
}