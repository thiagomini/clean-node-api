# Create Survey

## Success cases:
1. ⛔ Receives a **POST** request over **/api/surveys**
1. ⛔ Validates a request was made by an admin
1. ⛔ Validates required fields: **question** and **answers**
1. ⛔ Creates a survey with given data
1. ✅ Returns 204 on survey creation

## Exceptions:
1. ⛔ Returns 404 if API does not exist
1. ⛔ Returns 403 if user is not an admin
1. ✅ Returns 400 if **question** or **answers** are not provided
1. ✅ Returns 500 if an error is encountered when creating a survey