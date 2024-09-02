import { defineEndpoint } from '@directus/extensions-sdk';
import { receivePaymentData } from './mercadopago';

export default defineEndpoint((router, { services, getSchema }) => {
	const { ItemsService } = services;

	router.get('/', (_req, res) => res.send('criptodery endpoints'));

	router.get('/mercadopago/redirect-to-app', (_req, res) => 
		receivePaymentData(
			_req, 
			res,
			ItemsService,
			getSchema,
		));
});
