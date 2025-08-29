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
                    def commitMsg = sh(script: "git log -1 --pretty=%s", returnStdout: true).trim()
                    
                    if (commitMsg ==~ /^v[0-9]+\.[0-9]+\.[0-9]+$/) {
                        env.IMAGE_TAG = commitMsg
                    } else {
                        error "Commit message '${commitMsg}' is not a valid version (expected format vX.Y.Z)"
                    }

                    echo "Using semantic version as IMAGE_TAG: ${env.IMAGE_TAG}"
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
