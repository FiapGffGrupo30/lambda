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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const encryptPassword_1 = require("../auth/encryptPassword");
const AWS_REGION = (_a = process.env.COGNITO_REGION) !== null && _a !== void 0 ? _a : 'us-east-1';
function createUser(userData) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const input = {
            UserPoolId: userData.UserPoolId || '',
            TemporaryPassword: (0, encryptPassword_1.encryptPassword)(userData.Username),
            Username: userData.Username,
            MessageAction: 'SUPPRESS',
        };
        try {
            const client = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({ region: AWS_REGION });
            const command = new client_cognito_identity_provider_1.AdminCreateUserCommand(input);
            const response = yield client.send(command);
            if ((_a = response.User) === null || _a === void 0 ? void 0 : _a.Username) {
                return true;
            }
            else {
                throw new Error('usuário não criado');
            }
        }
        catch (error) {
            console.error(error, 'deu algum erro');
            throw new Error(error);
        }
    });
}
exports.createUser = createUser;
