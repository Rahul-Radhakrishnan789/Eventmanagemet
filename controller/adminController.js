const eventModel = require("../model/eventSchema");
const venueModel = require("../model/venueSchema");
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

    const { title, place, maximumSeats, Facilities,price, } = req.body;

    const uploader = async (path) => await cloudinary.uploads(path,"images");
    if (req.method == "POST") {
      const files = req.files;

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
        Facilities,
        images: urls,
        price
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
  getAllVenue:async(req,res) => {
    const allVenues = await venueModel.find({})

    return res.status(200).json({
        status:'success',
        message: "all venues fetched",
        data: allVenues,
      });
  }
};
