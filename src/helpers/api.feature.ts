export class APIFeatures {
   public query;
   public queryString;

   constructor(query: any, queryString: any) {
      this.query = query;
      this.queryString = queryString;
   }

   filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(el => delete queryObj[el]);

      // Advanced filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

      this.query = this.query.find(JSON.parse(queryStr));

      return this;
   }

   sort() {
      if (this.queryString.sort) {
         const sortBy = this.queryString.sort.split(',').join(' ');
         this.query = this.query.sort(sortBy);
      }else {
         this.query = this.query.sort('-createdAt');
      }

      return this;
   }

   limitFields() {
      if (this.queryString.fields) {
         const fields = this.queryString.fields.split(',').join(' ');
         this.query = this.query.select(fields);
      }

      return this;
   }

   paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 20;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);

      return this;
   }

   search() {
      if (this.queryString.search) {
         const searchQuery = this.queryString.search.toLowerCase().trim();
         const searchFields = ['author', 'title', 'tags'];
         // Add more fields as needed
         const searchPatterns = searchFields.map((field) => ({
            [field]: { $regex: new RegExp(searchQuery, 'i') }
         }));

         this.query = this.query.or(searchPatterns);
      }
      return this;
   }

}