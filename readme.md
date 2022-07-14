# In progress App
## author: Wiktor Kuna

[This app is in progress :)]

&nbsp;
### **About In progress App**

&nbsp; &nbsp; In progress App is used for learning english. 0.1.0 version contains Crazy Words game (without the editor) and global chat to contact with currently active users. You can also create and delete your user account.

&nbsp;
### **About configuration:**

1. You have to configure and run your SQL database (you can find the draft of DB in **apka_test.sql** file). You should create a new account using this application and change in DB client property "isAdmin" and "isActive" from "NULL" for 1 value. If you will do that, this new user will be active with an admin abilities.

    > The configuration of connection with database is in ***./utils/db.js*** file.

2. Look at ***config.js*** file.

3. Run this server (**npm start**) and go to [http://localhost:3000/](http://localhost:3000/ "your local server")

&nbsp;
### **Todo:**
1. **CODE REFACTORING**
2. Change a "chaotic API" for the REST API
3. Correction of displayed errors 


&nbsp;
### **What should be changed/added in the next version of this app?**
1. Use of TypeScript
2. Frontend: React.js instead of express-handlebars
3. Crazy Words Editor
4. New Games
5. Chat with specific users (not only global chat)
6. Safer way of an authorization and authentication