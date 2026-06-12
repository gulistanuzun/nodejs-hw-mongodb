import { ContactModel } from '../db/models/Contact.js';

export const getContactById = (id) => ContactModel.findById(id);
export const createContact = (data) => ContactModel.create(data);
export const updateContact = (id, data) => ContactModel.findByIdAndUpdate(id, data, { new: true });
export const deleteContact = (id) => ContactModel.findByIdAndDelete(id);

export const getAllContacts = async ({ page, perPage,  sortBy, sortOrder, type, isFavourite }) => {
  const filter = {};
if (type) filter.contactType = type;
if (isFavourite !== undefined) filter.isFavourite = isFavourite;

  const skip = (page - 1) * perPage;
  const totalItems = await ContactModel.countDocuments(filter);
  const data = await ContactModel.find(filter).skip(skip).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).limit(perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    hasPreviousPage: page > 1,
    hasNextPage: page < Math.ceil(totalItems / perPage),
  };
};
