import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default:0
  },
  description: {
    type: String
  },
  category: { 
    type: String,
    required: true
 },
 image: { 
    type: String
 },
 sold: {
     type: Boolean,
     default: false
 },
 dateOfSale: {
   type:Date
}

});

export const Transaction = mongoose.model('Transaction', TransactionSchema);
