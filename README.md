# Hospital Management System DevOps Project

A complete containerized Hospital Management System with a React frontend, Flask backend, and MongoDB database.

## Architecture

- **Frontend**: React (Vite) + Nginx
- **Backend**: Python Flask REST API
- **Database**: MongoDB (Official Image)
- **Infrastructure**: AWS (VPC, EKS) via Terraform
- **Orchestration**: Kubernetes (Deployments, Services, HPA, PV/PVC)

## Prerequisites

- Docker Desktop
- Terraform
- kubectl
- AWS CLI (configured)

## Getting Started

### 1. Docker Hub Setup
Build and push images to your Docker Hub repository.

```powershell
# Backend
cd backend
docker build -t <your-username>/hospital-backend:latest .
docker push <your-username>/hospital-backend:latest

# Frontend
cd ../frontend
docker build -t <your-username>/hospital-frontend:latest .
docker push <your-username>/hospital-frontend:latest
```

### 2. Infrastructure Provisioning (Important Cost Warning)

> [!WARNING]
> **AWS Free Tier Notice**: The Terraform configuration in this project provisions an Amazon EKS (Elastic Kubernetes Service) cluster and a NAT Gateway. **EKS is NOT covered under the AWS Free Tier.**
If you are strictly using a free account, **DO NOT run `terraform apply`**. Instead, use a free local Kubernetes cluster:
1. Open **Docker Desktop**.
2. Go to Settings > Kubernetes.
3. Check **Enable Kubernetes** and click Apply & Restart.
4. Skip the Terraform steps and proceed directly to Step 3.

If you understand the costs and still want to deploy to AWS:
```powershell
cd ../terraform
terraform init
terraform apply -auto-approve
```

### 3. Kubernetes Deployment
Update the image names in `k8s/backend.yaml` and `k8s/frontend.yaml` with your Docker Hub username.

```powershell
cd ../k8s
kubectl apply -f configmap.yaml
kubectl apply -f mongodb.yaml
kubectl apply -f backend.yaml
kubectl apply -f frontend.yaml
```

### 4. Verification
Check the status of pods and services.

```powershell
kubectl get pods
kubectl get services
kubectl get hpa
```

To use the app locally, you must port-forward both the frontend and the backend so your browser can reach them:

Open terminal 1 (Frontend):
```powershell
kubectl port-forward svc/frontend-service 8080:80
```

Open terminal 2 (Backend):
```powershell
kubectl port-forward svc/backend-service 5000:5000
```
Open `http://localhost:8080` in your browser.

## Features

- **Patient Registration**: Add and track patient records.
- **Doctor Management**: Manage hospital staff profiles.
- **Appointment Booking**: Schedule appointments between patients and doctors.
- **Autoscaling**: Backend automatically scales based on CPU load.
- **Data Persistence**: MongoDB data persists using Persistent Volumes.
