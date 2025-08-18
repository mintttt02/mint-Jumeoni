let isProcess = false;
let isDebug = true;
let colorJsonObj = {};

// 스크롤 이벤트를 감지하여 버튼 표시 여부 결정
$(window).scroll(function() {
    if ($(this).scrollTop() > 100) { // 스크롤이 100px 이상 내려갔을 때
        $('#scrollToTopBtn').fadeIn(); // 버튼 나타남
    } else {
        $('#scrollToTopBtn').fadeOut(); // 버튼 감춤
    }
});

$(document).ready(function () {

    getColorData();

    if (!colorJsonObj) {
        alert("json 불러오기 실패");
        return false;
    }

    function erinn_time() {
        var curr_date = new Date();
        var seconds_since_midnight = (curr_date.getHours() * 3600) + (curr_date.getMinutes() * 60) + curr_date.getSeconds();
        var erinn_seconds = seconds_since_midnight % 2160;
        var erinn_hour = Math.floor(erinn_seconds / 90);
        var erinn_min = Math.floor((erinn_seconds % 90) / 1.5);

        erinn_hour = erinn_hour.toString().padStart(2, "0");
        erinn_min = erinn_min.toString().padStart(2, "0");

        document.querySelector('#erin_time').innerText = `${erinn_hour} : ${erinn_min}`;
    }

    erinn_time();
    setInterval(erinn_time, 3000);

    // 버튼 클릭 시 스크롤 최상단으로 이동
    $('#scrollToTopBtn').click(function() {
        $('html, body').animate({ scrollTop: 0 }, '300'); // 300ms 동안 부드럽게 스크롤
        return false;
    });
});

$(document).on("change", "#imgSizeSelect", function (e) { 

    let imgSize = $("#imgSizeSelect").val();

    $('.itemGrid > div').each(function() {
        $(this).removeClass(function(index, className) {
            return (className.match(/col-lg-\d+/) || []).join(' ');
        }).addClass('col-lg-' + imgSize);
    });

});

$(document).on('click', '.toggle-color-wrap', function() {
    $(this).next('.color-wrap').slideToggle();  // 버튼의 다음 요소인 .color-wrap을 슬라이드 토글
});

//검색
$(document).on('click', '#searchBtn', async function (e) { 

    if (isProcess) {
        alert("api가 실행중입니다. 잠시후 시도해주세요.");
        return false;
    }

    isProcess = true;

    let channel = $("#channelSelect").val();
    await fn_getApiData(channel);

    isProcess = false;

});

//전채널검색
$(document).on('click', '#searchAllBtn', async function (e) { 

    if (isProcess) {
        alert("api가 실행중입니다. 잠시후 시도해주세요.");
        return false;
    }

    isProcess = true;

    for (let index = 1; index < 16; index++) {
        if (index != 11) {
            let channel = index;
            if (! await fn_getApiData(channel)) return false;
        }
    }

    isProcess = false;
});

//전체npc검색
$(document).on('click', '#searchAllNpcBtn', async function (e) { 
    e.preventDefault();

    const channel = $("#channelSelect").val();
    const npcCnt = $("#npcSelect option").size();

    for (let index = 1; index < npcCnt; index++) {
        const npcName = $("#npcSelect option").eq(index).val();
        if (! await fn_getApiData(channel, npcName)) return false;
    }
});

// get api
async function fn_getApiData(channel, npcNameParam) {
    const npcName = npcNameParam || $("#npcSelect").val();
    const serverName = $("#serverSelect").val();
    const urlString = `${host}${urlNpc}npc_name=${npcName}&server_name=${serverName}&channel=${channel}`;

    try {
        const response = await fetch(urlString, {
            headers: {
                "x-nxopen-api-key": API_KEY
            }
        });

        if (!response.ok) {
            if (response.status == 429) {
                alert("API 호출량이 초과되었습니다. 관리자에게 문의해주세요.");
            } else {
                alert("API 응답없음! 잠시후 시도해주세요.");
            }
            throw new Error();
        }

        const data = await response.json();

        if (isDebug) console.log(data);

        await fn_setImg(data, channel, npcName);

        return true;

    } catch (error) {
        isProcess = false;
        return false;
    }
}

