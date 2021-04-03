"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
class Utils {
}
exports.Utils = Utils;
Utils.capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};
Utils.capitalizeEach = (text) => {
    return text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
//# sourceMappingURL=index.js.map