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

    // --- ⚠️ 취약한 부분: 비밀번호를 암호화하지 않고 그대로 저장 ---
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    // 사용자가 입력한 password를 변환 없이 그대로 사용
    const params = [username, email, password]; 

    try {
      await db.run(sql, params);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        return NextResponse.json({ message: '이미 사용 중인 아이디 또는 이메일입니다.' }, { status: 409 });
      }
      throw error;
    }
    
    return NextResponse.json({ message: '회원가입이 완료되었습니다!' }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}