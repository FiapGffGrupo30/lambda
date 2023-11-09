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
exports.getToken = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const credential_providers_1 = require("@aws-sdk/credential-providers");
const AWS_REGION = (_a = process.env.COGNITO_REGION) !== null && _a !== void 0 ? _a : 'us-east-1';
function getToken(result, identityPool, userPoolId) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_s3_1.S3Client({
            region: AWS_REGION,
            credentials: (0, credential_providers_1.fromCognitoIdentityPool)({
                clientConfig: { region: AWS_REGION },
                identityPoolId: identityPool,
                logins: {
                    [`cognito-idp.${AWS_REGION}.amazonaws.com/${userPoolId}`]: result.getIdToken().getJwtToken(),
                },
            })
        });
        yield client.config.credentials();
        const accessToken = result.getAccessToken().getJwtToken();
        return accessToken;
    });
}
exports.getToken = getToken;
