const eventModel = require("../model/eventSchema");
const venueModel = require("../model/venueSchema");
const userModel = require("../model/userSchema");
const organizerModel = require("../model/organizerSchema");
const fs = require("fs");
const cloudinary = require("../cloudinary/cloudinary");

module.exports = {
  getAllUnApprovedEvents: async (req, res) => {
    const unApprovredEvents = await eventModel
      .find({ isApproved: false })
      .populate("createdBy");
    res.status(200).json({
      message: "success",
      data: unApprovredEvents,
    });
  },
  approveAnEvent: async (req, res) => {
    const eventId = req.params.id;

    const updatedEvent = await eventModel.findByIdAndUpdate(
      eventId,
      { isApproved: true },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json(updatedEvent);
  },
  getAllApprovedEvents: async (req, res) => {
    const approvedEvents = await eventModel
      .find({ isApproved: true })
      .populate("createdBy");

    return res.status(200).json({
      message: "success",
      data: approvedEvents,
    });
  },
  createVenue: async (req, res) => {
    let urls = [];

    const { title, place, maximumSeats, facilities, price, mapUrl } = req.body;
    
    const organizerId = req.params.id;

    const uploader = async (path) => await cloudinary.uploads(path, "images");
    if (req.method == "POST") {
      const files = req.files;
      console.log("files", files);

      for (const file of files) {
        const { path } = file;

        const newPath = await uploader(path);

        urls.push(newPath);

        fs.unlinkSync(path);
      }

      const venue = new venueModel({
        title,
        place,
        maximumSeats,
        Facilities: facilities.split(","),
        images: urls,
        price,
        mapUrl,
        createdBy:organizerId,
      });
      await venue.save();
      res.status(200).json({
        status: "success",
        message: "venue created succesfully",
        data: venue,
      });
    } else {
      res.status(400).json({
        err: " image not uploaded",
      });
    }
  },
  getAllVenue: async (req, res) => {
    const organizerId = req.params.id;
    
    const allVenues = await venueModel.find({createdBy:organizerId});

    return res.status(200).json({
      status: "success",
      message: "all venues fetched",
      data: allVenues,
    });
  },
  getTotalVenues: async (req,res) => {
    const allVenues = await venueModel.find({});

    return res.status(200).json({
      status: "success",
      message: "all venues fetched",
      data: allVenues,
    });
  },
  getAllUsers: async (req, res) => {
    const users = await userModel.find({});

    return res.status(200).json({
      status: "success",
      message: "all users listed",
      data: users,
    });
  },
  getAllOrganizers: async (req, res) => {
    const vendors = await organizerModel.find({});

    return res.status(200).json({
      status: "success",
      message: "all vendors listed",
      data: vendors,
    });
  },
  deleteUser: async (req, res) => {
    const userId = req.params.id;

    const deleteUser = await userModel.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      status:"success",
      message: "User deleted successfully",
      data:deleteUser
    });  
  },

  deleteOrganizer : async (req,res) => {
    const organizerId = req.params.id;

    const deleteOrganizer = await organizerModel.findByIdAndDelete(organizerId)

    if (!deleteOrganizer) {
      return res.status(404).json({ message: "Organizer not found" });
  }

  res.status(200).json({
    status:"success",
    message: "Organizer deleted successfully",
    data:deleteOrganizer
  });

},

fetchStatistics: async (req,res) => {

  const userNumber = await userModel.countDocuments({})

  const organizerNumber = await organizerModel.countDocuments({})

  const eventNumber = await eventModel.countDocuments({})

  res.status(200).json({
    status:"success",
    message: "statistics fetched successfully",
    data:{userNumber,organizerNumber,eventNumber}
  });

},
fetchName : async (req,res) => {

  const id = req.params.id;
  let userName, organizerName;

  const user = await userModel.findById(id).populate();
  if (user) {
    userName = user.username; 
  } else {
    const organizer = await organizerModel.findById(id).populate();
    if (organizer) {
      organizerName = organizer.username;
    } else {
      return res.status(404).json({
        status: "error",
        message: "User or organizer not found",
      });
    }
  }
  res.status(200).json({
    status:"success",
    message: "name fetched successfully",
    data:{userName,organizerName}
  });
},
};
