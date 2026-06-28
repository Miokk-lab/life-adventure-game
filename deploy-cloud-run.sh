#!/bin/bash
# Deploy life-adventure to Google Cloud Run
# Usage: ./deploy-cloud-run.sh YOUR_PROJECT_ID [REGION]
#
# Prerequisites:
#   gcloud auth login
#   gcloud auth configure-docker
#   gcloud services enable run.googleapis.com cloudbuild.googleapis.com

set -e

PROJECT_ID="${1:?Usage: $0 PROJECT_ID [REGION]}"
REGION="${2:-asia-northeast1}"
SERVICE_NAME="life-adventure"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${SERVICE_NAME}/${SERVICE_NAME}"

echo "Building and pushing image to ${IMAGE}..."
gcloud builds submit --tag "${IMAGE}" --project "${PROJECT_ID}"

echo "Deploying to Cloud Run in ${REGION}..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --update-env-vars "NODE_ENV=production,AGENT_RUNTIME_URL=https://us-east1-aiplatform.googleapis.com/reasoningEngines/v1/projects/13327342976/locations/us-east1/reasoningEngines/6954507802706444288/api" \
  --project "${PROJECT_ID}"

echo ""
echo "Deployed! Set secrets via:"
echo "  gcloud run services update ${SERVICE_NAME} \\"
echo "    --region ${REGION} \\"
echo "    --update-env-vars DEEPSEEK_API_KEY=xxx,GEMINI_API_KEY=xxx,AGNES_API_KEY=xxx \\"
echo "    --project ${PROJECT_ID}"
