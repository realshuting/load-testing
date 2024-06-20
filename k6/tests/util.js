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

export const generateConfigmap = (name = 'test', value = 'bar') => {
  return {
    kind: "ConfigMap",
    apiVersion: "v1",
    metadata: {
      name: name,
      labels: {
        foo: value
      },
    },
    data: {
      foo: value
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
