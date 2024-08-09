import mongoose from "mongoose";

const churchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  churchEmail: {
    type: String,
  },
  churchTel: {
    type: String,
  },
  churchLocation: {
    type: String,
  },
  churchLocation: {
    type: String,
  },
  churchAbout: {
    type: String
  },
  iban: {
    type: String,
    required: true,
  },
  sloganMessage: {
    type: String,
  },
  charityActions: {
    type: [String],
  },
  logo: {
    type: String,
  },
  churchWebsiteLink: {
    type: String,
  },
  qrCodeData: {
    type: String,
  },
  stripeAccountId: {
    type: String
  }
});

const Church = mongoose.model("Church", churchSchema);

export default Church;
