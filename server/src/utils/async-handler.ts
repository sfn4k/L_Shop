type RequestHandler = import("express").RequestHandler;

export function asyncHandler(handler: RequestHandler): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
}
