pipeline {
    agent any
    environment {
        REGISTRY = "devesh11411"
        APP_NAME = "shopease-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/DeveshRathod/Shopease-frontend.git'
            }
        }

        stage('Determine Image Tag') {
            steps {
                script {
                    env.IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    echo "Using commit SHA as IMAGE_TAG: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build & Push Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                            docker build -t $REGISTRY/$APP_NAME:$IMAGE_TAG .
                            docker push $REGISTRY/$APP_NAME:$IMAGE_TAG
                        '''
                    }
                }
            }
        }
    }
}
