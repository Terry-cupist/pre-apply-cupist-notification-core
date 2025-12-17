"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExpoNotificationResponse = exports.parseExpoForegroundMessage = void 0;
const parseExpoForegroundMessage = (message) => {
    var _a, _b, _c;
    const trigger = message.request.trigger;
    const displayJson = (_a = trigger === null || trigger === void 0 ? void 0 : trigger.payload) === null || _a === void 0 ? void 0 : _a.display;
    let deepLink = "";
    let content = (_b = message.request.content.body) !== null && _b !== void 0 ? _b : "";
    let internalImage = "";
    let type = "";
    // Braze DeepLink 처리 --> 사용하는 단에서
    //   if (trigger.type === "push" && trigger.payload?.ab_uri) {
    //     deepLink = trigger.payload.ab_uri.toString();
    //   }
    if (trigger.type === "push") {
        if (displayJson) {
            const display = JSON.parse(displayJson);
            content = display.internal_body;
            deepLink = display.action;
            internalImage = display.internal_icon_path;
        }
        if ((_c = trigger.payload) === null || _c === void 0 ? void 0 : _c.type) {
            type = trigger.payload.type;
        }
    }
    return { deepLink, content, internalImage, type, raw: message };
};
exports.parseExpoForegroundMessage = parseExpoForegroundMessage;
const parseExpoNotificationResponse = (response) => {
    var _a, _b, _c, _d, _e;
    let deepLink = "";
    let type = "";
    const trigger = response.notification.request.trigger;
    const contentData = response.notification.request.content.data;
    if (trigger.type === "push") {
        type = (_b = (_a = trigger === null || trigger === void 0 ? void 0 : trigger.payload) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : "";
        const displayJson = (_c = trigger === null || trigger === void 0 ? void 0 : trigger.payload) === null || _c === void 0 ? void 0 : _c.display;
        if (displayJson) {
            const data = JSON.parse(displayJson);
            deepLink = data.action;
        }
    }
    else if (contentData) {
        type = (_d = contentData.type) !== null && _d !== void 0 ? _d : "";
        deepLink = (_e = contentData.action) !== null && _e !== void 0 ? _e : "";
    }
    return { deepLink, type, raw: response };
};
exports.parseExpoNotificationResponse = parseExpoNotificationResponse;
//# sourceMappingURL=expo.js.map