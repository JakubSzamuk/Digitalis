#!/bin/bash

# Take user input for a name for the container, the image to use and the port then the domain
read -p "Name of the container: " name
read -p "Image to use: " image
read -p "Container Port to use: " port
read -p "Second Port to use: " portTwo
read -p "Domain: " domain




modified_domain=$(echo $domain | sed 's/\./-/g')

mkdir temp-$name
cd temp-$name

echo "
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: $name-deployment
  spec:
    selector:
      matchLabels:
        app: $name
    template:
      metadata:
        labels:
          app: $name
      spec:
        containers:
        - name: $name
          image: $image
          ports:
          - containerPort: $port

  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: $name-service
  spec:
    selector:
      app: $name
    ports:
    - port: $portTwo
      targetPort: $port
  ---
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: $name-ingress
    labels:
      name: $name
  spec:
    ingressClassName: traefik
    rules:
    - host: $domain
      http:
        paths:
        - pathType: Prefix
          path: "/"
          backend:
            service:
              name: $name-service
              port: 
                number: $portTwo

  ---
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: $name-ingress
    labels:
      name: $name-ingressLabel2
    annotations:
      traefik.ingress.kubernetes.io/router.entrypoints: web, websecure
      traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd
      cert-manager.io/cluster-issuer: letsencrypt-prod 
  spec:
    ingressClassName: traefik
    rules:
    - host: $domain
      http:
        paths:
        - pathType: Prefix
          path: "/"
          backend:
            service:
              name: $name-service
              port:
                number: $portTwo
    tls:
      - secretName: $modified_domain-tls
        hosts:
          - $domain
" > $name-temp-setup.yaml

sudo kubectl apply -f $name-temp-setup.yaml

counter=0
read -p "Would you like to add an extra connected container" extraDecision

while [ $extraDecision == "y" ]; do
  
done
echo "Done bye."