//주머니 box 생성
async function fn_setImg(data, channel, npcNameParam) {

    const serverName = $("#serverSelect").val();
    const imgSize = $("#imgSizeSelect").val();
    const npcName = npcNameParam || $("#npcSelect").val();
    const npc = npcArr.find(npc => npc.npcNm === npcName);
    const npcLocation = npc.location;
    const subText = `<h5><mark> ${npcLocation} : ${npcName} ${channel}채 </mark></h5>`;

    const itemGrid = $("<div></div>").addClass("itemGrid row");
    $(itemGrid).append(subText);

    const juObj = data.shop.find(item => item.tab_name === "주머니");
    if (!juObj) return;

    const juArr = juObj.item;

    const htmlArray = [];

    try {

        juArr.forEach(element => {
            let colorHtml = '';
            let insideColor = '';
            let outsideColor = '';

            const imageUrlStr = element.image_url;
            const itemNm = element.item_display_name;

            const optionArr = element.item_option;
            optionArr.forEach(op => {

                let opSubType = op.option_sub_type; //파트 A, 파트 B
                const opVal = op.option_value; //rgb

                if (opSubType == '파트 A') { //겉감
                    outsideColor = opVal;

                    if (insideColorArr1.includes(itemNm)) {
                        opSubType += '(겉감)';
                    } else if (insideColorArr2.includes(itemNm)) {
                        opSubType += '(겉감)';
                    } else if (insideColorArr3.includes(itemNm)) {
                        opSubType += '(겉감)';
                    } else if (insideColorArr4.includes(itemNm)) {
                        opSubType += '(겉감)';
                    } else if (insideColorArr5.includes(itemNm)) {
                        opSubType += '(바구니)';
                    } else if (insideColorArr6.includes(itemNm)) {
                        opSubType += '(겉감)';
                    } else if (insideColorArr7.includes(itemNm)) {
                        opSubType += '(겉감)';
                    }

                } else if (opSubType == '파트 B') {

                    if (insideColorArr1.includes(itemNm)) {
                        insideColor = opVal;
                        opSubType += '(끈)';
                    } else if (insideColorArr2.includes(itemNm)) {
                        insideColor = opVal;
                        opSubType += '(안감)';
                    } else if (insideColorArr3.includes(itemNm)) {
                        opSubType += '(문양)';
                    } else if (insideColorArr4.includes(itemNm)) {
                        insideColor = opVal;
                        opSubType += '(안감)';
                    } else if (insideColorArr5.includes(itemNm)) {
                        insideColor = opVal;
                        opSubType += '(천)';
                    } else if (insideColorArr6.includes(itemNm)) {
                        opSubType += '(끈)';
                    } else if (insideColorArr7.includes(itemNm)) {
                        opSubType += '(끈)';
                    }

                } else if (opSubType == '파트 C') {

                    if (insideColorArr1.includes(itemNm)) {
                        opSubType += '';
                    } else if (insideColorArr2.includes(itemNm)) {
                        opSubType += '';
                    } else if (insideColorArr3.includes(itemNm)) {
                        insideColor = opVal;
                        opSubType += '(안감)';
                    } else if (insideColorArr4.includes(itemNm)) {
                        opSubType += '(로마자)';
                    } else if (insideColorArr5.includes(itemNm)) {
                        opSubType += '(꽃)';
                    } else if (insideColorArr6.includes(itemNm)) {
                        opSubType += '(테두리)';
                    } else if (insideColorArr7.includes(itemNm)) {
                        opSubType += '(테두리)';
                    }

                } else if (opSubType == '파트 D') {
                    
                }

                colorHtml += `
                    <div>
                        <div class="color-item">
                            <div class="color-box" style="background-color:rgb(${opVal})"></div>
                            <span>${opSubType} : ${opVal}</span>
                        </div>
                    </div>
                `;
            });

            

            const outsideRgbColor = outsideColor;
            const insideRgbColor = insideColor;

            // 템플릿 문자열로 HTML 생성
            const itemHtml = `
                <div class="col-lg-${imgSize} border juBox p-1">
                    <img src="${imageUrlStr}" class="img-fluid rounded" alt="Image 1">
                    <p class="itemName">${itemNm}</p>
                    <div class="color-item">
                        <div class="color-box outsideColor" data-rgb="${outsideRgbColor}" style="background-color:rgb(${outsideColor})"></div>
                        <span>겉감 : ${outsideColor}</span>
                    </div>
                    <div class="color-item">
                        <div class="color-box insideColor" data-rgb="${insideRgbColor}" style="background-color:rgb(${insideColor})"></div>
                        <span>안감 : ${insideColor}</span>
                    </div>
                    <p class="text-decoration-underline toggle-color-wrap" role="button" >[컬러상세보기]</p>
                    <div class="color-wrap" /*style="display:none;"*/>
                        ${colorHtml}
                    </div>
                </div>`;

            htmlArray.push(itemHtml);  // 생성된 HTML 조각을 배열에 추가
        });

    } catch (e) {
        console.error("에러:", e);
    }

    $(itemGrid).append(htmlArray.join(''));
    $(".gridContainer").prepend(itemGrid);

}

