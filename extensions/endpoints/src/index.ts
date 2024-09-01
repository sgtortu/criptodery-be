import { defineEndpoint } from '@directus/extensions-sdk';

export default defineEndpoint((router) => {
	router.get('/', (_req, res) => res.send('criptodery endpoints'));
	router.get('/mercadopago/redirect-to-app', (_req, res) => res.redirect('criptodery://checkout'));
});
