"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roles_interface_1 = require("./roles.interface");
class Roles {
}
exports.default = Roles;
Roles.ROLE = roles_interface_1.Role;
Roles.find = () => Object.keys(roles_interface_1.Role)
    .filter((e) => !Number.isNaN(Number(e)))
    .map((e) => Number(e));
//# sourceMappingURL=roles.model.js.map