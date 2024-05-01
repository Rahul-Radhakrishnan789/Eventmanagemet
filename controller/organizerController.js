const eventModel = require("../model/eventSchema");
const orderModel = require("../model/orderSchema");
const venueModel = require("../model/venueSchema")
const fs = require("fs");
const cloudinary = require("../cloudinary/cloudinary");

module.exports = {
  addAnEvent: async (req, res) => {
    let url = "";

    const { title, category, description, date, Ticketprice, maximumSeats } =
      req.body;

    const eventId = req.params.id;

    const organizerId = req.params.organizerId;

    const uploader = async (path) => await cloudinary.uploads(path, "images");
    if (req.method == "POST") {
      const files = req.file;

      console.log("files", files);

      const { path } = files;

      const newPath = await uploader(path);

      url = newPath;

      fs.unlinkSync(path);

      const event = new eventModel({
        title,
        category,
        description,
        date,
        Ticketprice,
        maximumSeats,
        image: url,
        venue: eventId,
        createdBy: organizerId,
      });
      await event.save();
      res.status(200).json({
        status: "success",
        message: "Event created succesfully",
        data: event,
      });
    } else {
      res.status(400).json({
        err: " image not uploaded",
      });
    }
  },
  getAlleventByOrganizer: async (req, res) => {
    const id = req.params.id;

    const jobsByorganizer = await eventModel.find({ createdBy: id });

    return res.status(200).json({
      message: "success",
      data: jobsByorganizer,
    });
  },
  getEventData: async (req, res) => {
    const eventId = req.params.id;

    const orders = await orderModel.find({ event: eventId });

      
       const totalAmount = orders.reduce((acc, order) => acc + order.totalAmount, 0);
       const totalTickets = orders.reduce((acc, order) => acc + order.totalTickets, 0);

      
       const populatedOrders = await orderModel.populate(orders, { path: 'userId', select: 'username email' });
      
    return  res.status(200).json({
      status: "success",
      message: "mission success",
      data: { eventId, totalAmount, totalTickets,populatedOrders  }
    });
  },
   deleteEvent : async (req, res) => {
    const eventId = req.params.id;
  
    const deletedEvent = await eventModel.findByIdAndDelete(eventId);
  
    if (!deletedEvent) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      status:"success",
      message: "event deleted successfully",
      data:deletedEvent,
    });  
  },

   editEvent : async (req, res) => {
    const eventId = req.params.id;
    const updatedData = req.body;
  
  
    let updatedImages = [];
    if (req.files) {
      const uploader = async (path) => await cloudinary.uploads(path, "images"); 
      const files = req.files;
  
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        updatedImages.push(newPath.url); 
        fs.unlinkSync(path); 
      }
    }
  
   
    if (updatedData.images && updatedImages.length > 0) {
      updatedData.images = updatedData.images.concat(updatedImages); 
    } else {
      updatedData.images = updatedImages.length > 0 ? updatedImages : undefined; 
    }
  
    const editedEvent = await eventModel.findByIdAndUpdate(eventId, updatedData, { new: true });
  
    if (!editedEvent) {
      return res.status(404).json({ error: 'Bid not found' });
    }
  
    console.log(editedEvent);
  
    return res.json({
      status: "success",
      message: 'event updated successfully',
      data: editedEvent,
    });
  },
  deleteVenue : async (req, res) => {
    const venueId = req.params.id;
  
    const deletedVenue = await venueModel.findByIdAndDelete(venueId);
  
    if (!deletedVenue) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      status:"success",
      message: "event deleted successfully",
      data:deletedVenue,
    });  
  },
   editVenue : async (req, res) => {
    const venueId = req.params.id;
    const updatedData = req.body;
  
  
    let updatedImages = [];
    if (req.files) {
      const uploader = async (path) => await cloudinary.uploads(path, "images"); 
      const files = req.files;
  
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        updatedImages.push(newPath.url); 
        fs.unlinkSync(path); 
      }
    }
  
   
    if (updatedData.images && updatedImages.length > 0) {
      updatedData.images = updatedData.images.concat(updatedImages); 
    } else {
      updatedData.images = updatedImages.length > 0 ? updatedImages : undefined; 
    }
  
    const editedVenue = await venueModel.findByIdAndUpdate(venueId, updatedData, { new: true });
  
    if (!editedVenue) {
      return res.status(404).json({ error: 'venue not found' });
    }
  
    console.log(editedVenue);
  
    return res.json({
      status: "success",
      message: 'venue updated successfully',
      data: editedVenue,
    });
  },
};
