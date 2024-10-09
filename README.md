## Install

1. **Clone repository**:

   ```bash
   git clone https://github.com/doctorGlocktopus/variolytics-frontend.git
   cd variolytics-frontend
   npm i / yarn install

2. **Mock data generation**:
    
    Install MongoDB Atlas

    new connection to (mongodb://localhost:27017)

    create Database 'measurements' with the collection 'measurements'

    create Database 'user_management' with the collection 'users'

    run factorys

    node scripts/generateMdbData.js

    node scripts/generateUserMdbData.js
  
  
