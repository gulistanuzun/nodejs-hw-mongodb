import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const getContactsController = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortBy = req.query.sortBy || '_id';
  const sortOrder = req.query.sortOrder || 'asc';
  const type = req.query.type;
  const isFavourite = req.query.isFavourite === 'true' ? true : req.query.isFavourite === 'false' ? false : undefined;

  const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, type, isFavourite, userId: req.user._id });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  let photoUrl;
  if (req.file) {
    photoUrl = await saveFileToCloudinary(req.file);
  }

  const contact = await updateContact(contactId, req.user._id, {
    ...req.body,
    ...(photoUrl && { photo: photoUrl }),
  });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};


export const createContactController = async (req, res) => {
  let photoUrl;
  if (req.file) {
    photoUrl = await saveFileToCloudinary(req.file);
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};



export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
