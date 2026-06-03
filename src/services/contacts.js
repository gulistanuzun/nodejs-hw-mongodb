import { ContactModel } from '../db/models/Contact.js';

export const getAllContacts = () => ContactModel.find();

export const getContactById = (id) => ContactModel.findById(id);
