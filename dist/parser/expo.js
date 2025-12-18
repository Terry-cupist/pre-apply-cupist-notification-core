"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExpoNotificationResponse = exports.parseExpoForegroundMessage = void 0;
const parseExpoForegroundMessage = (message) => {
    var _a, _b, _c;
    console.log('📨 [parseExpoForegroundMessage] Expo 포그라운드 메시지 파싱 시작');
    const trigger = message.request.trigger;
    const displayJson = (_a = trigger === null || trigger === void 0 ? void 0 : trigger.payload) === null || _a === void 0 ? void 0 : _a.display;
    console.log('🔍 [parseExpoForegroundMessage] 트리거 타입:', trigger.type);
    let deepLink = "";
    let content = (_b = message.request.content.body) !== null && _b !== void 0 ? _b : "";
    let internalImage = "";
    let type = "";
    // Braze DeepLink 처리 --> 사용하는 단에서
    //   if (trigger.type === "push" && trigger.payload?.ab_uri) {
    //     deepLink = trigger.payload.ab_uri.toString();
    //   }
    if (trigger.type === "push") {
        console.log('📲 [parseExpoForegroundMessage] Push 타입 메시지 처리');
        if (displayJson) {
            console.log('🎨 [parseExpoForegroundMessage] Display JSON 파싱');
            const display = JSON.parse(displayJson);
            content = display.internal_body;
            deepLink = display.action;
            internalImage = display.internal_icon_path;
            console.log('✅ [parseExpoForegroundMessage] Display 데이터 추출 완료:', { content, deepLink, internalImage });
        }
        if ((_c = trigger.payload) === null || _c === void 0 ? void 0 : _c.type) {
            type = trigger.payload.type;
            console.log('🏷️ [parseExpoForegroundMessage] 메시지 타입:', type);
        }
    }
    console.log('✅ [parseExpoForegroundMessage] 파싱 완료:', { deepLink, content, internalImage, type });
    return { deepLink, content, internalImage, type, raw: message };
};
exports.parseExpoForegroundMessage = parseExpoForegroundMessage;
const parseExpoNotificationResponse = (response) => {
    var _a, _b, _c, _d, _e;
    console.log('👆 [parseExpoNotificationResponse] Expo 알림 응답 파싱 시작');
    let deepLink = "";
    let type = "";
    const trigger = response.notification.request.trigger;
    const contentData = response.notification.request.content.data;
    console.log('🔍 [parseExpoNotificationResponse] 트리거 타입:', trigger.type);
    if (trigger.type === "push") {
        console.log('📲 [parseExpoNotificationResponse] Push 타입 응답 처리');
        type = (_b = (_a = trigger === null || trigger === void 0 ? void 0 : trigger.payload) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : "";
        const displayJson = (_c = trigger === null || trigger === void 0 ? void 0 : trigger.payload) === null || _c === void 0 ? void 0 : _c.display;
        if (displayJson) {
            console.log('🎨 [parseExpoNotificationResponse] Display JSON 파싱');
            const data = JSON.parse(displayJson);
            deepLink = data.action;
            console.log('✅ [parseExpoNotificationResponse] 딥링크 추출 완료:', deepLink);
        }
    }
    else if (contentData) {
        console.log('📦 [parseExpoNotificationResponse] Content 데이터 처리');
        type = (_d = contentData.type) !== null && _d !== void 0 ? _d : "";
        deepLink = (_e = contentData.action) !== null && _e !== void 0 ? _e : "";
        console.log('✅ [parseExpoNotificationResponse] Content 데이터 추출 완료:', { type, deepLink });
    }
    console.log('✅ [parseExpoNotificationResponse] 파싱 완료:', { deepLink, type });
    return { deepLink, type, raw: response };
};
exports.parseExpoNotificationResponse = parseExpoNotificationResponse;
//# sourceMappingURL=expo.js.map