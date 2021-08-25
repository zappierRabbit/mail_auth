exports.validator = (fields , req) => {
    let errors = [];
    fields.forEach(field => {
        if (req[field] === undefined || req[field] === null || req[field] === '' ) {
            errors.push(field + ' is required');
        }
    });
    return errors;
};