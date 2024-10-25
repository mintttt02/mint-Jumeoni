/**
 * https://mabinogi.nexon.com/page/news/notice_view.asp?id=4892277
 */

const API_KEY = "test_c955fe18187f95a80c1abf6099f541392eddf1d187655cd628f7f0bea9805241efe8d04e6d233bd35cf2fabdeb93fb0d";

const host = "https://open.api.nexon.com";
const urlNpc = "/mabinogi/v1/npcshop/list?";

const LuteMaxChannel = 44;
const MandalinMaxChannel = 15;
const HarpMaxChannel = 15;
const WolfMaxChannel = 15;

const npcArr = [
      {'npcNm' : '상인 라누', 'location' : '반호르'}
    , {'npcNm' : '상인 피루', 'location' : '벨바스트'}
    , {'npcNm' : '상인 아루', 'location' : '카브'}
    , {'npcNm' : '상인 누누', 'location' : '던바튼'}
    , {'npcNm' : '상인 메루', 'location' : '이멘마하'}
    , {'npcNm' : '상인 세누', 'location' : '스카하'}
    , {'npcNm' : '상인 베루', 'location' : '탈틴'}
    , {'npcNm' : '상인 에루', 'location' : '타라'}
    , {'npcNm' : '상인 네루', 'location' : '티르'}
    , {'npcNm' : '리나'     , 'location' : '코르'}
    , {'npcNm' : '모락'     , 'location' : '자르딘'}
    , {'npcNm' : '켄'       , 'location' : '필리아'}
    , {'npcNm' : '귀넥'     , 'location' : '카루'}
    , {'npcNm' : '얼리'     , 'location' : '오아시스'}
    , {'npcNm' : '데위'     , 'location' : '페라'}
    , {'npcNm' : '테일로'   , 'location' : '켈라'}
    , {'npcNm' : '카디'     , 'location' : '발레스'}
];

const insideColorArr1 = [
    '튼튼한 달걀 주머니'
    , '튼튼한 감자 주머니'
    , '튼튼한 옥수수 주머니'
    , '튼튼한 밀 주머니'
    , '튼튼한 보리 주머니'
];

const insideColorArr2 = ['튼튼한 양털 주머니']; //1 : 겉감, 2 : 안감,

const insideColorArr3 = [
      '튼튼한 거미줄 주머니'
    , '튼튼한 가는 실뭉치 주머니'
    , '튼튼한 굵은 실뭉치 주머니'
];

const insideColorArr4 = [ //1 : 겉감, 2 : 안감, 3 : 로마자
      '튼튼한 저가형 가죽 주머니'
    , '튼튼한 일반 가죽 주머니'
    , '튼튼한 고급 가죽 주머니'
    , '튼튼한 최고급 가죽 주머니'
    , '튼튼한 저가형 옷감 주머니'
    , '튼튼한 일반 옷감 주머니'
    , '튼튼한 고급 옷감 주머니'
    , '튼튼한 최고급 옷감 주머니'
    , '튼튼한 저가형 실크 주머니'
    , '튼튼한 일반 실크 주머니'
    , '튼튼한 고급 실크 주머니'
    , '튼튼한 최고급 실크 주머니'
];

const insideColorArr5 = ['튼튼한 꽃바구니']; //1 : 바구니, 2 : 천