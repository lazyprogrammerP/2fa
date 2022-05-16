const { Schema, model } = require("mongoose");

const CodeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    code: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now, expires: 14400 },
  },
  { timestamps: true }
);

// CodeSchema.index(
//   { createdAt: 1 },
//   {
//     expireAfterSeconds: 60,
//   }
// );

const CodeModel = model("CodeModel", CodeSchema);

module.exports = CodeModel;
