"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFCMQuitClickMessage = exports.parseFCMBackgroundClickMessage = exports.parseFCMBackgroundMessage = exports.parseFCMForegroundMessage = void 0;
const parseFCMForegroundMessage = (message) => {
    var _a, _b;
    let content = "";
    let deepLink = "";
    let internalImage = "";
    const type = (_a = message.data) === null || _a === void 0 ? void 0 : _a.type;
    if ((_b = message.data) === null || _b === void 0 ? void 0 : _b.display) {
        const display = JSON.parse(message.data.display);
        content = display.internal_body;
        deepLink = display.action;
        internalImage = display.internal_icon_path;
    }
    return { content, deepLink, internalImage, type, raw: message };
};
exports.parseFCMForegroundMessage = parseFCMForegroundMessage;
const parseFCMBackgroundMessage = (message) => {
    var _a, _b, _c, _d, _e;
    const display = (_b = (_a = message === null || message === void 0 ? void 0 : message.data) === null || _a === void 0 ? void 0 : _a.display) !== null && _b !== void 0 ? _b : (_c = message === null || message === void 0 ? void 0 : message.data) === null || _c === void 0 ? void 0 : _c.data;
    const type = (_e = (_d = message === null || message === void 0 ? void 0 : message.data) === null || _d === void 0 ? void 0 : _d.type) !== null && _e !== void 0 ? _e : "";
    let displayJson = null;
    if (display) {
        if (typeof display === "string") {
            displayJson = JSON.parse(display);
        }
        else if (typeof display === "object") {
            displayJson = display;
        }
        if (type) {
            displayJson = {
                ...displayJson,
                type,
            };
        }
    }
    const title = displayJson === null || displayJson === void 0 ? void 0 : displayJson.title;
    const displayMessage = displayJson === null || displayJson === void 0 ? void 0 : displayJson.body;
    const largeIconUrl = displayJson === null || displayJson === void 0 ? void 0 : displayJson.icon_path;
    const bigPictureUrl = displayJson === null || displayJson === void 0 ? void 0 : displayJson.icon_path;
    const displayType = displayJson === null || displayJson === void 0 ? void 0 : displayJson.type;
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
    const display = (_a = message === null || message === void 0 ? void 0 : message.data) === null || _a === void 0 ? void 0 : _a.display;
    const trigger = display ? JSON.parse(display) : {};
    const deepLink = trigger === null || trigger === void 0 ? void 0 : trigger.action;
    const type = (_b = message === null || message === void 0 ? void 0 : message.data) === null || _b === void 0 ? void 0 : _b.type;
    return { deepLink, type, raw: message };
};
exports.parseFCMBackgroundClickMessage = parseFCMBackgroundClickMessage;
const parseFCMQuitClickMessage = (message) => {
    var _a, _b;
    const parsedDisplay = (_a = message === null || message === void 0 ? void 0 : message.data) === null || _a === void 0 ? void 0 : _a.display;
    const trigger = parsedDisplay ? JSON.parse(parsedDisplay) : {};
    const deepLink = trigger === null || trigger === void 0 ? void 0 : trigger.action;
    const type = (_b = message === null || message === void 0 ? void 0 : message.data) === null || _b === void 0 ? void 0 : _b.type;
    return { deepLink, type, raw: message };
};
exports.parseFCMQuitClickMessage = parseFCMQuitClickMessage;
//# sourceMappingURL=firebase.js.map