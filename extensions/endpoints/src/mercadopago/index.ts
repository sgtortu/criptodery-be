import axios from 'axios';
import { routes } from './routes';

const genericGet = async (route: string) => {
  try {
    const apiUrl = process.env.MERCADO_PAGO_API_URL;
    const token = process.env.MERCADO_PAGO_TOKEN;

    const response = await axios.get(`${apiUrl}${route}`, {
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error calling the API:', error.message);
    throw error;
  }
}

const searchSubscriptionByExternalReference = async (externalReference: string) => {
	try {
		const response = await genericGet(`${routes.subscription_search}?extRef=${externalReference}`);
		return response;
	} catch (error: any) {
		console.error('Error searching the subscription:', error.message);
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
	const status = req.query.status;
	const externalReference = req.query.external_reference;
  console.log('status--->', status);
  console.log('externalReference--->', externalReference);

	const subscription = await searchSubscriptionByExternalReference(externalReference);
  console.log('subscription--->', subscription);

  if (!subscription || subscription.length === 0) {
    res.redirect(`criptodery://checkout?status=error`);
    return;
  } else {
    const subscriptionId = subscription[0].id;
    await saveSubscriptionId(res, ItemsService, getSchema, subscriptionId, externalReference);
    res.redirect(`criptodery://checkout?status=${status}`);
    return;
  }
}

