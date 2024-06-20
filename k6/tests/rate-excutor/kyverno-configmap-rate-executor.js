import http from 'k6/http';
import { check } from 'k6';
import { buildKubernetesBaseUrl, generateConfigmap, getParamsWithAuth, getTestNamespace, randomString } from '../util.js';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',

      // How long the test lasts
      duration: '30s',

      // How many iterations per timeUnit
      rate: 30,

      // Start `rate` iterations per second
      timeUnit: '1s',

      // Pre-allocate VUs
      preAllocatedVUs: 50,
    },
  },
};

const baseUrl = buildKubernetesBaseUrl();
const namespace = getTestNamespace();

export default function () {
  const labelValue = `test-${randomString(8)}`;
  const cm = generateConfigmap('test', labelValue);

  const params = getParamsWithAuth();
  params.headers['Content-Type'] = 'application/json';

  const checkConfigmapRes = http.get(`${baseUrl}/api/v1/namespaces/${namespace}/configmaps/test`, params);

  if (checkConfigmapRes.status === 200) {
    params.headers['Content-Type'] = 'application/strategic-merge-patch+json'
    const res = http.patch(`${baseUrl}/api/v1/namespaces/${namespace}/configmaps/test`, JSON.stringify(cm), params);
    check(res, { 'verify response code is 200': r => r.status === 200 });
  } else {
    const createRes = http.post(`${baseUrl}/api/v1/namespaces/${namespace}/configmaps`, JSON.stringify(cm), params);
    check(createRes, { 'verify response code is 201': r => r.status === 201 });
  }
}
