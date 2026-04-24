/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  HelpCircle, 
  Mail, 
  History, 
  X, 
  ChevronRight,
  Loader2,
  Lock,
  ArrowUpRight,
  Info,
  ChevronDown,
  Layers,
  Calendar,
  Sparkles,
  Zap,
  Activity,
  LineChart,
  Target,
  Cpu,
  BarChart3,
  Globe,
  Wallet,
  Compass,
  Eye,
  EyeOff,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// 유망 섹터 카테고리 정의
const STOCK_CATEGORIES = [
  { id: 'ai_semi', label: 'AI 및 반도체 혁신주', description: '엔비디아, SK하이닉스 등 AI 패러다임 주도 기업' },
  { id: 'eco_energy', label: '이차전지 및 친환경 에너지', description: '지속 가능한 성장을 준비하는 에너지 혁신주' },
  { id: 'bio_health', label: '바이오 및 헬스케어', description: '신약 개발 및 인구 고령화 수혜 성주' },
  { id: 'value_stock', label: '저PBR 저평가 가치주', description: '탄탄한 자산과 배당 매력을 갖춘 안정주' },
  { id: 'robotics', label: '로보틱스 및 모빌리티', description: '무인화 및 자율주행 기술의 핵심 섹터' },
  { id: 'us_growth', label: '미국 빅테크 우량성장주', description: '글로벌 시장을 지배하는 초거대 기술 기업' },
  { id: 'dividend', label: '고배당 방어주', description: '시장 하락기에도 안정적인 현금 흐름을 제공하는 주식' },
  { id: 'turnaround', label: '고수 추천: 사이클 턴어라운드', description: '실적 개선이 기대되는 기저 효과 및 적자 탈출 종목' },
  { id: 'activism', label: '고수 추천: 지배구조 및 행동주의', description: '거버넌스 개선 및 주주 환원 확대 가능성 종목' },
  { id: 'small_deep', label: '고수 추천: 스몰캡 딥밸류', description: '시장에서 소외된 저평가 알짜 중소형주 발굴' },
  { id: 'commodity', label: '고수 추천: 인플레이션 헤지', description: '원자재 가격 상승 및 경기 사이클 수혜 섹터' }
];

// AI 수익 극대화 전략 데이터
const AI_STRATEGY_TIPS = [
  { title: "비체계적 위험과 체계적 위험 구분", desc: "AI는 개별 기업의 리스크(비체계적) 분석에 탁월합니다. 다만, 시장 전체의 폭락(체계적)은 별도로 체크해야 합니다.", icon: <Target className="w-5 h-5 text-blue-500" /> },
  { title: "AI 분석 결과의 선행성 체크", desc: "AI가 제시한 저평가 근거가 현재 주가에 이미 반영되었는지, 아니면 아직 시장이 모르는 정보인지 판단하세요.", icon: <Activity className="w-5 h-5 text-emerald-500" /> },
  { title: "분할 매수 및 보유 기간 준수", desc: "추천주를 한 번에 매수하기보다, 설정한 매도 시점까지 3~5회 나누어 분할 매수하는 것이 수익률 방어에 유리합니다.", icon: <Calendar className="w-5 h-5 text-amber-500" /> },
  { title: "목표 수익률 도달 시 기계적 매도", desc: "AI의 목표가에 도달했다면 탐욕을 버리고 비중을 축소하여 수익을 확정 짓는 습관을 기르세요.", icon: <TrendingUp className="w-5 h-5 text-rose-500" /> }
];

