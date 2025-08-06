import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query) {
      return new NextResponse('검색어를 입력해주세요', { status: 400 })
    }

    const searchResults = `검색 결과: "${query}"

게임 목록:
- Cyber Warriors 2077 (₩59,000) ⭐4.8
- Fantasy Kingdom (₩45,000) ⭐4.9  
- Space Odyssey (₩39,000) ⭐4.7
- Racing Thunder (₩35,000) ⭐4.6

커뮤니티 파일:
- ultimate_cheat.exe (1.2K 다운로드)
- texture_pack.zip (856 다운로드)
- save_game.dat (432 다운로드)
- mod_loader.php (234 다운로드)

시스템 정보:
서버: Apache/2.4.41 (Ubuntu)
PHP: 7.4.3
업로드 디렉토리: /var/www/html/uploads/
권한: 777 (모든 사용자 읽기/쓰기/실행)`

    return new NextResponse(searchResults)
  } catch (error) {
    return new NextResponse('검색 실패: ' + error, { status: 500 })
  }
}
