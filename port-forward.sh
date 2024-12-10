kubectl port-forward svc/frontend-service 5173:5173 &
kubectl port-forward svc/api-gateway-service 3000:3000

wait