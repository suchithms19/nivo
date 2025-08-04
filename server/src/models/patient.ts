import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	name: { type: String, required: true },
	date: { type: Date, required: true, default: Date.now },
	phoneNumber: { type: Number, required: true },
	age: { type: Number },
	entryTime: { type: Date, required: true },
	postConsultation: { type: Date },
	completionTime: { type: Date },
	selfRegistered: {
		type: Boolean,
		default: false,
	},
	selfCanceled: {
		type: Boolean,
		default: false,
	},
	canceled: { type: Boolean, default: false },
});

const Patient = mongoose.model("Patient", PatientSchema);

export { Patient };
