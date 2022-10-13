# Save Survey Result

## Success cases:

1. ⛔ Receives a **PUT** request over **/api/surveys/{survey_id}/results**
1. ✅ Creates a survey result with provided data if no record exists yet.
1. ✅ Updates a survey result with provided data if no record exists yet.
1. ✅ Returns 204 on success

## Exceptions:

1. ✅ Returns 404 if API does not exist
1. ⛔ Returns 403 if request is not authenticated
1. ✅ Returns 404 if survey_id does not exist
1. ✅ Returns 404 if account id does not exist
1. ✅ Returns 400 if given answer is invalid
1. ✅ Returns 500 if an error is encountered when creating survey answer
