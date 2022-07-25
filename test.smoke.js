import http from 'k6/http';
import { sleep, group } from 'k6';

export const options = {
    vus: 10,
    duration: '15m',
    thresholds: {
        'http_req_duration': ['p(95)<1000'],
    },
};

const BASE_URL = 'https://www.yourdomain.com';

export default () => {
    // Assets
    group('assets', function () {
        http.batch([
            ['GET', `${BASE_URL}/js/app.js`, {}, { tags: { staticAsset: 'yes' } }],
            ['GET', `${BASE_URL}/js/app.css`, {}, { tags: { staticAsset: 'yes' } }]
        ]);
    });

    // Home
    group('home', function () {
        http.get(`${BASE_URL}`);
    });
    sleep(1);

    // Login
    group('login', function () {
        let response = http.get(`${BASE_URL}/login`);
        const data = {};
        data['email'] = 'k6@mailinator.com';
        data['password'] = 'k6password';
        data['_token'] = response.html().find('input[name=_token]').first().attr('value');
        http.post(`${BASE_URL}/login`, data);
    });
    sleep(1);
};

