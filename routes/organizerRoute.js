express=require("express")
const router=express.Router()
const tryCatchMiddleware=require("../middlewares/tryCatch")
const organizer=require("../controller/organizerController")
const upload = require('../middlewares/multerMiddleware')

 
router.post("/postevent/:id/:organizerId",upload.single("image"),tryCatchMiddleware(organizer.addAnEvent))

router.get("/getallevents/:id",tryCatchMiddleware(organizer.getAlleventByOrganizer))

router.get("/geteventdata/:id",tryCatchMiddleware(organizer.getEventData))



module.exports=router