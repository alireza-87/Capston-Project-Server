const product_schema = require('../models/model_product')
const repos = require('../storage/repository')


let repository=new repos()

const product_add = (data,seller_username,delegate) =>{
    let db_data = new product_schema({
        name:data.name,
        description:data.description,
        price:data.price,
        category:data.category,
        delivery_time: data.delivery_time,
        is_service:data.is_service,
        quantity:data.quantity,
        image:data.image,
        country:data.country,
        city:data.city,
        street:data.street,
        number:data.number,
        zip:data.zip,
        showContactInfo:data.showContactInfo

    })

    const error = db_data.validateSync();
    if(error){
        const [key, value]  = Object.entries(error.errors)[0]
        delegate((`${key}`))
    }else{
        repository.insert_product(db_data,seller_username,(err,dres)=>{

            if(delegate!=null)
                delegate(err,dres)
        })
    }
}

exports.product_add = product_add;