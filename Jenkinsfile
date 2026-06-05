pipeline {
    agent any

    environment {
        AWS_REGION      = 'us-east-1'
        ECR_REGISTRY    = '203637463799.dkr.ecr.us-east-1.amazonaws.com'
        ECR_REPO        = 'eks-project-backend'
        IMAGE_TAG       = "${BUILD_NUMBER}"
        CLUSTER_NAME    = 'eks-project-eks'
        NAMESPACE       = 'olfactory'
        HELM_RELEASE    = 'olfactory-backend'
        FRONTEND_URL    = 'a0c8dfa58ebdf47ef9249224f6d34d60-786203290.us-east-1.elb.amazonaws.com'
    }

    stages {

        stage('Checkout') {
            steps {
                // Jenkins pulls the latest code from GitHub
                checkout scm
            }
        }

        stage('Lint & Type Check') {
            steps {
                sh 'npm ci'
                sh 'npx prisma generate'
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    sh """
                        docker build \
                          -t ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG} \
                          -t ${ECR_REGISTRY}/${ECR_REPO}:latest \
                          .
                    """
                }
            }
        }

        stage('Push to ECR') {
            steps {
                script {
                    // Login to ECR using the Jenkins EC2 IAM role
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} \
                          | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    """
                    sh "docker push ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}"
                    sh "docker push ${ECR_REGISTRY}/${ECR_REPO}:latest"
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                script {
                    // Update kubeconfig so kubectl can reach the cluster
                    sh "aws eks update-kubeconfig --region ${AWS_REGION} --name ${CLUSTER_NAME}"

                    // Create namespace if it doesn't exist
                    sh "kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -"

                    // Deploy via Helm
                    withCredentials([string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL')]) {
                        sh """
                            helm upgrade --install ${HELM_RELEASE} ./helm/olfactory-fragrance-backend \
                              --namespace ${NAMESPACE} \
                              --set image.repository=${ECR_REGISTRY}/${ECR_REPO} \
                              --set image.tag=${IMAGE_TAG} \
                              --set secrets.DATABASE_URL="${DATABASE_URL}" \
                              --set env.CORS_ORIGIN="http://${FRONTEND_URL}" \
                              --wait
                        """
                    }
                }
            }
        }

    }

    post {
        success {
            echo "Backend deployed successfully - image tag: ${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed - check logs above"
        }
        always {
            // Clean up local Docker images to save disk space on Jenkins
            sh "docker rmi ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG} || true"
        }
    }
}