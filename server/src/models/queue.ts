import mongoose from "mongoose";

const QueueSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	patient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Patient",
		required: true,
	},
	status: {
		type: String,
		enum: ["waiting", "serving", "completed", "cancelled"],
		required: true,
	},
	timeWaited: { type: Number, default: 0 },
	timeServed: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

const Queue = mongoose.model("Queue", QueueSchema);

export { Queue };
