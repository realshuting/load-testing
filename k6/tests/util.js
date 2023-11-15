export const generateGateway = (name = 'test') => {
  return {
    kind: 'Gateway',
    apiVersion: 'networking.istio.io/v1beta1',
    metadata: {
      name: name,
    },
    spec: {
      selector: {
        istio: 'ingressgateway'
      },
      servers: [
        {
          port: {
            number: 80,
            name: 'http',
            protocol: 'HTTP'
          },
          hosts: [
            'ac56639a1b.example.com'
          ]
        },
        {
          port: {
            number: 443,
            name: 'https',
            protocol: 'HTTPs'
          },
          hosts: [
            '34k32kg43.example.com'
          ],
          "tls": {
            "mode": "SIMPLE",
            "credentialName": "my-tls-secret"
          }
        }
      ]
    }
  }
}

export const generatePod = (name = 'test', image = 'nginx') => {
  return {
    kind: 'Pod',
    apiVersion: 'v1',
    metadata: {
      name: name,
    },
    spec: {
      containers: [
        {
          name: 'test',
          image,
          securityContext: {
            allowPrivilegeEscalation: false,
            runAsNonRoot: true,
            seccompProfile: {
                type: 'RuntimeDefault'
            },
            capabilities: {
                drop: [
                    'ALL'
                ]
            }
          }
        }
      ],
    }
  }
}

export const generateConfigmap = (name = 'test') => {
  return {
    kind: "ConfigMap",
    apiVersion: "v1",
    metadata: {
      name: name
    }
  }
}

export const generateSecret = (name = 'test') => {
  return {
    kind: "Secret",
    apiVersion: "v1",
    metadata: {
      name: name
    }
  }
}

export const buildKubernetesBaseUrl = () => {
  return `https://${__ENV.KUBERNETES_SERVICE_HOST}:${__ENV.KUBERNETES_SERVICE_PORT}`;
}

export const getTestNamespace = () => {
  return __ENV.POD_NAMESPACE;
}

export const getParamsWithAuth = () => {
  return {
    headers: {
      'Authorization': `Bearer ${__ENV.KUBERNETES_TOKEN}`
    }
  }
}

export const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
