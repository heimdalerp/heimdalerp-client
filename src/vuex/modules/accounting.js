import {
  ACCOUNTING_FISCALPOSITION_ADD,
  ACCOUNTING_FISCALPOSITION_WIPE,
  ACCOUNTING_INVOICE_ADD,
  ACCOUNTING_INVOICE_EDIT,
  ACCOUNTING_INVOICE_WIPE,
  ACCOUNTING_INVOICETYPE_ADD,
  ACCOUNTING_INVOICETYPE_WIPE,
  ACCOUNTING_PAYMENT_ADD,
  ACCOUNTING_PAYMENT_WIPE,
  ACCOUNTING_POS_ADD,
  ACCOUNTING_POS_EDIT,
  ACCOUNTING_POS_WIPE,
  ACCOUNTING_PRODUCTS_ADD,
  ACCOUNTING_PRODUCTS_EDIT,
  ACCOUNTING_PRODUCTS_WIPE,
  ACCOUNTING_VATS_ADD,
  ACCOUNTING_VATS_EDIT,
  ACCOUNTING_VATS_WIPE
} from '../mutation_types'

// initial state
const state = {
  fiscalPositions: {
    all: []
  },
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
  },
  products: {
    all: []
  },
  vats: {
    all: []
  }
}

const mutations = {
  [ACCOUNTING_FISCALPOSITION_ADD] (state, fiscalposition) {
    const newFiscalPosition = fiscalposition

    state.fiscalPositions.all.push(newFiscalPosition)
  },
  [ACCOUNTING_FISCALPOSITION_WIPE] (state, fiscalposition) {
    const fiscalPositions = []

    state.fiscalPositions.all = fiscalPositions
  },
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
  },
  [ACCOUNTING_PRODUCTS_ADD] (state, product) {
    const newProduct = product

    state.products.all.push(newProduct)
  },
  [ACCOUNTING_PRODUCTS_EDIT] (state, product) {
    var found = state.products.all.find(p => p.id === product.id)
    if (found === undefined) {
      state.products.all.push(product)
    } else {
      Object.assign(found, product)
    }
  },
  [ACCOUNTING_PRODUCTS_WIPE] (state) {
    const products = []
    state.products.all = products
  },
  [ACCOUNTING_VATS_ADD] (state, vat) {
    const newVat = vat

    state.vats.all.push(newVat)
  },
  [ACCOUNTING_VATS_EDIT] (state, vat) {
    var found = state.vats.all.find(v => v.id === vat.id)
    if (found === undefined) {
      state.vats.all.push(vat)
    } else {
      Object.assign(found, vat)
    }
  },
  [ACCOUNTING_VATS_WIPE] (state) {
    const vats = []
    state.vats.all = vats
  }
}

export default {
  state,
  mutations
}
