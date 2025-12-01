// This pipeline automates the Build, Push, and Deployment of the React application.
pipeline {
    // Defines where the pipeline runs. 'any' means any available agent (your EC2 instance).
    agent any
    
    // Environment variables used throughout the pipeline.
    environment {
        // Replace 'YOUR_DOCKER_USERNAME' with your actual Docker Hub username
        DOCKER_USERNAME = 'bala07-hub' 
        
        // The repository name on Docker Hub
        IMAGE_NAME = "color-palette-generator"
        
        // The name we assign to the running container on the EC2 instance
        CONTAINER_NAME = "color-palette-app"
        
        // The port mapping for deployment (Host:Container)
        PORT_MAPPING = "9000:80"
        
        // Credential ID you must set up in Jenkins (Docker Hub Username/Password or Token)
        DOCKER_CREDENTIAL_ID = 'docker-hub-credentials'
    }

    stages {
        stage('1. Checkout Source Code') {
            steps {
                // Check out the code from the Git repository linked to this job
                script {
                    echo "Checking out Git repository..."
                }
                checkout scm
            }
        }

        stage('2. Docker Build') {
            steps {
                script {
                    // Create a unique tag based on the commit short hash
                    def gitHash = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    def imageTag = "${env.DOCKER_USERNAME}/${env.IMAGE_NAME}:${gitHash}"
                    
                    // Build the Docker image using the existing Dockerfile
                    echo "Building Docker image: ${imageTag}"
                    sh "docker build -t ${imageTag} ."
                    
                    // Store the tag in an environment variable for the next stage
                    env.BUILD_IMAGE_TAG = imageTag
                }
            }
        }

        stage('3. Docker Push') {
            steps {
                // Use the configured Jenkins secret credentials for Docker Hub login
                withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIAL_ID, 
                                                passwordVariable: 'DOCKER_PASSWORD', 
                                                usernameVariable: 'DOCKER_USER')]) {
                    
                    // 1. Log in to Docker Hub
                    sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USER --password-stdin"
                    
                    // 2. Push the unique image
                    sh "docker push ${env.BUILD_IMAGE_TAG}"
                    
                    // 3. Tag and push as 'latest' for easy reference
                    sh "docker tag ${env.BUILD_IMAGE_TAG} ${env.DOCKER_USERNAME}/${env.IMAGE_NAME}:latest"
                    sh "docker push ${env.DOCKER_USERNAME}/${env.IMAGE_NAME}:latest"
                }
            }
        }

        stage('4. Deployment on EC2 (Host)') {
            steps {
                script {
                    echo "Deploying container on the Jenkins host (EC2 instance)..."
                    def finalImage = "${env.DOCKER_USERNAME}/${env.IMAGE_NAME}:${env.BUILD_IMAGE_TAG}"
                    
                    // Check if the old container is running and stop/remove it
                    sh """
                    if docker ps -a | grep ${env.CONTAINER_NAME}; then
                      echo "Stopping existing container: ${env.CONTAINER_NAME}"
                      docker stop ${env.CONTAINER_NAME}
                      docker rm ${env.CONTAINER_NAME}
                    fi
                    """
                    
                    // Pull the new image (necessary if Jenkins agent is separate, harmless otherwise)
                    sh "docker pull ${finalImage}"

                    // Start the new container with the 9000:80 port mapping
                    echo "Starting new container: ${env.CONTAINER_NAME} on port ${env.PORT_MAPPING}"
                    sh "docker run -d -p ${env.PORT_MAPPING} --name ${env.CONTAINER_NAME} ${finalImage}"
                    
                    echo "Deployment complete! Application should be accessible on port 9000."
                }
            }
        }
    }
}