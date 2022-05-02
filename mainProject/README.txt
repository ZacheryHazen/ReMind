1. To run the Re-Mind web application on localhost:3000, one should first download the files necessary for running the project (the directory mainProject) and unzip them.

2. Install node.js on your machine if it is not uninstalled from https://nodejs.org/en/download/. The basic installation will be sufficient and no additional options need to be selected while installing.

3. To set up the SQL server, first install SQL Server Express from https://www.microsoft.com/en-us/sql-server/sql-server-downloads. Be sure to download the Express version of SQL under "Or, download a free specialized edition" rather than the Developer version.

4. Select 'Custom' as the installation type and choose wherever you'd like the database to be stored.

5. Select 'New SQL Server stand-alone installation or add features to an existing installation' on the Installation window.

6. Proceed through the installation steps, accepting the license agreement and selecting Next until the Feature Selection window, where only the 'Database Engine Services', 'SQL Server Replication', and 'Client Tools Connectivity' need be selected.

7. On the next page, select 'Named instance' and enter the named instance to be 'ReMindDB'. Enter 'REMINDDB' as the Instance ID and select Next.

8. Ensure that the Startup Type for the SQL Server Database Engine and the SQL Server Browser is 'Automatic'. Select Next.

9. On the next page (Database Engine Configuration) select Mixed Mode (SQL Server authentication and Windows authentication) for the Authentication Mode.

10. Enter the password 'pass' into the password field.

11. Open Sql Server Configuration Manager and select SQL Server Network Configuration, and then select Protocols for REMINDDB.

12. Right click on TCP/IP and click 'Enable' if the Status currently reads 'Disabled'. Then right-click on it once more and select Properties.

13. Click on IP Addresses and scroll to the bottom to IPAll, in which to the right of TCP Port enter 1443 and click Apply.

14. Click on SQL Server Services on the left and then right-click on SQL SERVER (REMINDDB). Select Restart and then right click on SQL Server Browser and select Restart.

15. Install SQL Server Management Studio from https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15.

16. Enter in the Server Name field the name of your computer and '\REMINDDB'. Select 'SQL Server Authentication' and enter 'sa' into the Login field and then enter 'pass' in the Password field.

17. Click Connect and then click File, then click Open, and then click File... and select the 'DatabaseCreationScript.sql' file in the mainProject directory.

18. Click 'Execute' in SSMS and you should see 'Commands completed successfully' in the Messages window. 

19. Click File, Open, and then File... once again and select the 'SchemaCreationScript.sql' file in the mainProject directory.

20. To the left of 'Execute' in SSMS, change the database from 'master' to 'reMind'. Then click 'Execute'.

21. Click File, Open, and then File... one more time and select the 'TableCreationScripts.sql' file in the mainProject directory. Click 'Execute' in SSMS once more.

22. Open your Command Prompt or Terminal and navigate to where the project was downloaded and enter the command "npm install".

23. Run the command 'node index.js' in the command prompt and then open Google Chrome and navigate to 'http://localhost:3000'.

24. Be sure to enable the #enable-experimental-web-platform-features flag in Chrome for notifications to work as detailed in https://www.pcmag.com/how-to/how-to-enhance-chrome-with-googles-experimental-flags.