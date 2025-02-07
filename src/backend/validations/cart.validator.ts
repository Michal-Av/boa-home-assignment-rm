import Joi from "joi";


export const validateSaveCart = Joi.object({
  shop: Joi.string().required(),
  customerId: Joi.string().required(),
  cartItems: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        price: Joi.number().required(),
      })
    )
    .required(),
});


export const validateGetCart = Joi.object({
  shop: Joi.string().required(),
  customerId: Joi.string().required(),
});
