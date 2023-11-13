import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['Admin', 'Manager','Baker'], required: true},
    //Other employee-related fields to be added later
}, {
    timestamps: true,
    collection: 'employees'
});

export default mongoose.model('Employees', EmployeeSchema);