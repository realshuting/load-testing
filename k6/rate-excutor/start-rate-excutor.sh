#!/usr/bin/env bash

set -euo pipefail

NAMESPACE="load-tests"

if [[ $# -lt 2 ]]; then
	echo "Usage: $0 <script> <rate> <duration>" 1>&2
	echo "Example: $0 tests/my-test.js 10 10s" 1>&2
	exit 1
fi

SCRIPT="$1"
RATE="$2"
DURATION="$3"

TEMP_SCRIPT_PATH="/tmp/script.js"

sed -e "s/duration: '30s',/duration: '$DURATION',/; s/rate: 30,/rate: $RATE,/" $SCRIPT > $TEMP_SCRIPT_PATH

echo "Deploying namespace..."
kubectl create ns "$NAMESPACE"

echo "Deploying RBAC..."
kubectl apply -n "$NAMESPACE" -f ../rbac.yaml

# copy the script to a temp file under a common name
# so that we can reference always to the same name in the pod
SCRIPT_DIR=$(mktemp -d)
NEW_SCRIPT_PATH="${SCRIPT_DIR}/script.js"

cp "$TEMP_SCRIPT_PATH" "$NEW_SCRIPT_PATH"

echo "Creating configmap..."
kubectl create configmap -n "$NAMESPACE" load-test --from-file="../tests/util.js" --from-file="$NEW_SCRIPT_PATH"

rm -rf "$SCRIPT_DIR"

echo "Deploying k6 job..."
kubectl apply -n "$NAMESPACE" -f job-rate-executor.yaml

echo "Waiting for the job to finish..."
kubectl wait -n $NAMESPACE --for=condition=complete --timeout=$DURATION jobs/load-test &
COMPLETE_PID=$!
kubectl wait -n $NAMESPACE --for=condition=failed --timeout=$DURATION jobs/load-test &
FAILED_PID=$!
wait -n $COMPLETE_PID $FAILED_PID
kill $COMPLETE_PID $FAILED_PID 2> /dev/null || true

echo "Getting job exit code..."
POD_NAME=$(kubectl get pods -n "$NAMESPACE" -l job-name=load-test -o jsonpath='{.items[0].metadata.name}')
EXIT_CODE=$(kubectl get pods -n "$NAMESPACE" "$POD_NAME" -o jsonpath='{.status.containerStatuses[0].state.terminated.exitCode}')
echo "Job exit code: $EXIT_CODE"

echo "Extracting logs and summary..."
kubectl logs -n "$NAMESPACE" jobs/load-test > "$(basename "$SCRIPT")-rate-${RATE}-duration-${DURATION}-logs.txt"

echo "Clean up job and configmap..."
kubectl delete -n "$NAMESPACE" jobs load-test
kubectl delete -n "$NAMESPACE" configmap load-test
kubectl delete clusterrolebinding load-test

echo "Clean up..."
kubectl delete ns "$NAMESPACE"

exit $EXIT_CODE
