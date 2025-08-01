import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	businessName: {
		type: String,
		required: true,
		unique: true,
	},
	businessNameForUrl: {
		type: String,
		required: true,
		unique: true,
	},
	role: { type: String, enum: ["admin", "user"], default: "user" },
	totalPatients: { type: Number, default: 0 },
	dailyPatients: { type: Number, default: 0 },
	canceledPatients: { type: Number, default: 0 },
	lastResetDate: { type: Date, default: Date.now },
	businessHours: {
		startHour: { type: Number, default: 9 }, // Default 9 AM IST
		startMinute: { type: Number, default: 0 }, // Default 0 minutes
		endHour: { type: Number, default: 17 }, // Default 5 PM IST
		endMinute: { type: Number, default: 0 }, // Default 0 minutes
		sundayOpen: { type: Boolean, default: false },
		saturdayOpen: { type: Boolean, default: false },
	},
});

UserSchema.methods.resetDailyCountIfNeeded = async function () {
	const today = new Date().setHours(0, 0, 0, 0); // Normalize today's date
	const lastReset = this.lastResetDate
		? new Date(this.lastResetDate).setHours(0, 0, 0, 0)
		: 0; // Handle cases where lastResetDate might be undefined

	if (!this.lastResetDate || today > lastReset) {
		this.dailyPatients = 0; // Reset the count
		this.lastResetDate = new Date(); // Update to the current date
		try {
			await this.save(); // Persist changes
		} catch (error) {
			console.error("Error resetting daily count:", error);
			throw new Error("Failed to reset daily count"); // Throw or handle appropriately
		}
	}
};

const User = mongoose.model("User", UserSchema);

export { User };
