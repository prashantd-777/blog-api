const ErrorCode = require(`../constant/status-code`);
const ErrorConstant = require(`../constant/messages`);

module.exports = {
    setErrorResponse: (serverError, error, res) => {
        if (serverError) {
            console.error(serverError);
        } else {
            console.error(ErrorConstant[error]);
        }

        let httpCode;
        switch (error) {
            case "INVALID_TOKEN":
            case "NO_TOKEN":
                httpCode = ErrorCode["UNAUTHORIZED"]
                break;

            case "INSUFFICIENT_PERMISSIONS":
                httpCode = ErrorCode["FORBIDDEN"]
                break;

            default:
                httpCode = ErrorCode["BAD_REQUEST"];
                break;
        }

        const response = {
            error: {
                code: ErrorCode[error],
                message: ErrorConstant[error]
            }
        };
        return res.status(httpCode).send(response);
    },
    setSuccessResponse: (data, res) => {
        return res.status(ErrorCode["HTTP_SUCCESS"]).send({
            data: data,
            success: true,
            version: "v1"
        });
    },
};