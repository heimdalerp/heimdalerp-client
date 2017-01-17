import {
  ADD_CONTACT,
  EDIT_CONTACT,
  WIPE_CONTACTS
} from '../mutation_types'

// initial state
const state = {
  all: []
}

const mutations = {
  [ADD_CONTACT] (state, contact) {
    const newContact = contact

    state.all.push(newContact)
  },
  [EDIT_CONTACT] (state, contact) {
    var found = state.all.find(c => c.id === contact.id)
    if (found === undefined) {
      state.all.push(contact)
    } else {
      Object.assign(found, contact)
    }
  },
  [WIPE_CONTACTS] (state) {
    const contacts = []
    state.all = contacts
  }
}

export default {
  state,
  mutations
}
