pipeline {
    agent any

    environment {
        REGISTRY = "devesh11411"
        APP_NAME = "shopease-frontend"
        SONAR_HOST = "http://13.201.0.74:9000"
        SONAR_PROJECT = "shopease-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "Checking out source code..."
                git branch: 'main', url: 'https://github.com/DeveshRathod/Shopease-frontend.git'
            }
        }

        stage('Validate Version Tag') {
            steps {
                script {
                    echo "🔍 Validating commit message for semantic version..."
                    def commitMsg = sh(script: "git log -1 --pretty=%s", returnStdout: true).trim()
                    
                    if (commitMsg ==~ /^v[0-9]+\.[0-9]+\.[0-9]+$/) {
                        env.IMAGE_TAG = commitMsg
                        echo "Using IMAGE_TAG: ${env.IMAGE_TAG}"
                    } else {
                        error "Commit message '${commitMsg}' is not a valid semantic version (expected vX.Y.Z)"
                    }
                }
            }
        }

        stage('Sonar Scan') {
            steps {
                script {
                    def scannerHome = tool 'sonar'
                    withCredentials([string(credentialsId: 'sonar-token2', variable: 'SONAR_TOKEN')]) {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=${SONAR_PROJECT} \
                              -Dsonar.sources=. \
                              -Dsonar.host.url=${SONAR_HOST} \
                              -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    echo "Building Docker image ${REGISTRY}/${APP_NAME}:${IMAGE_TAG}..."
                    sh "docker build -t ${REGISTRY}/${APP_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Trivy Security Scan') {
            steps {
                script {
                    echo "Running Trivy vulnerability scan..."
                    sh """
                        docker run --rm \
                          -v /var/run/docker.sock:/var/run/docker.sock \
                          -v $HOME/.cache:/root/.cache \
                          aquasec/trivy:latest image ${REGISTRY}/${APP_NAME}:${IMAGE_TAG} \
                          --severity HIGH,CRITICAL --exit-code 1 || echo 'Vulnerabilities Found!'
                    """
                }
            }
        }

        stage('Push Docker Image') {
            when { expression { currentBuild.result == null } } 
            steps {
                script {
                    echo "Pushing Docker image to registry..."
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                            docker push ${REGISTRY}/${APP_NAME}:${IMAGE_TAG}
                        """
                    }
                }
            }
        }

        stage('Post-Build Summary') {
            steps {
                script {
                    echo """
                    Pipeline Completed!
                    Image: ${REGISTRY}/${APP_NAME}:${IMAGE_TAG}
                    SonarQube Report: ${SONAR_HOST}/dashboard?id=${SONAR_PROJECT}
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up workspace..."
            sh "docker system prune -f || true"
            cleanWs()
        }
    }
}
