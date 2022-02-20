const repos = require('../storage/repository')

let repository = new repos()

const product_list = (filter, sort, page, delegate) => {
    try {
        repository.product_list(filter, sort, page, (err, dres) => {

            if (delegate != null)
                delegate(err, dres)
        });
    } catch (ex) {
        delegate(ex);
    }
};

exports.product_list = product_list;
