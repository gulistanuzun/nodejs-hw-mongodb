import { ContactModel } from '../db/models/Contact.js';
export const getAllContacts = () => ContactModel.find();
export const getContactById = (id) => ContactModel.findById(id);
export const createContact = (data) => ContactModel.create(data);

export const updateContact = (id, data) => ContactModel.findByIdAndUpdate(id, data, { new: true });

router.patch('/:contactId', ctrlWrapper(updateContactController));

export const deleteContact = (id) => ContactModel.findByIdAndDelete(id);