// Patch Notes 데이터
const PATCH_NOTES = [
  {
    version: "v2.6.0",
    date: "2026-04-24",
    changes: [
      "실시간 API 사용 비용 계산기 추가 (KRW 단위)",
      "API 키 시각화 제어(눈동자 버튼) 기능 도입",
      "보안 강화를 위한 로컬 저장소 세션 유지 정책 적용"
    ]
  },
  {
    version: "v2.5.0",
    date: "2026-04-24",
    changes: [
      "투자 책임 고지 및 면책 조항 문구 추가",
      "UI 하단 안내 레이아웃 최적화"
    ]
  },
  {
    version: "v2.4.0",
    date: "2026-04-24",
    changes: [
      "투자 터미널 스타일의 레이아웃 전면 개편",
      "실시간 날짜 반영 TODAY'S PULSE 고도화",
      "주식 전문 로고 및 심볼(LineChart)로 교체",
      "AI 수익 극대화 전략 시각적 아이콘 적용"
    ]
  },
  {
    version: "v2.3.0",
    date: "2026-04-24",
    changes: [
      "전문 용어 해설 기능 추가 (초보자 배려)",
      "분석 보고서 가독성 및 시각적 강조 효과 강화",
      "AI 리서치 추론 모델 정밀도 향상"
    ]
  },
  {
    version: "v2.2.0",
    date: "2026-04-24",
    changes: [
      "주식 고수용 전문 투자 테마(턴어라운드, 행동주의 등) 추가",
      "AI 투자 수익 극대화 전략 섹터 신설",
      "UI 레이아웃 최적화를 통한 분석 결과 몰입도 향상"
    ]
  },
  {
    version: "v2.1.0",
    date: "2026-04-24",
    changes: [
      "매도 시기(년/월) 선택 기능 추가",
      "매도 시점 기반 저평가 우량주 추천 엔진 탑재",
      "사용자 경험 중심의 UI 인터랙션 개선"
    ]
  },
  {
    version: "v2.0.0",
    date: "2026-04-24",
    changes: [
      "초보자 맞춤형 섹터 추천 시스템 도입",
      "종목 직접 검색 방식에서 카테고리 선택 방식으로 변경",
      "오늘 날짜 기준 실시간 유망 종목 발굴 엔진 고도화",
      "매수/비추천 의견 가이드라인 명확화"
    ]
  },
  {
    version: "v1.2.0",
    date: "2026-04-24",
    changes: [
      "매수 추천/비추천 상태 명시 기능 추가",
      "오늘 날짜 기준 실시간 분석 엔진 고도화"
    ]
  }
];

// 사용 방법 가이드 데이터
const USAGE_STEPS = [
  { id: 1, text: "우측 상단 API 상태 버튼을 눌러 API 키가 적용되었는지 확인하세요." },
  { id: 2, text: "분석할 주식 시장(국내/미국)을 선택하세요." },
  { id: 3, text: "전망이 궁금한 주식 테마/섹터를 드롭다운에서 선택하세요." },
  { id: 4, text: "원하시는 매도 시기(년도 및 월)를 설정하세요." },
  { id: 5, text: "'오늘의 추천주 분석 시작' 버튼을 눌러 AI 스캔을 시작하세요." },
  { id: 6, text: "설정한 매도 시점에 가장 적합한 저평가 추천 종목과 상세 근거를 확인하세요." }
];

