import { APIGatewayEvent } from 'aws-lambda';
import { UserConfirmationData, UserDataUserPoolType } from 'types/UserTypes';

import { authenticateCognitoUser } from '../middleware/provider/autenticarUsuario';
import { confirmUser } from '../middleware/provider/confirmarUsuario';
import { createUser } from '../middleware/provider/CriarUsuario';
import sendResponse from '../utils/sendResponse';
import { validateCPF } from '../utils/validateCPF';

async function handler (event: APIGatewayEvent) {
  const { cpf } = JSON.parse(event.body as string);
  if (!validateCPF(cpf)) {
    return sendResponse(400, 'cpf inválido');
  }

  console.log("teste " + process.env.CLIENTES_POOL_ID?.toString);
  console.log(process.env);

  const clientData: UserConfirmationData = {
    Username: cpf,
    UserPoolId: process.env.CLIENTES_POOL_ID
  }

  const clientPoolData: UserDataUserPoolType = {
    Username: cpf,
    UserPoolId: process.env.CLIENTES_POOL_ID,
    ClientId: process.env.CLIENTES_POOL_CLIENT_ID,
    IdentityPoolId: process.env.CLIENTES_IDENTITY_POOL_ID,
  }

  try {
    await confirmUser(clientData);
    const result = await authenticateCognitoUser(clientPoolData);
    return sendResponse(401, result);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'UserNotFoundException') {
      await createUser(clientData);
      const result = await authenticateCognitoUser(clientPoolData);
      return sendResponse(401, result);
    } else {
      throw new Error(error as string);
    }
  }
}

export { handler };
