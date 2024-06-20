## Constant Rate Executor

This test executes K6 [constant-arrival-rate executor](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/#constant-arrival-rate).

To execute the test, go to `load-testing/k6` dir:

1. create the policy first:
```sh
kubectl create -f rate/executor/cm-policy.yaml
```

2. run the command:
```sh
./start-rate-executor.sh ./rate-executor/kyverno-configmap-rate-executor.js 100 30s
```

The above command executes the kyverno-configmap-rate-executor.js test at a rate of 100 with a duration of 30s. The rate and the duration are subject to change based on your testing.

This test set sends the configmap UPDATE requests at a constant rate to trigger the audit validate policy to create reports upon admission events.