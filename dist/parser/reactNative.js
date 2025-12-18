"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReactNativeNotification = void 0;
const parseReactNativeNotification = (notification) => {
    var _a, _b;
    console.log('📨 [parseReactNativeNotification] React Native 알림 파싱 시작');
    const type = (_a = notification === null || notification === void 0 ? void 0 : notification.data) === null || _a === void 0 ? void 0 : _a.type;
    const deepLink = (_b = notification === null || notification === void 0 ? void 0 : notification.data) === null || _b === void 0 ? void 0 : _b.action;
    console.log('✅ [parseReactNativeNotification] 파싱 완료:', { type, deepLink });
    return { type, deepLink, raw: notification };
};
exports.parseReactNativeNotification = parseReactNativeNotification;
//# sourceMappingURL=reactNative.js.map