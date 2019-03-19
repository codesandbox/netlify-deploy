pipeline {
  agent any
  environment {
    IMAGE_NAME = 'gcr.io/codesandbox-153802/netlify-deploy'
  }
  stages {
    stage('Build image') {
      steps {
        container('docker') {
          sh "docker build -t ${IMAGE_NAME}:${GIT_COMMIT[0..6]} ."
        }
      }
    }
    stage('Push image to Google Container Registry') {
      steps {
        container('docker') {
          withDockerRegistry([ credentialsId: "gcr", url: "https://gcr.io" ]) {
            sh "docker push ${IMAGE_NAME}:${GIT_COMMIT[0..6]}"
          }
        }
      }
    }
  }
}
