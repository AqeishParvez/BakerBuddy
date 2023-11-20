import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Manager', 'Baker'], required: true },
    email: { type: String, required: true, unique: true, lowercase: true},
    username: { type: String, unique: true },
    registrationCode: { type: String, unique: true},
    registered: { type: Boolean, default: false }, // Added field
    // Other employee-related fields to be added later
}, {
    timestamps: true,
    collection: 'employees',
});

export default mongoose.model('Employees', EmployeeSchema);
