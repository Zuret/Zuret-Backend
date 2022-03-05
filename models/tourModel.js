const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour must have a name"],
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, "Tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Tour must have a max group size"],
    },
    difficulty: {
      type: String,
      required: [true, "Tour must have a difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Tour must have a price"],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "Tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "Tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: {
      type: [Date],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// ====DOCUMENT MIDDLEWARE================================

//======runs before the document is saved to the database=======
// tourSchema.pre("save", function(next){
// this.duration = this.duration + 1
//   next();
// })

//======runs after the document has been saved to the database=======
// tourSchema.post("save", function(doc, next){
//   console.log("doc")
//   next();
// })

// ====QUERY MIDDLEWARE================================

//runs before the query has been executed==============
// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// ====AGGREGATION MIDDLEWARE================================

//runs before the aggregation has been executed==============
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
