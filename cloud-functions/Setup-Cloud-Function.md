# Setup Google Cloud Functions

## Cloud Function for `generateSignedUrls`

Step-1. Go to GCP Console.\
Step-2. Navigate to Cloud Functions.\
Step-3. Create a 2nd Gen Cloud Function.

### Basics
Environment = `2nd Gen` \
Function name = `generateSignedUrls` \
Region = `us-central1` \
Trigger type = `HTTPS` \
In Authentication: set to `Allow unauthenticated invocations`

### Runtime, build, connections and security settings
All setting as it is.\
Set Runtime service account.\
Service account = `App Engine default service account`

click Next.

Runtime = `Nodejs 20` \
Entry point = `generateSignedUrls` \
copy and past `index.js` & `package.json` from repo.\
Note: Make sure to change and set your projectId: `<YOUR-PROJECT-ID>`

### Open Cloud Shell to set Permissions
Run in CLOUD SHELL

    gcloud functions add-iam-policy-binding generateSignedUrls \
      --member="allUsers" \
      --role="roles/cloudfunctions.invoker"
      
Authenticate vie Google

also run these two commands.
### Add `iam.serviceAccountTokenCreator` role to your Service Account

    gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
      --member="serviceAccount:YOUR-PROJECT-ID@appspot.gserviceaccount.com" \
      --role="roles/iam.serviceAccountTokenCreator"

### Add `storage.admin` role to your Service Account
    gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
      --member="serviceAccount:YOUR-PROJECT-ID@appspot.gserviceaccount.com" \
      --role="roles/storage.admin"

Make Sure to change `YOUR-PROJECT-ID` to your ProjectId in both command.

## Cloud Function for `getVertexRes`

Step-1. Go to GCP Console.\
Step-2. Navigate to Cloud Functions.\
Step-3. Create a 2nd Gen Cloud Function.

### Basics
Environment = `2nd Gen` \
Function name = `getVertexRes` \
Region = `us-central1` \
Trigger type = `HTTPS` \
In Authentication: set to `Allow unauthenticated invocations`

### Runtime, build, connections and security settings
All setting as it is.\
Set Runtime service account.\
Service account = `Default service account`

click Next.

Runtime = `Nodejs 20` \
Entry point = `getVertexRes` \
copy and past `index.js` & `package.json` from repo.\
Note: Make sure to change and set your projectId: `<YOUR-PROJECT-ID>`
