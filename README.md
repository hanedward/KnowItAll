TEST

Steps to Run KnowItAll:
1. install Node, Angular, Express, MySQL
2. Open up MySQL and connect to a localhost. Open up the scripts in the LetsGITit directory and run DUMP.sql script first, and then DummyData.sql after (in that exact order).
3. Once you installed, inside the directory of LetsGITit in the terminal, run this command: npm start
4. In Chrome, goto the url localhost:8080 to access the webpage

WHAT WORKS:
- signing up a new user with a usc email address:
	- sign up a nonexisting user with a valid email address
	- sign into that email address account and copy and paste the link provided by KnowItAll and enter it into a new tab/window
	- the KnowItAll page will dipslay that you have registered succesfully and are now signed in

- logging in:
	- if the user exists in the database, it will log in successfully and redirect to the main/home page.

- for both signUp and Login:
	- validation works:
		- check for empty text fields
		- check if user already exists

- search bar works for tags that exist in the database:
	- when you enter tag: t1 for example, it will display the list of related items on the home page as well as the profile page

- creatingPolls and creatingRatings work
	- creating a poll/rating with right inputs will insert the poll/rating into the database
	- validation works for invalid inputs for the polls/ratings page

- logging out functionality works
	- user will logout

- cookies work
	- user who logged in will stay in session
	- if user trys to log in with the same user account, error message at bottom of login page will display that the user is already logged in.
