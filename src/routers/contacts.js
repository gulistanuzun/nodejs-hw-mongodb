import { Router } from 'express';
import { getContactsController, getContactByIdController, updateContactController, deleteContactController, createContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';

const router = Router();
router.post("/", validateBody(createContactSchema), ctrlWrapper(createContactController));
router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId',isValidId, ctrlWrapper(getContactByIdController));
router.patch('/:contactId',isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;


