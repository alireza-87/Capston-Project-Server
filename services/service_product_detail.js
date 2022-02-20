
const repos = require('../storage/repository')
let repository=new repos()

const product_detail = (p_id,delegate) =>{
    repository.get_product(p_id,(err,data)=>{
        delegate(err,data)
    })
}

exports.product_detail=product_detail