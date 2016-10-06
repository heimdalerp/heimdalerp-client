import {
  ACCOUNTING_INVOICE_ADD,
  ACCOUNTING_INVOICE_EDIT,
  ACCOUNTING_INVOICE_WIPE,
  ACCOUNTING_INVOICETYPE_ADD,
  ACCOUNTING_INVOICETYPE_WIPE,
  ACCOUNTING_PAYMENT_ADD,
  ACCOUNTING_PAYMENT_WIPE,
  ACCOUNTING_POS_ADD,
  ACCOUNTING_POS_EDIT,
  ACCOUNTING_POS_WIPE
} from '../mutation_types'

// initial state
const state = {
  invoices: {
    all: []
  },
  invoiceTypes: {
    all: []
  },
  payments: {
    all: []
  },
  pos: {
    all: []
  }
}

const mutations = {
  [ACCOUNTING_INVOICE_ADD] (state, invoice) {
    const newInvoice = invoice

    state.invoices.all.push(newInvoice)
  },
  [ACCOUNTING_INVOICE_EDIT] (state, invoice) {
    Object.extend(state.invoices.all.find(i => i.id === invoice.id), invoice)
  },
  [ACCOUNTING_INVOICE_WIPE] (state) {
    const invoices = []
    state.invoices.all = invoices
  },
  [ACCOUNTING_INVOICETYPE_ADD] (state, invoiceType) {
    const newInvoiceType = invoiceType
    state.invoiceTypes.all.push(newInvoiceType)
  },
  [ACCOUNTING_INVOICETYPE_WIPE] (state) {
    const invoiceTypes = []
    state.invoiceTypes.all = invoiceTypes
  },
  [ACCOUNTING_PAYMENT_ADD] (state, payment) {
    const newPayment = payment

    state.payments.all.push(newPayment)
  },
  [ACCOUNTING_PAYMENT_WIPE] (state) {
    const pos = []
    state.payments.all = pos
  },
  [ACCOUNTING_POS_ADD] (state, pos) {
    const newPos = pos

    state.pos.all.push(newPos)
  },
  [ACCOUNTING_POS_EDIT] (state, pos) {
    var found = state.pos.all.find(p => p.id === pos.id)
    if (found === undefined) {
      state.pos.all.push(pos)
    } else {
      Object.assign(found, pos)
    }
  },
  [ACCOUNTING_POS_WIPE] (state) {
    const pos = []
    state.pos.all = pos
  }
}

export default {
  state,
  mutations
}
