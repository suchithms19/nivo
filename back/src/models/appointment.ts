import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: true },
	status: {
		type: String,
		enum: ["scheduled", "completed", "cancelled"],
		default: "scheduled",
	},
	createdAt: { type: Date, default: Date.now },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

export { Appointment };
