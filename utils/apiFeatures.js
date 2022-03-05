class APIFeature {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      //filtering------------------------------------------------
      const queryObj = { ...this.queryString };
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach((field) => delete queryObj[field]);
  
      //advanced filtering------------------------------------------------
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|lte|gt|lt)\b/g,
        (matches) => `$${matches}`
      );
      queryStr = JSON.parse(queryStr);
  
      //-----------------------------------------------------------------
      this.query = this.query.find(queryStr);
  
      return this;
    }
  
    sort() {
      //sorting------------------------------------------------
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("-createdAt");
      }
  
      return this;
    }
  
    limitFields() {
      //limiting fields------------------------------------------------
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v");
      }
  
      return this;
    }
  
    paginate() {
      //pagination------------------------------------------------
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }

  module.exports = APIFeature;