const mongoose = require("mongoose");
const slugify = require("slugify");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      minLength: [10, "Tour name must have greater than or equal to 10 chars"],
      maxLength: [50, "Tour name must have less than or equal to 50 chars"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have group size"],
    },
    difficulty: {
      type: String,
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy,medium or difficult",
      },
      required: [true, "A tour must have difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 1,
      min: 1.0,
      max: 5.0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (discount) {
          return discount < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have cover image"],
    },
    images: [String],
    slug: String,
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number], //longitude first.
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number], //longitude first.
        address: String,
        description: String,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // when data gets saved
    toObject: { virtuals: true }, // when data gets outputed
  },
);

// Virtual properties: cannot be used in queries
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Virtually populationg reviews for each tour : only on fetching single tour
tourSchema.virtual(
  "reviews",
  {
    ref: "Review",
    foreignField: "tour", // review model has tour field which stores tourid
    localField: "_id",
  },
  function () {},
);

// Document middleware : creating slug before saving to DB
tourSchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});

//Query middleware to populate guide fields on all find methods
tourSchema.pre(/^find/, function () {
  this.populate({
    path: "guides",
    select: "_id name email photo", // selecting ony these fields from user.
  });
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
