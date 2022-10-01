# List Survey

## Success cases:

1. ✅ Receives a **GET** request over **/api/surveys**
1. ✅ Validates if the request is authenticated
1. ✅ Returns 200 with survey data

## Exceptions:

1. ✅ Returns 404 if API does not exist
1. ✅ Returns 403 if request is not authenticated
1. ✅ Returns 500 if an error is encountered when listing surveys
