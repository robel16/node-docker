const protect = async (req,res,next) =>{
const {user}=  req.session
if(!user){
    return res.status(401).json({
        success:false,
        message: "Unauthorized"
    })
}
req.user = user
next()
}
module.exports =protect