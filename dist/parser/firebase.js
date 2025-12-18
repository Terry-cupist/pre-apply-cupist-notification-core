"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFCMQuitClickMessage = exports.parseFCMBackgroundClickMessage = exports.parseFCMBackgroundMessage = exports.parseFCMForegroundMessage = void 0;
const parseFCMForegroundMessage = (message) => {
    var _a, _b;
    console.log('📨 [parseFCMForegroundMessage] FCM 포그라운드 메시지 파싱 시작');
    let content = "";
    let deepLink = "";
    let internalImage = "";
    const type = (_a = message.data) === null || _a === void 0 ? void 0 : _a.type;
    console.log('🏷️ [parseFCMForegroundMessage] 메시지 타입:', type);
    if ((_b = message.data) === null || _b === void 0 ? void 0 : _b.display) {
        console.log('🎨 [parseFCMForegroundMessage] Display 데이터 파싱');
        const display = JSON.parse(message.data.display);
        content = display.internal_body;
        deepLink = display.action;
        internalImage = display.internal_icon_path;
        console.log('✅ [parseFCMForegroundMessage] Display 데이터 추출 완료:', { content, deepLink, internalImage });
    }
    console.log('✅ [parseFCMForegroundMessage] 파싱 완료:', { content, deepLink, internalImage, type });
    return { content, deepLink, internalImage, type, raw: message };
};
exports.parseFCMForegroundMessage = parseFCMForegroundMessage;
const parseFCMBackgroundMessage = (message) => {
    var _a, _b, _c, _d, _e;
    console.log('🔔 [parseFCMBackgroundMessage] FCM 백그라운드 메시지 파싱 시작');
    const display = (_b = (_a = message === null || message === void 0 ? void 0 : message.data) === null || _a === void 0 ? void 0 : _a.display) !== null && _b !== void 0 ? _b : (_c = message === null || message === void 0 ? void 0 : message.data) === null || _c === void 0 ? void 0 : _c.data;
    const type = (_e = (_d = message === null || message === void 0 ? void 0 : message.data) === null || _d === void 0 ? void 0 : _d.type) !== null && _e !== void 0 ? _e : "";
    console.log('🏷️ [parseFCMBackgroundMessage] 메시지 타입:', type);
    let displayJson = null;
    if (display) {
        console.log('🎨 [parseFCMBackgroundMessage] Display 데이터 처리');
        if (typeof display === "string") {
            console.log('📝 [parseFCMBackgroundMessage] Display는 문자열, JSON 파싱 시작');
            displayJson = JSON.parse(display);
        }
        else if (typeof display === "object") {
            console.log('📦 [parseFCMBackgroundMessage] Display는 객체, 직접 사용');
            displayJson = display;
        }
        if (type) {
            displayJson = {
                ...displayJson,
                type,
            };
            console.log('✅ [parseFCMBackgroundMessage] 타입 정보 추가 완료');
        }
    }
    const title = displayJson === null || displayJson === void 0 ? void 0 : displayJson.title;
    const displayMessage = displayJson === null || displayJson === void 0 ? void 0 : displayJson.body;
    const largeIconUrl = displayJson === null || displayJson === void 0 ? void 0 : displayJson.icon_path;
    const bigPictureUrl = displayJson === null || displayJson === void 0 ? void 0 : displayJson.icon_path;
    const displayType = displayJson === null || displayJson === void 0 ? void 0 : displayJson.type;
    console.log('✅ [parseFCMBackgroundMessage] 파싱 완료:', { title, displayMessage, largeIconUrl, displayType });
    return {
        title,
        message: displayMessage,
        largeIconUrl,
        bigPictureUrl,
        type: displayType,
        display: displayJson,
        raw: message,
    };
};
exports.parseFCMBackgroundMessage = parseFCMBackgroundMessage;
const parseFCMBackgroundClickMessage = (message) => {
    var _a, _b;
    console.log('👆 [parseFCMBackgroundClickMessage] FCM 백그라운드 클릭 메시지 파싱 시작');
    const display = (_a = message === null || message === void 0 ? void 0 : message.data) === null || _a === void 0 ? void 0 : _a.display;
    const trigger = display ? JSON.parse(display) : {};
    console.log('🎨 [parseFCMBackgroundClickMessage] Display 데이터 파싱 완료');
    const deepLink = trigger === null || trigger === void 0 ? void 0 : trigger.action;
    const type = (_b = message === null || message === void 0 ? void 0 : message.data) === null || _b === void 0 ? void 0 : _b.type;
    console.log('✅ [parseFCMBackgroundClickMessage] 파싱 완료:', { deepLink, type });
    return { deepLink, type, raw: message };
};
exports.parseFCMBackgroundClickMessage = parseFCMBackgroundClickMessage;
const parseFCMQuitClickMessage = (message) => {
    var _a, _b;
    console.log('🚪 [parseFCMQuitClickMessage] FCM 종료 상태 클릭 메시지 파싱 시작');
    const parsedDisplay = (_a = message === null || message === void 0 ? void 0 : message.data) === null || _a === void 0 ? void 0 : _a.display;
    const trigger = parsedDisplay ? JSON.parse(parsedDisplay) : {};
    console.log('🎨 [parseFCMQuitClickMessage] Display 데이터 파싱 완료');
    const deepLink = trigger === null || trigger === void 0 ? void 0 : trigger.action;
    const type = (_b = message === null || message === void 0 ? void 0 : message.data) === null || _b === void 0 ? void 0 : _b.type;
    console.log('✅ [parseFCMQuitClickMessage] 파싱 완료:', { deepLink, type });
    return { deepLink, type, raw: message };
};
exports.parseFCMQuitClickMessage = parseFCMQuitClickMessage;
//# sourceMappingURL=firebase.js.map