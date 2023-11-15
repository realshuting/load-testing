import http from 'k6/http';
import { check } from 'k6';
import { buildKubernetesBaseUrl, generateGateway, getParamsWithAuth, getTestNamespace } from './util.js';

const baseUrl = buildKubernetesBaseUrl();
const namespace = getTestNamespace();

export default function () {
  const cm = generateGateway();

  const params = getParamsWithAuth();
  params.headers['Content-Type'] = 'application/json';

  const res = http.post(`${baseUrl}/apis/networking.istio.io/v1beta1/namespaces/${namespace}/gateways?dryRun=All`, JSON.stringify(cm), params);
  check(res, {
    'verify response code is 201': r => r.status === 201
  })
}
