"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const autenticarUsuario_1 = require("../middleware/provider/autenticarUsuario");
const confirmarUsuario_1 = require("../middleware/provider/confirmarUsuario");
const CriarUsuario_1 = require("../middleware/provider/CriarUsuario");
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const validateCPF_1 = require("../utils/validateCPF");
function handler(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { cpf } = JSON.parse(event.body);
        if (!(0, validateCPF_1.validateCPF)(cpf)) {
            return (0, sendResponse_1.default)(400, 'cpf inválido');
        }
        console.log("teste " + ((_a = process.env.CLIENTES_POOL_ID) === null || _a === void 0 ? void 0 : _a.toString));
        console.log(process.env);
        const clientData = {
            Username: cpf,
            UserPoolId: process.env.CLIENTES_POOL_ID
        };
        const clientPoolData = {
            Username: cpf,
            UserPoolId: process.env.CLIENTES_POOL_ID,
            ClientId: process.env.CLIENTES_POOL_CLIENT_ID,
            IdentityPoolId: process.env.CLIENTES_IDENTITY_POOL_ID,
        };
        try {
            yield (0, confirmarUsuario_1.confirmUser)(clientData);
            const result = yield (0, autenticarUsuario_1.authenticateCognitoUser)(clientPoolData);
            return (0, sendResponse_1.default)(401, result);
        }
        catch (error) {
            if (error instanceof Error && error.name === 'UserNotFoundException') {
                yield (0, CriarUsuario_1.createUser)(clientData);
                const result = yield (0, autenticarUsuario_1.authenticateCognitoUser)(clientPoolData);
                return (0, sendResponse_1.default)(401, result);
            }
            else {
                throw new Error(error);
            }
        }
    });
}
exports.handler = handler;
