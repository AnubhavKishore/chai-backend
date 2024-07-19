const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
        catch((err) => next(err)) 
    }
}

export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = (func) = {() => {}}
// const asyncHandler = (func) = async() => {}

// const asyncHander = (fn) = async(req, res, next) => {            //handling async function using try catch block 
//     try{
//         await fn(req, res, next)
//     } catch(error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }