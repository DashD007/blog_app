const asyncHandler = (requestFunction) => async(req,res,next) => {
    try {
        await requestFunction(req,res,next);
    } catch (error) {
        console.log(error,"error,1231")
        return res.status(error.code || 500).json({success:false,message : error?.message});
    }
}

export default asyncHandler;