$(document).on('input', '#searchInput', function (e) { 
    $("#inputR,#inputG,#inputB,#inputTolerance").val('');
});

$(document).on('input', '#inputR,#inputG,#inputB,#inputTolerance', function (e) { 
    $("#searchInput").val('');
});

//닉네임선택
$(document).on('change', '#nickSelect', function (e) { 
    e.preventDefault();

    if (fn_isNull($(this).val())) {
        $("#inputR").val('');
        $("#inputG").val('');
        $("#inputB").val('');
        $("#inputTolerance").val('');
    } else {
        const valArr = $(this).val().split(",");
        $("#inputR").val(valArr[0]);
        $("#inputG").val(valArr[1]);
        $("#inputB").val(valArr[2]);
        $("#inputTolerance").val(valArr[3]);
    }
});

//필터
$(document).on('click', '#filterBtn', function (e) { 
    e.preventDefault();

    fn_rgbFilter();
    fn_findJuSet();
    //$("#collapse2").removeClass("show");
});

//필터클리어
$(document).on('click', '#filterClearBtn', function (e) { 
    e.preventDefault();
    $(".juBox").show();
    $(".itemGrid ").show();

    $("#inputR").val('');
    $("#inputG").val('');
    $("#inputB").val('');
    $("#inputTolerance").val('');

});


function fn_rgbFilter() {
    const sideColor = $("input[name=sideColor]:checked").val() == "1" ? "outsideColor" : "insideColor";
    const r = Number($("#inputR").val()) || 0;
    const g = Number($("#inputG").val()) || 0;
    const b = Number($("#inputB").val()) || 0;
    const tolerance = Number($("#inputTolerance").val()) || 0;

    $("."+sideColor).each(function (index, element) {
        // data-rgb 속성값을 가져와서 r.g.b 형식의 문자열을 분해
        const [divR, divG, divB] = $(element).data("rgb").split(',').map(Number);

        // 각 색상 값이 오차 범위 내에 있는지 확인
        const isWithinTolerance = (value, target) => 
            value >= target - tolerance && value <= target + tolerance;

        if (isWithinTolerance(divR, r) && isWithinTolerance(divG, g) && isWithinTolerance(divB, b)) {
            $(element).closest(".juBox").show();
        } else {
            $(element).closest(".juBox").hide();
        }

    });

    fn_hideItemGrid();
}

//아무것도없는 목록 숨기기
function fn_hideItemGrid() {
    $(".itemGrid").show();

    $(".itemGrid").each(function (index, element) {
        var childDivs = $(this).children('.juBox');

        if (childDivs.length > 0 && childDivs.filter(function() {
            return $(this).css('display') !== 'none';
        }).length === 0) {
            $(this).css('display', 'none');
        }
    });
}

//세트찾기
function fn_findJuSet() {
    const hiddenItemNames = [];
    const msgArr = [];
    

    $('.juBox').each(function() {
        if ($(this).css('display') !== 'none') {
            const itemName = $(this).find(".itemName").text();
            hiddenItemNames.push(itemName);
        }
    });

    // 배열의 모든 값이 hiddenItemNames에 포함되어 있는지 검사하는 함수
    function isAllItemsInArrayDisplayed(juSetArr, arrayName) {
        const allFound = juSetArr.every(item => hiddenItemNames.includes(item));
        if (allFound) {
            msgArr.push(arrayName);
        }
    }

    // 각 배열에 대해 검사 실행
    isAllItemsInArrayDisplayed(juSetArr1, '가죽');
    isAllItemsInArrayDisplayed(juSetArr2, '옷감');
    isAllItemsInArrayDisplayed(juSetArr3, '실크');
    isAllItemsInArrayDisplayed(insideColorArr1, '작물');
    isAllItemsInArrayDisplayed(insideColorArr3, '방직');

    if (fn_isNotNull(msgArr)) {
        const msg = msgArr.join(', ');
        alert(`필터링 결과 [${msg}]주머니 세트가 완성되었습니다.`);
    }
}


/**
 * HEX 코드를 RGB 값으로 변환하는 함수
 * @param {string} hex - 변환할 HEX 코드 (예: '#FFFFFF' 또는 'FFFFFF')
 * @returns {object} r, g, b 값을 포함하는 객체
 */
 function hexToRgb(hex) {
    // # 문자가 포함된 경우 제거
    hex = hex.replace(/^#/, '');

    // 3자리 HEX를 6자리 HEX로 확장
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // 6자리 HEX를 각 RGB로 변환
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r},${g},${b}`;
}

function fn_clear() {
    $(".gridContainer").html('');
}

function fn_isNull(asVal) {
    if (asVal == null) return true;
    if (Number.isNaN(asVal)) return true;
    if (typeof asVal === 'string' && (asVal.trim() === "" || asVal === "NaN" || asVal === "null" || asVal === "undefined")) return true;
    if (typeof asVal === 'object' && !Array.isArray(asVal) && Object.keys(asVal).length === 0) return true;
    if (Array.isArray(asVal) && asVal.length === 0) return true;
    return false;
}

function fn_isNotNull(val) {
    return !fn_isNull(val);
}

// 문자열을 가공하는 함수
function parseRGBString(encodedString) {
    const resultArray = [];
    
    // 4자리 4번 + 2자리 1번을 반복적으로 추출
    for (let i = 0; i < encodedString.length; i += 18) {
        // 각 항목 추출
        const common = encodedString.slice(i, i + 4);
        const R = encodedString.slice(i + 4, i + 8);
        const G = encodedString.slice(i + 8, i + 12);
        const B = encodedString.slice(i + 12, i + 16);
        const separator = encodedString.slice(i + 16, i + 18);

        // 객체 배열로 추가
        resultArray.push({
            common: common,
            R: R,
            G: G,
            B: B,
            separator: separator
        });
    }
    
    return resultArray;
}

// 비동기로 color.json 파일을 불러오는 함수
async function getColorData() {
    try {
        const response = await fetch('assets/color.json');
        const colorData = await response.json();
        colorJsonObj = colorData;
    } catch (error) {
        console.error('Error loading color data:', error);
    }
}

function getJsonObjValue(part, num, type, key) {
    type = type == 'U' ? 'upper' : 'lower';
    return colorJsonObj[part][num][type][key];
}

/**
 * 상위 비트와 하위 비트를 받아 R 값을 계산하는 함수
 * @param {number} upper - 상위 비트 (10진수)
 * @param {number} lower - 하위 비트 (10진수)
 * @returns {string} R 값 (16진수 문자열)
 */
function calculateRGB(upper, lower) {
    // 상위 비트와 하위 비트를 결합하여 R 값 계산
    const rValue = (upper << 4) | lower; // 상위 비트를 왼쪽으로 4비트 시프트하고 하위 비트와 OR 연산

    // 16진수 문자열로 변환하고 2자리로 패딩
    return rValue.toString(16).padStart(2, '0').toUpperCase(); // 대문자 16진수 반환
}

function decodeUrlRgbCode(imageUrlStr) {

    //https://open.api.nexon.com/static/mabinogi/img/3806a77a763b3482fb83a057bf3dd7ac?q=4b4548484d544a4787464e4650554c4a448a50424d445e4744438443505359414b41488f4c4348514c414b548848494a50555e424f

    let resultArray = [];
    const parts = ['A', 'B', 'C'];
    const imgcode = imageUrlStr.split('q=')[1];
    const codeObjArr = parseRGBString(imgcode);

    parts.forEach((part, index) => {
        const element = codeObjArr[index];
        const arrR = element.R.match(/.{1,2}/g);
        const arrG = element.G.match(/.{1,2}/g);
        const arrB = element.B.match(/.{1,2}/g);

        const upperR = getJsonObjValue(part, '1', 'U', arrR[0].toUpperCase());
        const lowerR = getJsonObjValue(part, '1', 'L', arrR[1].toUpperCase());

        const upperG = getJsonObjValue(part, '2', 'U', arrG[0].toUpperCase());
        const lowerG = getJsonObjValue(part, '2', 'L', arrG[1].toUpperCase());

        const upperB = getJsonObjValue(part, '3', 'U', arrB[0].toUpperCase());
        const lowerB = getJsonObjValue(part, '3', 'L', arrB[1].toUpperCase());

        const R = calculateRGB(upperR, lowerR);
        const G = calculateRGB(upperG, lowerG);
        const B = calculateRGB(upperB, lowerB);

        const rgbCode = hexToRgb(R+G+B);

        resultArray.push(rgbCode);

    });

    //console.log(resultArray);

    return resultArray;
}
