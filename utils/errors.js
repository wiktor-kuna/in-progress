function handleError(err, req, res, next) {
    console.log(err);
    res.render('error', {
        message: err instanceof ValidationError ? err.message : "Sorry, please try again later... :(",
    });
}

class ValidationError extends Error {}

module.exports = {
    ValidationError,
    handleError
}