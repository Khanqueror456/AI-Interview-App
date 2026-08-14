// We wrap every async controller with asyncHandler. Since every async function returns a Promise, Promise.resolve() guarantees we're working with a Promise, and .catch(next) automatically forwards any rejected Promise to Express's global error handler.

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
        .catch(next);
    }
};

export default asyncHandler;