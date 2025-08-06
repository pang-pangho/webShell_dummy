// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/lib/db'; // 2번에서 만든 DB 연결 함수를 가져옵니다.

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    // DB 연결을 엽니다.
    const db = await openDb();

    // ✨ 안전한 방식: SQL '틀'과 '값'을 분리
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const params = [username, password];
    
    // 쿼리를 실행합니다. db.get()은 조건에 맞는 첫 번째 행만 가져옵니다.
    const user = await db.get(sql, params);

    if (user) {
      // 실제로는 비밀번호 해싱(bcrypt) 비교가 필요합니다.
      return NextResponse.json({ message: `${user.username}님, 환영합니다!`, user });
    } else {
      return NextResponse.json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}