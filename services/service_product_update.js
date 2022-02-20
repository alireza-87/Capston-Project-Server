const repos = require('../storage/repository')


let repository=new repos()

const product_update = (product_id,data,delegate) =>{
    const filter = { _id: product_id }
    repository.get_product(product_id,(err,u_doc)=>{
        if (!err && u_doc){
            u_doc.name = data.name ? data.name : u_doc.name
            u_doc.description = data.description ? data.description : u_doc.description
            u_doc.price = data.price ? data.price : u_doc.name
            u_doc.category = data.category ? data.category :  u_doc.category
            u_doc.delivery_time = data.delivery_time ? data.delivery_time : u_doc.delivery_time
            u_doc.is_service = data.is_service !== undefined ? data.is_service : u_doc.is_service
            u_doc.quantity = data.quantity !== undefined ? data.quantity : u_doc.quantity
            u_doc.image = data.image ? data.image : u_doc.image
            u_doc.publication_date = data.publication_date ? data.publication_date : u_doc.publication_date
            u_doc.city = data.city ? data.city : u_doc.city
            u_doc.street = data.street ? data.street : u_doc.street
            u_doc.number = data.number ? data.number : u_doc.number
            u_doc.zip = data.zip ? data.zip : u_doc.zip
            u_doc.showContactInfo = data.showContactInfo ? data.showContactInfo : u_doc.showContactInfo
            const error = u_doc.validateSync();
            if(error){
                const [key, value]  = Object.entries(error.errors)[0]
                delegate((`${key}`))
            }else{
                repository.update_product(filter,u_doc,(err,res)=>{
                    if (delegate!=null)
                        delegate(err,res)
                })
            }
        }else{
            delegate(err)
        }
    })
}

exports.product_update = product_update;