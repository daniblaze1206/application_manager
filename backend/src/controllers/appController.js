const applicationModel = require("../models/Application");
const applicationValidator = require("../validators/applicationValidator");
const { isValidObjectId } = require("mongoose");

const createApplication = async (req, res) => {
  try {
    const validationResult = applicationValidator(req.body);
    if (validationResult && validationResult.length > 0) {
      return res.status(422).json({
        success: false,
        message: "Invalid input",
        errors: validationResult,
      });
    }
    const {
      universityName,
      country,
      programName,
      contactEmail,
      applicationMethod,
      applicationDate,
      status,
      note,
    } = req.body;
    const userId = req.user._id;

    if (userId && !isValidObjectId(userId)) {
      return res.status(422).json({
        success: false,
        message: "Invalid user ID format",
        field: "user",
      });
    }

    const date = new Date(applicationDate);
    if (isNaN(date.getTime())) {
      return res.status(422).json({
        success: false,
        message: "Invalid application date format",
        field: "applicationDate",
        expected: "YYYY-MM-DD (e.g., 2024-12-25)",
      });
    }

    const newApplication = await applicationModel.create({
      userId,
      universityName: universityName?.trim().toLowerCase(),
      country: country?.trim().toLowerCase(),
      programName: programName?.trim().toLowerCase(),
      contactEmail: contactEmail?.toLowerCase()?.trim(),
      applicationMethod: applicationMethod?.trim(),
      applicationDate: date,
      status: status || "NOT_APPLIED",
      note: note?.trim(),
    });

    return res.status(201).json({
      success: true,
      newApplication,
      message: "New application created successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "server error", error: error.message });
  }
};

const getAllUserApplications = async (req, res) => {
  const user = req.user;
  const { country, status, applicationMethod, universityName } = req.query;
  try {
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const query = { userId: user._id };
    if (country) query.country = country.trim().toLowerCase();
    if (status) query.status = status;
    if (applicationMethod)
      query.applicationMethod = applicationMethod.trim().toLowerCase();
    if (universityName) {
      query.universityName = {
        $regex: universityName.trim(),
        $options: "i",
      };
    }
    const userApplications = await applicationModel.find(query);

    if (!userApplications.length) {
      return res
        .status(404)
        .json({ status: false, message: "you dont have any applications" });
    }
    return res.status(200).json({
      success: true,
      count: userApplications.length,
      applications: userApplications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error: ",
      error: error.message,
    });
  }
};

const updateApplication = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedApplication = await applicationModel.findByIdAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      updatedData,
      { new: true },
    );
    if (!updatedApplication) {
      return res.status(404).json({ message: "application not found" });
    }
    return res.status(200).json(updatedApplication);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error: ", error: error.message });
  }
};

const deleteApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedApplication = await applicationModel.findByIdAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deletedApplication) {
      return res.status(404).json({ message: "application not found" });
    }

    return res.status(200).json({
      message: "application deleted successfully",
      application: deletedApplication,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error: ", error: error.message });
  }
};

const getApplicationFilters = async (req, res) => {
  const user = req.user;

  try {
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const countries = await applicationModel.distinct("country", {
      userId: user._id,
    });
    const status = await applicationModel.distinct("status", {
      userId: user._id,
    });
    const method = await applicationModel.distinct("applicationMethod", {
      userId: user._id,
    });


    return res.status(200).json({
      success: true,
      filters: {
        countries,
        status,
        method,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "server error", error: error.message });
  }
};

module.exports = {
  createApplication,
  getAllUserApplications,
  updateApplication,
  deleteApplication,
  getApplicationFilters,
};
