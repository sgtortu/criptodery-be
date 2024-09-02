import axios from 'axios';
import { routes } from './routes';
import 'dotenv/config'

const genericGet = async (route: string) => {
  try {
    const apiUrl = process.env.MERCADO_PAGO_API_URL;
    const token = process.env.MERCADO_PAGO_TOKEN;

    const response = await axios.get(`${apiUrl}${route}`, {
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    });

    return response;
  } catch (error: any) {
    console.error('Error calling the API:', error.message);
    throw error;
  }
}

const getSubscriptionById = async (preapproval_id: string) => {
	try {
		const response = await genericGet(`${routes.subscription}/${preapproval_id}`);
		return response.data;
	} catch (error: any) {
		console.error('Error getSubscriptionById:', error.message);
		throw error;
	}
}

const saveSubscriptionId = async (
  res: any,
  ItemsService: any,
  getSchema: any,
  subscriptionId: any, 
  userId: string
) => {
  
  try {
    const schema = await getSchema();
    const usersService = new ItemsService('directus_users', { schema });
    await usersService.updateOne(userId, {
      subscription_id: subscriptionId,
      role: process.env.PREMIUM_ROLE_ID,
    });
    return;
  } catch (error) {
    console.error('saveSubscriptionId error:', error);
    res.redirect(`criptodery://checkout?status=error`);
  }
}

export const receivePaymentData = async (
  req: any, 
  res: any,
  ItemsService: any, 
	getSchema: any, 
) => {
	const preapproval_id = req.query.preapproval_id;
  console.log('preapproval_id--->', preapproval_id);

	const subscription = await getSubscriptionById(preapproval_id);
  console.log('subscription--->', subscription);

  if (!subscription) {
    res.redirect(`criptodery://checkout?status=error`);
    return;
  } else {
    await saveSubscriptionId(res, ItemsService, getSchema, subscription.id, subscription.externalReference);
    res.redirect(`criptodery://checkout?status=${subscription.status}`);
    return;
  }
}

