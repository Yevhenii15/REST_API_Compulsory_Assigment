import Joi, { ValidationResult } from "joi";
import { Owner } from "../../interfaces/owner";

/**
 * Validate owner registration info (name, email, password)
 * @param data
 */
export function validateOwnerRegistrationData(data: Owner): ValidationResult {
  const schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(20).required(),
    phoneNumber: Joi.string().min(6).max(20).required(),
    address: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
}

/**
 * Validate owner login info (email, password)
 * @param data
 */
export function validateOwnerLoginData(data: Owner): ValidationResult {
  const schema = Joi.object({
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(20).required(),
  });

  return schema.validate(data);
}
