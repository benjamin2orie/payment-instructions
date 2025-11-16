
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true },
}, { timestamps: true });


const Account = mongoose.model('Account', accountSchema);
export default Account;