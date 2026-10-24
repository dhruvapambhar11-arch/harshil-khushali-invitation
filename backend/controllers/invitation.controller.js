const Invitation = require("../models/Invitation");

// GET by subdomain
exports.getBySubdomain = async (req, res) => {
  const invite = await Invitation.findOne({
    subdomain: req.params.subdomain,
  });

  if (!invite) return res.status(404).json({ message: "Not found" });

  res.json(invite);
};

// CREATE invitation
exports.createInvitation = async (req, res) => {
  const newInvite = await Invitation.create(req.body);
  res.json(newInvite);
};

// GET all (admin)
exports.getAll = async (req, res) => {
  const data = await Invitation.find();
  res.json(data);
};

// UPDATE status
exports.updateInvitation = async (req, res) => {
  const updated = await Invitation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};
