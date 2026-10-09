// CHAISA 케이스스터디는 원본에 한국어 문구만 있어서, 영어 페이지용 번역을 여기 모았다.
// 한국어 원문이 열쇠다. 컴포넌트는 tr('원문') 으로 감싸기만 하고, 번역이 없으면 원문이 그대로 나온다.
// 제품 화면·캠페인 게시물 안의 글자는 실제 서비스(한국어) 그대로 두고 번역하지 않는다.
import type { Locale } from '@studio/lib/ia'

let current: Locale = 'ko'

/** ChaisaCaseStudy 가 그리기 직전에 한 번 부른다. */
export function setLocale(locale: Locale) {
  current = locale
}

export function tr(ko: string): string {
  return current === 'en' ? (EN[ko] ?? ko) : ko
}

export function slideLabel(index: number, total: number): string {
  return current === 'en' ? `Slide ${index} of ${total}` : `전체 ${total}개 중 ${index}번째 콘텐츠`
}

const EN: Record<string, string> = {
  '차이사 비주얼 무드 — 블루 카 디테일':
    'CHAISA visual mood — blue car detail',
  '홈':
    'Home',
  '견적 요청':
    'Quote request',
  '커뮤니티':
    'Community',
  '서비스 선택부터 무료 견적까지, 한 화면에서 시작합니다.':
    'From choosing a service to a free quote, it all starts on one screen.',
  '차량 정보·일정·서비스·지역을 한 흐름으로 입력합니다.':
    'Vehicle, schedule, service, and location are entered in a single flow.',
  '시공 후기와 차량 정보를 나누는 공간으로 이어집니다.':
    'It leads into a space for sharing service reviews and car knowledge.',
  '차이사 홈 화면':
    'CHAISA home screen',
  '차이사 견적 요청':
    'CHAISA quote request',
  '차이사 커뮤니티 화면':
    'CHAISA community screen',
  '간편함과 신뢰, 그리고 친근함 사이':
    'Between ease, trust, and friendliness',
  '차량 서비스는 전문성과 신뢰가 필요하지만, 차주에게는 어렵고 부담스럽게 느껴지기 쉽습니다. 전문성은 지키되 간편하고 친근한 인상으로 그 거리감을 좁히는 무드를 찾았습니다.':
    'Car services call for expertise and trust, yet they often feel difficult and intimidating to car owners. We looked for a mood that keeps the expertise while closing that distance with an easy, friendly impression.',
  '짙은 블루의 신뢰감, 군더더기 없는 명료함, 광택 있는 프리미엄 질감, 그리고 차를 연상시키는 민첩한 동물 치타 — 그 민첩함은 로고의 스피드 라인이 되어, 빠르고 간편한 견적 경험을 드러냅니다.':
    'The trust of deep blue, clarity with nothing extra, a glossy premium texture, and the cheetah, an agile animal that calls a car to mind — that agility becomes the speed lines in the logo, expressing a fast and easy quote experience.',
  '짙은 블루의 신뢰감':
    'The trust of deep blue',
  '깊은 블루 빛이 겹쳐진 추상 이미지':
    'Abstract image of layered deep blue light',
  '광택 있는 프리미엄 질감':
    'A glossy premium texture',
  '밝은 스튜디오에 전시된 광택 있는 검은색 자동차':
    'A glossy black car on display in a bright studio',
  '차를 연상시키는 민첩한 동물, 치타':
    'The cheetah, an agile animal that calls a car to mind',
  '초원을 질주하는 치타':
    'A cheetah sprinting across a grassland',
  '군더더기 없는 명료함':
    'Clarity with nothing extra',
  '푸른 빛의 대각선 라인이 교차하는 추상 이미지':
    'Abstract image of crossing diagonal blue lines',
  '내 차 걱정, 이제 안 하셔도 됩니다.':
    'No more worrying about your car.',
  '견적부터 시공까지 — 차이사가 함께합니다.':
    'From quote to service — CHAISA is with you.',
  '자동차 도장 전문가가 차량 외장에 색상을 분사하는 모습':
    'A car painting specialist spraying color onto a vehicle body',
  '문제에서 시작한 설계':
    'Design that starts from the problem',
  '복잡한 과정을 명료하게,':
    'Complex steps made clear,',
  '낯선 서비스를 친근하게':
    'an unfamiliar service made friendly',
  '차이사의 색과 타이포그래피는 신뢰감과 친근함을 일관되게 전합니다.':
    'CHAISA\'s color and typography consistently convey trust and friendliness.',
  '제목과 본문 전반에 사용':
    'Used across headings and body text',
  '업체 검색':
    'Finding shops',
  '필요한 업체를 채널마다 하나씩 찾기':
    'Searching for the right shop one channel at a time',
  '한 번에 연결':
    'Connected at once',
  '한 번의 요청으로 맞는 업체 연결':
    'One request connects you to the right shops',
  '가격 비교':
    'Comparing prices',
  '가격·조건을 같은 기준으로 보기 어려움':
    'Hard to see prices and terms on the same basis',
  '한눈에 비교':
    'Compare at a glance',
  '같은 기준으로 정리된 견적':
    'Quotes organized on the same basis',
  '후기 확인':
    'Checking reviews',
  '후기·업체 정보가 여러 채널에 분산':
    'Reviews and shop details scattered across channels',
  '한곳에 모아보기':
    'All in one place',
  '업체 정보·후기를 한 화면에':
    'Shop details and reviews on one screen',
  '반복 문의':
    'Repeated inquiries',
  '같은 조건을 여러 업체에 다시 설명':
    'Explaining the same requirements to each shop again',
  '한 번만 입력':
    'Enter it once',
  '조건은 한 번만 입력하면 완료':
    'Enter your requirements once and you are done',
  '차이사 로고':
    'CHAISA logo',
  '내 차 견적을 간편하게 받고 합리적으로 비교하는 차이사 안내':
    'CHAISA post: get quotes for your car easily and compare them sensibly',
  '회원가입 없이 무료로 받는 차이사 차량 견적 안내':
    'CHAISA post: free car quotes with no sign-up',
  '평균 28분 안에 직접 연락하는 차이사 빠른 응답 안내':
    'CHAISA post: fast responses, with a direct call within 28 minutes on average',
  '검증된 전문 업체를 무료로 매칭하는 차이사 안내':
    'CHAISA post: free matching with verified specialist shops',
  '차타 이사님 캠페인 콘텐츠':
    'Director Chata campaign content',
  '차량 케어 서비스 플랫폼, 차이사':
    'CHAISA, a car care service platform',
  '여러 채널에 흩어진 차량 전문 서비스 탐색과 견적 비교를 한 번의 요청으로 연결했습니다. CHAISA는 차주가 모바일 웹에서 필요한 서비스와 조건을 입력하면 관련 전문 업체를 연결하고 견적을 비교할 수 있게 돕는 플랫폼입니다.':
    'Finding specialist car services and comparing quotes used to be scattered across many channels; we connected them in a single request. CHAISA is a platform where car owners enter the service and requirements they need on the mobile web, get connected to relevant specialist shops, and compare quotes.',
  '이 케이스는 브랜드 아이덴티티부터 제품 경험까지를 하나의 흐름으로 담았습니다. 로고·캐릭터·비주얼 시스템으로 신뢰와 친근함을 세우고, 그 언어를 UX/UI 설계와 구현으로 이어 하나의 제품으로 완성했습니다.':
    'This case covers everything from brand identity to product experience as one flow. The logo, character, and visual system establish trust and friendliness, and that language carries through UX/UI design and implementation into a single finished product.',
  '차이사 행잉 배너 애플리케이션':
    'CHAISA hanging banner application',
  '밝은 전시장 천장에 매달린 차이사 자동차 도장 서비스 배너':
    'CHAISA car painting service banners hanging from the ceiling of a bright showroom',
  '차이사 커브드 빌보드 애플리케이션':
    'CHAISA curved billboard application',
  '자동차 보호 필름 시공 장면을 담은 차이사 대형 커브드 빌보드':
    'A large curved CHAISA billboard showing paint protection film being applied',
  '차이사 듀얼 빌보드 애플리케이션':
    'CHAISA dual billboard application',
  '어두운 전시장에 설치된 차이사 타이어와 자동차 정비 듀얼 빌보드':
    'CHAISA dual billboards for tires and car maintenance in a dark showroom',
  '래핑 시공 후':
    'after wrapping',
  '틴팅 시공 후':
    'after tinting',
  'PPF 시공 후':
    'after PPF',
  '속도를 새긴 로고타입':
    'A logotype with speed built in',
  '치타의 민첩함에서 온 스피드 라인을 글자에 심어, 멈춰 있어도 질주하는 로고타입을 만들었습니다. 기하학 그리드 위에서 비례와 기울기를 다듬어 역동성과 정제된 완성도를 함께 잡았습니다.':
    'Speed lines drawn from the cheetah\'s agility are set into the letters, creating a logotype that races even when standing still. Proportion and slant were refined on a geometric grid to capture both dynamism and polish.',
  '차이사 로고 컨스트럭션과 브랜드 애플리케이션':
    'CHAISA logo construction and brand applications',
  '차이사 로고 컨스트럭션 — 스피드 라인과 그리드 가이드':
    'CHAISA logo construction — speed lines and grid guides',
  '차이사 크롬 브라우저 탭·주소창 목업':
    'CHAISA Chrome browser tab and address bar mockup',
  '차이사 블랙 명함 목업 — 이름·직함·연락처 면':
    'CHAISA black business card mockup — name, title, and contact side',
  '007AFF 블루 빛의 궤적을 따라 달리는 자동차':
    'A car racing along a trail of 007AFF blue light',
  '치타의 질주 궤적이 스피드 라인이 되고,':
    'The cheetah\'s sprint becomes the speed lines,',
  '다음 장면의 캐릭터로 이어집니다.':
    'and leads on to the character in the next scene.',
  '차를 잘 아는 든든한 안내자,':
    'A dependable guide who knows cars,',
  '차타 이사님':
    'Director Chata',
  '복잡하게 느껴지는 차량 서비스 과정을 친근하고 명확하게 안내합니다.':
    'He guides people through car services that feel complicated, in a friendly and clear way.',
  '차타 이사님 메인 비주얼':
    'Director Chata main visual',
  '엄지를 들고 인사하는 차타 이사님 캐릭터':
    'The Director Chata character giving a thumbs up',
  'CHAISA — 자동차 애프터마켓 서비스 플랫폼 케이스 스터디':
    'CHAISA — automotive aftermarket service platform case study',
  '차이사 빌보드 — The Right Choice for Your Car':
    'CHAISA billboard — The Right Choice for Your Car',
  '차이사 모바일 홈과 소셜 프로필 UI':
    'CHAISA mobile home and social profile UI',
  '손에 든 차이사 모바일 홈 화면과 차이사 소셜 프로필 카드':
    'A hand holding the CHAISA mobile home screen, next to a CHAISA social profile card',
  '차이사 클로징 비주얼':
    'CHAISA closing visual',
  '검은 스포츠카가 검정, 회색, 블루 색상 구간을 가로질러 달리는 모습':
    'A black sports car racing across bands of black, gray, and blue',
  '차이사':
    'CHAISA',
}
