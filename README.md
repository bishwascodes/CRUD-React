Increase Uther Lightbringer's health by 25.
  Error - Name must be alphanumeric.

Change Shadowheart's level to 15.
  Invalid character class.

Increase Geralt of Rivia's health by 10.
  Name must be alphanumeric.

Answer the following questions in your README:

## Which updates succeeded, and which failed?

 - Amongst the three editing that I tried to do, all of them failed.

## What error messages did the backend return?

- Increase Uther Lightbringer's health by 25.
  Error - Name must be alphanumeric.

- Change Shadowheart's level to 15.
  Invalid character class.

- Increase Geralt of Rivia's health by 10.
  Name must be alphanumeric.


## Why might a character be successfully retrieved but rejected when updated?
- Because, the characters were initially inserted directly via DB SQL query. But, now, when we try to updated those via our API, our api validates those against certain rules and it doesn't let it update if all the values in the character are not matching the validation that we set. But, when retriving the data, it doesn't check for the validation so it still retrives the data but just rejects when we try to update it.

## How does your React application display API errors?
I've set up a helper function getErrorMessage(response: Response) that checks the error message and gets the actual error message out of it. For every API requests that I make, I have a state variable called 'error', and if the response of the request is not okay, I store the error message in the error variable. When there is any value in the error message, I display it.  