const Portfolio = require('../models/portfolio');
const { StatusCodes } = require('http-status-codes');
const res = require('express/lib/response');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Talent = require('../models/talent');
const cloudinary = require('cloudinary').v2;

//Profile page displays the data from portfolio module through get request
const getAuthProfile = async (req, res) => {
  const profile = await Portfolio.findOne({
    createdBy: req.user._id,
  });
  console.log(profile);

  res.json({
    user: req.user,
    profile: profile,
  });
};

const getProfile = async (req, res) => {
  const {
    params: { id: profileId },
  } = req;

  const profile = await Portfolio.findOne({
    _id: profileId,
  });

  if (!profile) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: `No talent with ID ${profileId} found`,
    });
  }

  res.status(StatusCodes.OK).json({
    profile,
  });
};

//talent has access to update their profile directlt from their profile
const updateProfile = async (req, res) => {
  console.log('hello');
  //   console.log(req.files);
  let img;
  if (req.files !== null) {
    img = await cloudinary.uploader.upload(
      req.files.profilePicture.tempFilePath,
      {
        use_filename: true,
        folder: 'file-upload',
      }
    );
    fs.unlinkSync(req.files.profilePicture.tempFilePath);
  }
  console.log(img);

  const skills = req.body.listOfSkills;
  const listOfSkills = [];
  if (skills) {
    Object.keys(skills).forEach(function (skill) {
      listOfSkills.push({
        skill: skills[skill],
      });
    });
  }
  //   console.log(listOfSkills);

  const projects = req.body.projectsDone;
  const projectsDone = [];
  if (projects) {
    Object.keys(projects).forEach((project) => {
      projectsDone.push({
        project: projects[project],
      });
    });
  }

  const {
    body: {
      fullName,
      description,
      price,
      category,
      serviceOffered,
      profilePicture,
    },

    user: { _id: userId },
    params: { id: profileId },
  } = req;
  let profile = await Portfolio.findOne({
    _id: profileId,
    createdBy: userId,
  });

  if (!profile) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: `No talent with ID ${profileId} found`,
    });
  }

  if (fullName === '') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Name cannot be empty',
    });
  }
  if (description === '') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Description cannot be empty',
    });
  }

  if (price === '') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Price cannot be empty',
    });
  }
  if (category === '') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Category cannot be empty',
    });
  }
  if (serviceOffered === '') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'ServviceOffered cannot be empty',
    });
  }

  if (listOfSkills.length === 0) {
    listOfSkills = listOfSkills.concat(profile.listOfSkills);
  }
  if (projectsDone.length === 0) {
    projectsDone = projectsDone.concat(profile.projectsDone);
  }

  // listOfSkills = profile.listOfSkills.concat(listOfSkills)
  // projectsDone = profile.projectsDone.concat(projectsDone)
  // picturesOfWork = profile.picturesOfWork.concat(picturesOfWork)
  if (img) {
    image = img.secure_url;
  } else {
    image = req.body.profilePicture;
  }
  req.body = {
    fullName: req.body.fullName,
    profilePicture: image,
    description: req.body.description,
    listOfSkills,
    projectsDone,
    price: req.body.price,
    servicesOffered: req.body.serviceOffered,
    category: req.body.category,
    createdBy: req.user._id,
  };

  console.log(req.body);
  const updatedProfile = await Portfolio.findByIdAndUpdate(
    {
      _id: profileId,
      createdBy: userId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(updatedProfile);

  res.status(StatusCodes.OK).json({
    updatedProfile,
  });
};

//talent can delete their profile if thet want to

const deleteProfile = async (req, res) => {
  const {
    params: { id: profileId },
    user: { _id: userId },
  } = req;
  const profile = await Portfolio.findByIdAndRemove({
    _id: profileId,
    createdBy: userId,
  });
  if (!profile) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: `No talent with ID ${profileId} found`,
    });
  }

  res.status(StatusCodes.OK).json({
    message: 'Your profile has been successfully deleted.',
  });
};

// when employer clicks hire it navigates to different page by posting some response
const hireTalent = async (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'You can provide your information now',
  });
};

// Send mail to talent once employer hires
const handleHireTalent = async (req, res) => {
  const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '84bab139c6147d',
      pass: 'bff5ebe28877cd',
    },
  });
  console.log(req.body.talentId);
  try {
    const talent = await Portfolio.findById(req.body.talentId);

    console.log(talent);

    const mailOptions = {
      from: req.body.name + ' <' + req.user.email + '>',
      to: talent.email,
      subject: 'Hire Request',
      text: req.body.message,
      html: `Mobile Number: ${req.body.mobileNumber} <br/>
                    Address: ${req.body.address} <br/>
                    Hire Duration: ${req.body.hireDuration} <br/>
                    Message: ${req.body.message} <br/>`,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
    });

    res.status(200).json({
      message: 'Mail delieverd',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Cannot find the talent',
    });
  }
};

module.exports = {
  getAuthProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  hireTalent,
  handleHireTalent,
};
