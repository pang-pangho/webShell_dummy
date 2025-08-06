"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'; 
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, Star, Upload, User, Search,  Gift } from 'lucide-react'

interface User {
  id: number;
  username: string;
  email: string;
}

export default function GameShop() {
  const [uploadResult, setUploadResult] = useState("")
  const [searchResult, setSearchResult] = useState("")
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const result = await response.text()
      setUploadResult(result)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setUploadResult('업로드 실패: ' + errorMessage)
    }
  }

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('search')

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const result = await response.text()
      setSearchResult(result)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setSearchResult('검색 실패: ' + errorMessage)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setShowRegister(false);
        setShowLogin(true);
      } else {
        alert("회원가입 실패: " + result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert("회원가입 중 에러가 발생했습니다: " + errorMessage);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setCurrentUser(result.user);
        setShowLogin(false);
      } else {
        alert("로그인 실패: " + result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert("로그인 중 에러가 발생했습니다: " + errorMessage);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    alert("로그아웃되었습니다.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">DummyGame</h1>
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">PREMIUM</Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-white">
              <a href="#" className="hover:text-purple-300">홈</a>
              <a href="#" className="hover:text-purple-300">게임</a>
              <a href="#" className="hover:text-purple-300">커뮤니티</a>
              <a href="#" className="hover:text-purple-300">이벤트</a>
            </nav>
            <div className="flex items-center space-x-4">
  {currentUser ? (
    <div className="flex items-center space-x-3 text-white">
      <span>{currentUser.username}님</span>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  ) : (
    <Button variant="ghost" size="sm" className="text-white" onClick={() => setShowLogin(true)}>
      <User className="h-4 w-4 mr-2" />
      로그인
    </Button>
  )}
  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
    <ShoppingCart className="h-4 w-4 mr-2" />
    장바구니
  </Button>
</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            최고의 게임을 만나보세요
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            프리미엄 게임 컬렉션과 독점 콘텐츠
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <Input 
                name="search"
                placeholder="게임 검색..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {searchResult && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-black/30 rounded-lg">
              <pre className="text-left text-green-400 text-sm font-mono whitespace-pre-wrap">{searchResult}</pre>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Games */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">인기 게임</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: "마인크래프트", price: "₩33,000", rating: 4.9, image: "/minecraft-cover.png" },
                { name: "리그 오브 레전드", price: "무료", rating: 4.7, image: "/lol-cover.png" },
                { name: "PUBG: BATTLEGROUNDS", price: "₩39,000", rating: 4.6, image: "/pubg-cover.png" },
                { name: "Palworld", price: "₩31,000", rating: 4.8, image: "/palworld-cover.png" }
              ].map((game, index) => (
                <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
                  <CardContent className="p-0">
                  <div className="relative w-full h-48">
  <Image 
    src={game.image || "/placeholder.svg"} 
    alt={game.name}
    fill
    style={{ objectFit: 'cover' }}
    className="rounded-t-lg"
  />
</div>
                    <div className="p-4">
                      <h4 className="font-bold text-white mb-2">{game.name}</h4>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-purple-300">{game.price}</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white ml-1">{game.rating}</span>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        장바구니 담기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Content Upload */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  콘텐츠 업로드
                </CardTitle>
                <CardDescription className="text-purple-200">
                  게임 스크린샷, 모드, 세이브 파일을 공유하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="file" className="text-white">파일 선택</Label>
                    <Input 
                      id="file" 
                      name="file" 
                      type="file" 
                      className="mt-1 bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="filename" className="text-white">파일명</Label>
                    <Input 
                      id="filename" 
                      name="filename" 
                      placeholder="my_awesome_mod.zip"
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white">설명</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="파일에 대한 설명을 입력하세요..."
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    업로드
                  </Button>
                </form>
                
                {uploadResult && (
                  <div className="mt-4 p-3 bg-black/30 rounded-md">
                    <p className="text-sm font-mono text-green-400">{uploadResult}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Community Files */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">커뮤니티 파일</CardTitle>
                <CardDescription className="text-purple-200">
                  다른 유저들이 공유한 콘텐츠
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "ultimate_cheat.exe", user: "GameMaster", downloads: "1.2K" },
                    { name: "texture_pack.zip", user: "ArtistPro", downloads: "856" },
                    { name: "save_game.dat", user: "SpeedRunner", downloads: "432" },
                    { name: "mod_loader.php", user: "DevHacker", downloads: "234" }
                  ].map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-black/20 rounded">
                      <div>
                        <p className="text-white text-sm font-mono">{file.name}</p>
                        <p className="text-purple-300 text-xs">by {file.user}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-xs">{file.downloads}</p>
                        <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white">
                          다운로드
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Offers */}
            <Card className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  특별 혜택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
                      LIMITED TIME
                    </Badge>
                    <p className="text-white font-bold">신규 회원 50% 할인</p>
                    <p className="text-purple-200 text-sm">첫 구매시 최대 30,000원 할인</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" onClick={() => setShowLogin(true)}>
                    지금 가입하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold mb-4">DummyGame</h4>
              <p className="text-purple-200 text-sm">
                최고의 게임 경험을 제공하는 프리미엄 플랫폼
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">게임</h5>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li><a href="#" className="hover:text-white">액션</a></li>
                <li><a href="#" className="hover:text-white">RPG</a></li>
                <li><a href="#" className="hover:text-white">시뮬레이션</a></li>
                <li><a href="#" className="hover:text-white">스포츠</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">커뮤니티</h5>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li><a href="#" className="hover:text-white">포럼</a></li>
                <li><a href="#" className="hover:text-white">가이드</a></li>
                <li><a href="#" className="hover:text-white">리뷰</a></li>
                <li><a href="#" className="hover:text-white">이벤트</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">고객지원</h5>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">문의하기</a></li>
                <li><a href="#" className="hover:text-white">환불정책</a></li>
                <li><a href="#" className="hover:text-white">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-purple-200 text-sm">
              © 2024 DummyGame. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowLogin(false)}>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">DummyGame 로그인</h2>
              <p className="text-purple-200">계정에 로그인하여 더 많은 혜택을 받으세요</p>
            </div>
            
            {/* --- 수정: form에 handleLogin 함수 연결 --- */}
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="username" className="text-white">사용자명</Label>
                <Input 
                  id="username" 
                  name="username" 
                  placeholder="사용자명을 입력하세요"
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white">비밀번호</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                로그인
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-purple-200 text-sm mb-4">또는</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Google로 로그인
                </Button>
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Steam으로 로그인
                </Button>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-purple-200 text-sm">
                계정이 없으신가요? 
                <a href="#" className="text-purple-300 hover:text-white ml-1" onClick={(e) => {
                  e.preventDefault()
                  setShowLogin(false)
                  setShowRegister(true)
                }}>회원가입</a>
              </p>
            </div>
            
            <Button 
              variant="ghost" 
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowRegister(false)}>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">DummyGame 회원가입</h2>
              <p className="text-purple-200">새로운 계정을 만들어 게임의 세계로!</p>
            </div>
            
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <Label htmlFor="reg-username" className="text-white">사용자명 *</Label>
                <Input 
                  id="reg-username" 
                  name="username" 
                  placeholder="사용자명을 입력하세요"
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-email" className="text-white">이메일 *</Label>
                <Input 
                  id="reg-email" 
                  name="email" 
                  type="email"
                  placeholder="이메일을 입력하세요"
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-password" className="text-white">비밀번호 *</Label>
                <Input 
                  id="reg-password" 
                  name="password" 
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-confirm-password" className="text-white">비밀번호 확인 *</Label>
                <Input 
                  id="reg-confirm-password" 
                  name="confirmPassword" 
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-phone" className="text-white">전화번호</Label>
                <Input 
                  id="reg-phone" 
                  name="phone" 
                  placeholder="010-1234-5678"
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <Label htmlFor="reg-birthdate" className="text-white">생년월일</Label>
                <Input 
                  id="reg-birthdate" 
                  name="birthdate" 
                  type="date"
                  className="mt-1 bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="reg-profile-image" className="text-white">프로필 이미지</Label>
                <Input 
                  id="reg-profile-image" 
                  name="profileImage" 
                  type="file"
                  accept="image/*"
                  className="mt-1 bg-white/10 border-white/20 text-white"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="mt-1 rounded border-white/20 bg-white/10"
                    required
                  />
                  <label htmlFor="terms" className="text-purple-200 text-sm">
                    <span className="text-red-400">*</span> 이용약관 및 개인정보처리방침에 동의합니다
                  </label>
                </div>
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="marketing" 
                    className="mt-1 rounded border-white/20 bg-white/10"
                  />
                  <label htmlFor="marketing" className="text-purple-200 text-sm">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </label>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                회원가입
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-purple-200 text-sm mb-4">또는</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Google로 가입
                </Button>
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Steam으로 가입
                </Button>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-purple-200 text-sm">
                이미 계정이 있으신가요? 
                <a href="#" className="text-purple-300 hover:text-white ml-1" onClick={(e) => {
                  e.preventDefault()
                  setShowRegister(false)
                  setShowLogin(true)
                }}>로그인</a>
              </p>
            </div>
            
            <Button 
              variant="ghost" 
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={() => setShowRegister(false)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}