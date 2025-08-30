const jwtProvider=require("../config/jwtProvider")
// const userService=require("../services/user.service")
const jwt = require('jsonwebtoken');


const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token,process.env.SECERET_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({message:err.message, status:false});
        }
        req.user = user;
        console.log("PASS")
        next();
      });
    } else {
      res.status(401).json({message:'token not found'});
    }
  };
  
// const authenticate = async(req,res,next)=>{

//     try {

//         const token=req.headers.authorization?.split(" ")[1]
//         if(!token){
//             return req.status(404).send({message:"token not found"})
//         }

//         // const userId=jwtProvider.getUserIdFromToken(token);
//         // const user=await userService.findUserById(userId);

//         // req.user=user;
//     } catch (error) {
//         return res.status(500).send({error:error.message})
//     }
//     next();
// }

module.exports=authenticate;