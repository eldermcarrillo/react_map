import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE, ADD_FLASH_MESSAGE_MODAL, DELETE_FLASH_MESSAGE_MODAL } from './types';

export function addFlashMessage(message) {
  return {
    type: ADD_FLASH_MESSAGE,
    message
  }
}

export function deleteFlashMessage(id) {
  return {
    type: DELETE_FLASH_MESSAGE,
    id
  }
}

export function addFlashMessageModal(message) {
  return {
    type: ADD_FLASH_MESSAGE_MODAL,
    message
  }
}

export function deleteFlashMessageModal(id) {
  return {
    type: DELETE_FLASH_MESSAGE_MODAL,
    id
  }
}