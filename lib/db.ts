import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

// DB 연결 인스턴스를 저장할 전역 변수
let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

// 수정된 openDb 함수
export async function openDb() {
  // 이미 연결된 인스턴스가 있으면 그것을 바로 반환
  if (db) {
    return db;
  }
  
  // 없으면 새로 생성
  const newDbInstance = await open({
    filename: path.join(process.cwd(), 'mydb.sqlite'),
    driver: sqlite3.Database,
  });

  // 생성된 인스턴스를 전역 변수에 저장하여 재사용
  db = newDbInstance;
  return db;
}