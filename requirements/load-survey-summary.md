# Load Survey Result

## Success cases:

1. ✅ Receives a **GET** request over **/api/surveys/{survey_id}/summary**
1. ✅ Returns 200 with the survey summary data on success

## Exceptions:

1. ✅ Returns 404 if API does not exist
1. ✅ Returns 404 if survey does not exist
1. ✅ Returns 403 if request is not authenticated
1. ✅ Returns 500 if an error is encountered when creating survey answer
