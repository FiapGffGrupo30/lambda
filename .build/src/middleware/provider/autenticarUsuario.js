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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateCognitoUser = void 0;
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const encryptPassword_1 = require("../auth/encryptPassword");
const getToken_1 = require("../auth/getToken");
function authenticateCognitoUser(userDataPoolData) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationData = {
            Username: userDataPoolData.Username,
            Password: userDataPoolData.Password ? userDataPoolData.Password : (0, encryptPassword_1.encryptPassword)(userDataPoolData.Username),
        };
        const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails(authenticationData);
        const poolData = {
            UserPoolId: userDataPoolData.UserPoolId || '',
            ClientId: userDataPoolData.ClientId || '',
        };
        const userPool = new amazon_cognito_identity_js_1.CognitoUserPool(poolData);
        const userData = {
            Username: userDataPoolData.Username,
            Pool: userPool,
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        const token = new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const res = yield (0, getToken_1.getToken)(result, userDataPoolData.IdentityPoolId, userDataPoolData.UserPoolId);
                        resolve(res);
                    }
                    catch (err) {
                        console.error('falha na autenticação', err);
                        reject(err);
                    }
                }),
                onFailure: (err) => {
                    console.error('falha na autenticação', err);
                    reject(err);
                },
                newPasswordRequired: () => {
                    // delete userAttributes.email_verified;
                    cognitoUser.completeNewPasswordChallenge(authenticationData.Password, null, {
                        onSuccess: () => __awaiter(this, void 0, void 0, function* () {
                            resolve(authenticateCognitoUser(userDataPoolData));
                        }),
                        onFailure: (err) => {
                            console.error('falha na criação da nova senha');
                            reject(err);
                        }
                    });
                },
            });
        });
        return token;
    });
}
exports.authenticateCognitoUser = authenticateCognitoUser;
