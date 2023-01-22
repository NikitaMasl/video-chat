const CommonErrors = {
    // Something went wrong on server
    service: {
        code: 'common__service',
        message: 'internal error',
    },
    // Resource or method not found
    notFound: {
        code: 'common__not_found',
        message: 'not found',
    },
    // Authorization error
    unauthorized: {
        code: 'common__unauthorized',
        message: 'unauthorized',
    },
    // Wrong or malformed request
    badRequest: {
        code: 'common__bad_request',
        message: 'bad request',
    },
    // Access is denied for current resource
    forbidden: {
        code: 'common__forbidden',
        message: 'forbidden',
    },
};

export default CommonErrors;
