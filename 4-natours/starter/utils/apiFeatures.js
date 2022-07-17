class APIFeature {
    constructor(query, queryString) {
        //query will contain the query object ,,,to make query to the DB
        //queryString will contain the query subbmited by the client in string

        this.query = query;
        this.queryString = queryString;
    }

    filter() {

        const queryObj = { ...this.queryString };

        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(ele => delete queryObj[ele]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));

        return this; //for the futher chaining of the methods
        //this will return the entire object 
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
        } else { // default sort
            this.query = this.query.sort('-createdAt'); // `-` for decreasing order
        }
        return this; //for the futher chaining of the methods
    }

    limit() {
        if (this.queryString.fields) {
            const fieldBy = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fieldBy);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

}

module.exports = APIFeature;