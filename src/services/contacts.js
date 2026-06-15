import { ContactModel } from '../db/models/Contact.js';

export const getContactById = (id, userId) => ContactModel.findOne({ _id: id, userId });
export const createContact = (data) => ContactModel.create(data);
export const updateContact = (id, userId, data) => ContactModel.findOneAndUpdate({ _id: id, userId }, data, { new: true });
export const deleteContact = (id, userId) => ContactModel.findOneAndDelete({ _id: id, userId });

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, type, isFavourite, userId }) => {
  const filter = { userId };
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