export default function App() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('GEMINI_API_KEY') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showCostInfo, setShowCostInfo] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  
  const [market, setMarket] = useState<'KOREA' | 'US'>('KOREA');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const [sellYear, setSellYear] = useState<string>(new Date().getFullYear().toString());
  const [sellMonth, setSellMonth] = useState<string>((new Date().getMonth() + 1).toString());
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeenUsage = localStorage.getItem('HAS_SEEN_USAGE');
    if (!hasSeenUsage) {
      setShowUsage(true);
      localStorage.setItem('HAS_SEEN_USAGE', 'true');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('GEMINI_API_KEY', key);
    setShowKeyInput(false);
    setError(null);
  };

  const getActiveApiKey = () => {
    return apiKey || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') || '';
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 400);
    return interval;
  };

  const currentCategory = STOCK_CATEGORIES.find(c => c.id === selectedCategoryId);

  const handleAnalysis = async () => {
    const activeKey = getActiveApiKey();
    if (!activeKey) {
      setError('분석을 시작하려면 API Key가 필요합니다. 상단에서 인증을 완료해주세요.');
      return;
    }

    if (!selectedCategoryId) {
      setError('분석할 테마 섹터를 선택해주세요.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    const progressInterval = simulateProgress();

    try {
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const today = new Date().toLocaleDateString('ko-KR');

      const prompt = `
        오늘 날짜: ${today}
        선택된 시장: ${market === 'KOREA' ? '국내(KOSPI/KOSDAQ)' : '미국(NYSE/NASDAQ)'}
        선택된 섹터: ${currentCategory?.label}
        희망 매도 시기: ${sellYear}년 ${sellMonth}월

        당신은 금융권 최고 수준의 추론 능력을 가진 '금융 특화 혁신 AI 리서처'입니다. 
        모든 데이터는 철저히 팩트와 최신 시장 동향에 기반하여 심도 있게 분석하십시오. 
        사용자는 주식 초보자이므로 가독성이 매우 중요합니다.

        [분석 지침]
        1. 안내된 '오늘 날짜'를 기준으로 실시간 시장 데이터를 반영하여 분석하십시오.
        2. 해당 섹터 내에서 현재 실질 가치 대비 현저히 '저평가'된 종목을 타겟팅하십시오.
        3. 단순 정보 전달이 아닌, 고도의 금융 추론을 통해 미래 가치를 산출하십시오.

        [출력 스타일 규칙 (필수)]
        아래의 커스텀 태그를 사용하여 텍스트에 스타일을 입히십시오:
        - 추천되는 주식명은 반드시 [S]주식명[/S] 태그로 감싸십시오. (빨간색 텍스트로 표시됩니다)
        - 핵심 요약이나 매우 중요한 수치는 [H]내용[/H] 태그로 감싸십시오. (노란색 배경으로 강조됩니다)
        - 전문적인 인사이트나 긍정적인 전망은 [B]내용[/B] 태그로 감싸십시오. (파란색 텍스트로 표시됩니다)
        - 소제목은 [T]제목[/T] 태그로 감싸십시오.
        - 일반 텍스트에는 마크다운(#, *, - 등)을 절대 사용하지 마십시오.

        [보고서 구조]
        - [T]오늘의 혁신 AI 발굴 종목[/T] : 추천주 및 투자 의견
        - [T]팩트 기반 기업 분석[/T] : 기업의 현재 시장 지위 및 밸류에이션
        - [T]저평가 심층 추론 근거[/T] : 왜 지금 저평가인지, 어떤 비체계적 위험이 해소되고 있는지 분석
        - [T]리스크 및 유의사항[/T] : 초보자가 반드시 알아야 할 변수
        - [T]향후 엑시트 전략[/T] : 매도 시기(${sellYear}년 ${sellMonth}월)까지의 대응 시나리오 및 목표 수익 전망
        - [T]혁신 AI 금융 용어 사전[/T] : 보고서에 사용된 어려운 전문 용어들을 초보자 눈높이에서 아주 쉽게 개별적으로 설명 (예: PBR, 밸류에이션, 모멘텀 등)

        최소 800자 이상 매우 상세하게 한국어로 작성하십시오.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text || "분석 결과를 생성하지 못했습니다.";
      
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setResult(text);
        setIsAnalyzing(false);
      }, 500);

    } catch (err: any) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setError(err.message || '분석 중 기술적 오류가 발생했습니다.');
    }
  };

  /**
   * 커스텀 태그를 해석하여 스타일링된 JSX로 변환하는 컴포넌트
   */
  const FormattedText = ({ text }: { text: string }) => {
    if (!text) return null;

    // 정규식을 사용하여 태그별로 텍스트 분할
    // [T]제목[/T], [S]주식[/S], [H]강조[/H], [B]파랑[/B]
    const parts = text.split(/(\[T\].*?\[\/T\]|\[S\].*?\[\/S\]|\[H\].*?\[\/H\]|\[B\].*?\[\/B\])/g);

    return (
      <div className="space-y-4">
        {parts.map((part, index) => {
          if (part.startsWith('[T]')) {
            return (
              <h4 key={index} className="text-xl font-black text-white border-l-4 border-blue-600 pl-4 py-1 mt-8 mb-4">
                {part.replace(/\[\/?T\]/g, '')}
              </h4>
            );
          }
          if (part.startsWith('[S]')) {
            return (
              <span key={index} className="text-red-500 font-black text-lg underline decoration-red-500/30 underline-offset-4">
                {part.replace(/\[\/?S\]/g, '')}
              </span>
            );
          }
          if (part.startsWith('[H]')) {
            return (
              <span key={index} className="bg-yellow-400 text-slate-950 px-1.5 py-0.5 rounded font-bold mx-0.5 shadow-sm">
                {part.replace(/\[\/?H\]/g, '')}
              </span>
            );
          }
          if (part.startsWith('[B]')) {
            return (
              <span key={index} className="text-blue-400 font-bold">
                {part.replace(/\[\/?B\]/g, '')}
              </span>
            );
          }
          return (
            <span key={index} className="whitespace-pre-line text-slate-300 leading-relaxed">
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  // 복제 방지
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      if (resultRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };
    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-white/10 shadow-2xl">
              <LineChart className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              혁신 주식 <span className="px-1.5 py-0.5 bg-blue-600 rounded text-[10px] italic">AI TERMINAL</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Quantum Research Lab</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <button 
              onClick={() => setShowCostInfo(!showCostInfo)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-white/5 rounded-lg hover:border-amber-500/50 transition-all"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden md:block">API Cost</span>
            </button>

            {showCostInfo && (
              <div className="absolute top-12 right-0 w-80 p-6 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl z-[60] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Estimate API Costs (KRW)</h3>
                  <button onClick={() => setShowCostInfo(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-white/5 shadow-inner">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-slate-500 font-bold">1회 분석 평균 소모</span>
                      <span className="text-amber-500 font-black text-xs">약 0.5 ~ 1.2원</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[15%]"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                      <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Input (1K Token)</p>
                      <p className="text-white font-black text-[10px]">약 0.11원</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                      <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Output (1K Token)</p>
                      <p className="text-white font-black text-[10px]">약 0.42원</p>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-500 font-medium italic leading-relaxed text-center">
                    * Gemini 1.5 Flash 모델 기준 (1 USD = 1,400 KRW 환산)<br/>
                    * 1회 분석 시 약 1,500 ~ 2,500 토큰 소모
                  </p>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowPatchNotes(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            패치노트
          </button>
          <button 
            onClick={() => setShowUsage(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            사용방법
          </button>
          <div className="relative">
            <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 mr-2 uppercase font-bold">API 상태</span>
              <div className={`w-2 h-2 rounded-full mr-2 shadow-[0_0_8px_rgba(16,185,129,0.6)] ${
                getActiveApiKey() ? 'bg-emerald-500' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
              }`}></div>
              <button 
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-xs text-slate-300 font-medium hover:text-white"
              >
                {getActiveApiKey() ? '••••••••••••' : '인증 필요'}
              </button>
            </div>
            
            {showKeyInput && (
              <div className="absolute top-12 right-0 w-80 p-5 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl z-[60] backdrop-blur-xl">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Google AI Tunnel Auth</h3>
                <div className="relative mb-4">
                  <input 
                    type={showApiKey ? "text" : "password"}
                    placeholder="Gemini API 키를 입력하세요"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <button 
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-slate-200"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" /> }
                  </button>
                </div>
                <button 
                  onClick={() => saveApiKey(apiKey)}
                  className="w-full bg-blue-600 text-white text-[10px] font-black py-3.5 rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] uppercase tracking-widest"
                >
                  인증 토큰 갱신 및 저장
                </button>
                <p className="mt-3 text-[9px] text-slate-500 text-center font-bold italic">
                  * API 키는 브라우저 로컬 저장소에 안전하게 영구 보관됩니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-8 max-w-5xl mx-auto">
        {/* 히어로 섹션 */}
        <div className="relative w-full aspect-[21/9] md:aspect-[16/6] max-h-[450px] rounded-3xl overflow-hidden mb-12 shadow-[0_0_50px_-12px_rgba(30,58,138,0.3)] border border-white/5">
          <div className="absolute inset-0 bg-slate-950 overflow-hidden">
            {/* 배경 그리드 및 노이즈 효과 */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 mix-blend-overlay"></div>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            
            {/* 그라데이션 광군 */}
            <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px]"></div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Operational</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 italic leading-none">
                혁신 주식 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">AI</span>
              </h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-slate-400">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/50 rounded-xl border border-white/5 backdrop-blur-md">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold tracking-tight text-slate-200">
                    <span className="text-slate-500 mr-2 uppercase text-[10px]">Today's Pulse :</span>
                    {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                  </span>
                </div>
                
                <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-slate-500">
                  <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> NY/KR REALTIME</div>
                  <div className="flex items-center gap-1.5"><Cpu className="w-3 h-3" /> QUANTUM ENGINE 4.0</div>
                </div>
              </div>
            </motion.div>

            {isAnalyzing && (
              <div className="absolute bottom-10 inset-x-8 flex items-center gap-6">
                <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden blur-[0.5px]">
                  <motion.div 
                    className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">실시간 스캐닝 중:</span>
                  <span className="text-sm font-mono text-blue-400 font-bold px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">{Math.round(progress)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
          {/* 입력 패널 */}
          <section className="lg:col-span-4 bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 flex flex-col gap-8 h-fit sticky top-24 shadow-2xl">
            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              TERMINAL CONFIGURATION
            </h3>
            
            <div className="space-y-6">
              <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 shadow-inner">
                <label className="block text-[10px] uppercase font-black text-slate-500 tracking-[0.15em] mb-4">Market Scope</label>
                <div className="flex gap-2">
                  {(['KOREA', 'US'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMarket(m)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                        market === m 
                          ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/40' 
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {m === 'KOREA' ? '국내 주식' : '미국 주식'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50" ref={dropdownRef}>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">유망 섹터 테마 선택</label>
                <div className="relative">
                  <button 
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-left flex items-center justify-between text-sm transition-all hover:border-slate-500"
                  >
                    <span className={selectedCategoryId ? 'text-white font-bold' : 'text-slate-500'}>
                      {currentCategory ? currentCategory.label : '분류를 선택하세요'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-14 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[50] max-h-80 overflow-y-auto custom-scrollbar"
                      >
                        {STOCK_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategoryId(cat.id);
                              setShowCategoryDropdown(false);
                            }}
                            className="w-full px-5 py-4 text-left hover:bg-white/5 transition-colors group border-b border-white/5 last:border-none"
                          >
                            <div className="flex items-center gap-3">
                              <Layers className={`w-4 h-4 ${selectedCategoryId === cat.id ? 'text-blue-500' : 'text-slate-600'}`} />
                              <div>
                                <p className={`text-sm font-bold ${selectedCategoryId === cat.id ? 'text-blue-500' : 'text-white'}`}>{cat.label}</p>
                                <p className="text-[10px] text-slate-500 mt-1">{cat.description}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">희망 매도 시기 설정</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <select 
                      value={sellYear} 
                      onChange={(e) => setSellYear(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      {[2026, 2027, 2028, 2029, 2030, 2035].map(year => (
                        <option key={year} value={year}>{year}년</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <select 
                      value={sellMonth} 
                      onChange={(e) => setSellMonth(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>{month}월</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 italic">* 해당 시점까지 보유하기 적합한 저평가주를 추천합니다.</p>
              </div>
            </div>

            <button 
              disabled={isAnalyzing}
              onClick={handleAnalysis}
              className={`w-full group relative overflow-hidden py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                isAnalyzing 
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] active:scale-[0.98]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  스캔 중...
                </>
              ) : (
                <>
                  오늘의 추천주 분석 시작
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            {error && <p className="text-red-400 text-[10px] text-center font-bold animate-pulse uppercase tracking-tighter">{error}</p>}
          </section>

          {/* 결과 디스플레이 */}
          <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shadow-xl overflow-hidden min-h-[500px]">
            <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                AI 유망 종목 분석 결과
              </h3>
              {result && <span className="text-[10px] font-mono text-slate-600 tracking-tighter">발행 일시: {new Date().toLocaleTimeString()}</span>}
            </header>

            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <div 
                      ref={resultRef}
                      className="text-slate-300 leading-relaxed text-sm lg:text-base font-medium select-none bg-slate-800/30 p-8 rounded-xl border border-slate-700/30"
                      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <Lock className="absolute top-6 right-6 w-4 h-4 text-slate-700 opacity-50" />
                      <FormattedText text={result} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                  >
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center mb-6">
                      <TrendingUp className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-sm font-medium tracking-wide">궁금한 섹터 테마를 선택한 후 분석 시퀀스를 시작하십시오.</p>
                    <p className="text-[10px] uppercase mt-2 text-slate-500 tracking-[0.2em] font-mono font-bold italic">Innovation Stock Scan System v2.0</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <section className="mt-12 bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white italic tracking-tight">혁신 AI 수익 극대화 전략</h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">AI를 활용한 성공적인 투자의 핵심 프로토콜</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_STRATEGY_TIPS.map((tip, idx) => (
              <div key={idx} className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-all group backdrop-blur-sm">
                <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center mb-5 ring-1 ring-white/10 group-hover:ring-blue-500/50 transition-all shadow-inner">
                  {tip.icon}
                </div>
                <h4 className="text-white font-bold text-sm mb-3 group-hover:text-blue-400 transition-colors tracking-tight">{tip.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-medium opacity-80">{tip.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <Info className="w-6 h-6 text-rose-500 shrink-0" />
            <div className="text-xs font-medium text-slate-400 leading-relaxed">
              혁신 주식AI는 주식 투자에 대한 <span className="text-rose-400 font-bold">참고용</span>으로 활용하시길 바랍니다.
              모든 분석 데이터는 AI의 추론 결과이며 실제 시장 상황과 다를 수 있습니다.
              <br className="hidden md:block" />
              투자에 대한 <span className="text-rose-400 font-bold underline underline-offset-2">책임은 전적으로 본인</span>에게 있습니다.
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 z-50 px-8 flex items-center justify-between">
        <div className="text-xs text-slate-500 flex items-center gap-3">
          <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 font-bold uppercase">개발자</span>
          <span className="font-bold text-slate-200 tracking-tight text-sm">정혁신</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter text-center max-w-md">
          혁신 주식AI는 참고용이며, 투자 책임은 전적으로 본인에게 있습니다.
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowInquiry(true)}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-tight"
          >
            오류 및 유지보수 문의
          </button>
          
          <a 
            href="https://hyeoksinai.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black rounded-full shadow-lg shadow-blue-900/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            혁신AI 플랫폼 바로가기
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </footer>

      <AnimatePresence>
        {/* 모달: 사용방법 */}
        {showUsage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
             <div className="max-w-md w-full bg-slate-900 rounded-[2rem] border border-slate-800 p-10 relative shadow-2xl">
              <button 
                onClick={() => setShowUsage(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors border border-slate-700"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

              <div className="mb-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white italic tracking-tighter">사용 가이드 (초보자용)</h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">오늘의 투자 제안 프로토콜</p>
              </div>

              <div className="space-y-5">
                {USAGE_STEPS.map((step) => (
                  <div key={step.id} className="flex gap-4">
                    <span className="text-xs font-mono text-blue-500 font-black">{step.id} /</span>
                    <p className="text-slate-300 text-[13px] font-medium leading-relaxed">{step.text}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowUsage(false)}
                className="w-full mt-10 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-slate-700"
              >
                혁신 분석 시작하기
              </button>
            </div>
          </motion.div>
        )}

        {/* 모달: 패치노트 */}
        {showPatchNotes && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <div className="max-w-2xl w-full bg-slate-900 rounded-[2.5rem] border border-slate-800 p-12 relative shadow-2xl max-h-[85vh] flex flex-col">
              <button 
                onClick={() => setShowPatchNotes(false)}
                className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors border border-slate-700"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="mb-10 shrink-0">
                <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">패치 노트</h2>
                <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                <div className="space-y-16">
                  {PATCH_NOTES.map((note) => (
                    <div key={note.version} className="relative pl-10 border-l border-slate-800/50">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                      <div className="flex items-end gap-3 mb-6">
                        <span className="text-3xl font-black text-white tracking-widest italic">{note.version}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1.5">{note.date}</span>
                      </div>
                      <ul className="space-y-4">
                        {note.changes.map((change, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-400">
                            <div className="w-1 h-1 rounded-full bg-blue-500/50 mt-2 shrink-0"></div>
                            <span className="text-sm font-medium leading-relaxed">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 모달: 문의 */}
        {showInquiry && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[110] flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-600/20">
                <Info className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">시스템 문의 및 지원</h2>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-6">유지보수 프로토콜</p>
              
              <div className="bg-slate-950/50 rounded-2xl p-6 text-slate-400 text-sm leading-relaxed mb-8 text-left border border-slate-800">
                <p>시스템에 오류가 있거나 업데이트가 필요할 경우 아래 이메일로 상세 내용을 작성하여 보내주세요.</p>
                <div className="mt-5 p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between group">
                  <span className="font-mono text-blue-400 text-sm select-all">info@nextin.ai.kr</span>
                  <button 
                    onClick={() => {
                       navigator.clipboard.writeText('info@nextin.ai.kr');
                       alert('이메일 주소가 복사되었습니다.');
                    }}
                    className="text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    이메일 복사
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setShowInquiry(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors border border-slate-700"
              >
                닫기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}
