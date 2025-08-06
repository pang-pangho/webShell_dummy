// setup.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setup() {
  console.log('데이터베이스 설정 시작...');
  // db.ts와 동일하게 DB 파일 열기
  const db = await open({
    filename: 'mydb.sqlite',
    driver: sqlite3.Database,
  });

  // users 테이블이 없으면 생성하는 SQL 구문
  // id: 고유번호 (자동 증가)
  // username, email: 중복되지 않도록 UNIQUE 설정
  // password: 암호화된 비밀번호를 저장할 공간
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  console.log('users 테이블이 성공적으로 생성되었습니다.');

  // 테스트용 데이터 추가 (선택 사항)
  // 비밀번호는 실제로는 암호화해서 넣어야 합니다.
  await db.run(
    "INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)",
    "testuser",
    "test@example.com",
    "hashed_password_example" // 실제로는 bcrypt로 암호화된 값
  );

  console.log('테스트용 사용자가 추가되었습니다.');
  await db.close();
}

setup();