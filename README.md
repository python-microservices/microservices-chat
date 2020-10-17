# Chat microservices

Example of 3 microservices and a database working in a Kubernetes cluster.

The objetive of this project is to show a real example of our library [PyMS](https://github.com/python-microservices/pyms),
 [the template](https://github.com/python-microservices/microservices-template) and
the [scaffold](https://github.com/python-microservices/microservices-scaffold).

The tutorial of "how to create a cluster" is based of this [bitnami tutorial](https://docs.bitnami.com/kubernetes/get-started-kubernetes/)


## Step 1: Configure The Platform
The first step for working with Kubernetes clusters is to have Minikube installed if you have selected to work locally.

Install Minikube in your local system, either by using a virtualization software such as VirtualBox or a local terminal.

* Browse to the [Minikube latest releases page](https://github.com/kubernetes/minikube/releases).

* Select the distribution you wish to download depending on your Operating System.

  NOTE: This tutorial assumes that you are using Mac OSX or Linux OS. The Minikube installer for Windows is under development. To get an experimental release of Minikube for Windows, check the Minikube releases page.

* Open a new console window on the local system or open your VirtualBox.

* To obtain the latest Minikube release, execute the following command depending on your OS. Remember to replace the X.Y.Z and OS_DISTRIBUTION placeholders with the latest version and software distribution of Minikube respectively. Check the Minikube latest releases page for more information on this.

  ```bash
  curl -Lo minikube https://storage.googleapis.com/minikube/releases/vX.Y.Z/minikube-OS_DISTRIBUTION-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/
  ```

## Step 2: Create A Kubernetes Cluster
By starting Minikube, a single-node cluster is created. Run the following command in your terminal to complete the creation of the cluster:

```bash
minikube start
```


Install ingress

```
minikube addons enable ingress
```

Set the environment of docker
```bash
eval $(minikube docker-env)
```

To run your commands against Kubernetes clusters, the kubectl CLI is needed. Check step 3 to complete the installation of kubectl.


## Step 3: Install The Kubectl Command-Line Tool
In order to start working on a Kubernetes cluster, it is necessary to install the Kubernetes command line (kubectl). Follow these steps to install the kubectl CLI:

* Execute the following commands to install the kubectl CLI. OS_DISTRIBUTION is a placeholder for the binary distribution of kubectl, remember to replace it with the corresponding distribution for your Operating System (OS).

  ```bash
  curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/OS_DISTRIBUTION/amd64/kubectl
  chmod +x ./kubectl
  sudo mv ./kubectl /usr/local/bin/kubectl
  ```
  
  TIP: Once the kubectl CLI is installed, you can obtain information about the current version with the kubectl version command.

  NOTE: You can also install kubectl by using the sudo apt-get install kubectl command.

* Check that kubectl is correctly installed and configured by running the kubectl cluster-info command:

  ```bash
  kubectl cluster-info
  ```
  
  NOTE: The kubectl cluster-info command shows the IP addresses of the Kubernetes node master and its services.

  ![Check Kubernetes cluster info](https://docs.bitnami.com/images/img/platforms/kubernetes/k8-tutorial-31.png)

* You can also verify the cluster by checking the nodes. Use the following command to list the connected nodes:
  
  ```bash
  kubectl get nodes
  ```
  ![Check cluster node](https://docs.bitnami.com/images/img/platforms/kubernetes/k8-tutorial-32-single.png)


* To get complete information on each node, run the following:

  ```bash
  kubectl describe node
  ```
  ![Check Kubernetes node info](https://docs.bitnami.com/images/img/platforms/kubernetes/k8-tutorial-33.png)


[Learn more about the kubectl CLI](https://kubernetes.io/docs/user-guide/kubectl-overview/).

## Step 4: Install And Configure Helm And Tiller
The easiest way to run and manage applications in a Kubernetes cluster is using Helm. Helm allows you to perform key operations for managing applications such as install, upgrade or delete. Helm is composed of two parts: Helm (the client) and Tiller (the server). Follow the steps below to complete both Helm and Tiller installation and create the necessary Kubernetes objects to make Helm work with Role-Based Access Control (RBAC):

* To install Helm, run the following commands:

  ```bash
  curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh
  chmod 700 get_helm.sh
  ./get_helm.sh
  ```
  
  TIP: If you are using OS X you can install it with the brew install command: brew install kubernetes-helm.

* Create a ClusterRole configuration file with the content below. In this example, it is named clusterrole.yaml.

  ```yaml
  apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRole
  metadata:
    annotations:
      rbac.authorization.kubernetes.io/autoupdate: "true"
    labels:
      kubernetes.io/bootstrapping: rbac-defaults
    name: cluster-admin
  rules:
  - apiGroups:
    - '*'
    resources:
    - '*'
    verbs:
    - '*'
  - nonResourceURLs:
    - '*'
    verbs:
    - '*'
  ```

* To create the ClusterRole, run this command:

  ```bash
  kubectl create -f clusterrole.yaml
  ```
  
* To create a ServiceAccount and associate it with the ClusterRole, use a ClusterRoleBinding, as below:

  ```bash
  kubectl create serviceaccount -n kube-system tiller
  kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
  ```

* Initialize Helm as shown below:

  ```bash
  helm init --service-account tiller
  ```
  If you have previously initialized Helm, execute the following command to upgrade it:

  ```bash
  helm init --upgrade --service-account tiller
  ```
* Check if Tiller is correctly installed by checking the output of kubectl get pods as shown below:

  ```bash
  kubectl --namespace kube-system get pods | grep tiller
    tiller-deploy-2885612843-xrj5m   1/1       Running   0   4d
  ```

Once you have installed Helm, a set of useful commands to perform common actions is shown below:

![Install Helm](https://docs.bitnami.com/images/img/platforms/kubernetes/k8-tutorial-41.png)

## Step 5

Create the docker images:

  ```bash
  docker build -t chat_db:v1 -f chat_db/Dockerfile chat_db/
  docker build -t chat_svc:v1 -f chat_svc/Dockerfile chat_svc/
  docker build -t chat_front:v1 -f chat_front/Dockerfile chat_front/

  ```
  
Check your helm charts:

  ```bash
  helm install --dry-run --debug ./chat_db/chat_db/
  helm install --dry-run --debug ./chat_svc/chat_svc/
  helm install --dry-run --debug ./chat_front/chat_front/
  ```

Install helm charts:

  ```bash
  helm install --name chat-db ./chat_db/chat_db/
  helm install --name chat-svc ./chat_svc/chat_svc/
  helm install --name chat-front ./chat_front/chat_front/
  ```

# Step 6

Open http://127.0.0.1.nip.io/ and see the magic! ;)

If this URL doesn't work, maybe you need to install a nginx and redirect the traffic from 127.0.0.1 to the minikube IP,
for example, you can use nginx.


- Check your Minikube IP with:
  ```
  minikube ip
  ```
- Edit your nginx config with this code as example: See [this example](nginx_example_conf)
  ```
  vim /etc/nginx/sites-enabled/default
  ```

