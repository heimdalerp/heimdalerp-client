// ACCOUNTING MODULE
export const getFiscalPositions = function ({ _vm, dispatch }) {
  var p = _vm.$http.get('invoice/fiscalpositions/')

  var p3 = p.then((promises) => {
    dispatch('ACCOUNTING_FISCALPOSITION_WIPE')
    for (let fiscalposition of promises.data.results) {
      dispatch('ACCOUNTING_FISCALPOSITION_ADD', fiscalposition)
    }
  })

  return p3
}

export const addInvoice = function ({ _vm, dispatch }, invoice) {
  var p = this.$http.post('invoice_ar/invoices/', invoice)

  var p2 = p.then(function (response) {
    dispatch('ACCOUNTING_INVOICE_ADD', invoice)
  })

  return p2
}

export const getInvoices = function ({ _vm, dispatch, state }) {
  var p = _vm.$http.get('invoice_ar/invoices/')
  p.then(function (response) {
    dispatch('ACCOUNTING_INVOICE_WIPE')
  })

  p.then(function (response) {
    var promises = []
    for (let invoice of response.data.results) {
      // Fetch the contact name
      var p2 = getContact({ _vm, dispatch }, invoice.invoicear_contact)

      p2.then(function (response) {
        invoice.invoicear_contact = state.contacts.all
          .find(c => c.url === invoice.invoicear_contact)
          .invoice_contact.legal_name
      })

      // Fetch the invoice type
      if (invoice.invoice_type !== null) {
        // var p3 = this.$http.get(invoice.invoice_type)
        var p3 = getInvoiceType({ _vm, dispatch }, invoice.invoice_type)

        p3.then(function (response) {
          invoice.invoice_type = state.accounting.invoiceTypes.all
            .find(t => t.url === invoice.invoice_type)
            .name.split(' ').reverse()[0]
      //         invoice.invoice_type = response.data.name.split(' ').reverse()[0]
        })
      }

      // Fetch the point of sale number
      var p4 = getPOS({ _vm, dispatch }, invoice.point_of_sale_ar)

      p4.then(function (response) {
        invoice.point_of_sale_ar = ('000' + response.data.afip_id).slice(-4)
      })

      promises.push(Promise.all([p2, p3, p4]).then(function (values) {
        dispatch('ACCOUNTING_INVOICE_ADD', invoice)
      }))
    }
  })

  return p
}

export const getInvoicesByContact = function ({ _vm, dispatch, state }, contact) {
  var p = this.$http.get(`invoice_ar/contacts/${contact.id}/invoices/`)
  p.then(function (response) {
    dispatch('ACCOUNTING_INVOICE_WIPE')
  })

  p.then(function (response) {
    var promises = []
    for (let invoice of response.data.results) {
      // Fetch the contact name
      var p2 = getContact({ _vm, dispatch }, invoice.invoicear_contact)

      p2.then(function (response) {
        invoice.invoicear_contact = state.contacts.all
          .find(c => c.url === invoice.invoicear_contact)
          .invoice_contact.legal_name
      })

      // Fetch the invoice type
      if (invoice.invoice_type !== null) {
        // var p3 = this.$http.get(invoice.invoice_type)
        var p3 = getInvoiceType({ _vm, dispatch }, invoice.invoice_type)

        p3.then(function (response) {
          invoice.invoice_type = state.accounting.invoiceTypes.all
            .find(t => t.url === invoice.invoice_type)
            .name.split(' ').reverse()[0]
      //         invoice.invoice_type = response.data.name.split(' ').reverse()[0]
        })
      }

      // Fetch the point of sale number
      var p4 = getPOS({ _vm, dispatch }, invoice.point_of_sale_ar)

      p4.then(function (response) {
        invoice.point_of_sale_ar = ('000' + response.data.afip_id).slice(-4)
      })

      promises.push(Promise.all([p2, p3, p4]).then(function (values) {
        dispatch('ACCOUNTING_INVOICE_ADD', invoice)
      }))
    }

    return promises
  })

  return p
}

export const getInvoiceType = function ({ _vm, dispatch }, invoiceType) {
  var p = _vm.$http.get(invoiceType)

  p.then(function (response) {
    dispatch('ACCOUNTING_INVOICETYPE_ADD', response.data)
  })

  return p
}

export const getInvoiceTypes = function ({ _vm, dispatch }) {
  var p = _vm.$http.get('invoice/invoicetypes/')
  var p2 = _vm.$http.get('invoice/fiscalpositionshaveinvoicetypesallowed/')

  var p3 = Promise.all([p, p2]).then(function (promises) {
    dispatch('ACCOUNTING_INVOICETYPE_WIPE')
    for (let invoiceType of promises[0].data.results) {
      invoiceType.restrictions = promises[1].body.results.filter(restriction => {
        return restriction.invoice_type === invoiceType.url
      })
      dispatch('ACCOUNTING_INVOICETYPE_ADD', invoiceType)
    }
  })

  return p3
}

export const addPayment = function ({ dispatch }, payment) {
  var p = this.$http.post('accounting/payments/', payment).then(response => {
    dispatch('ACCOUNTING_PAYMENT_ADD', payment)
  })
  return p
}

export const getPayments = function ({ dispatch }) {
  var p = this.$http.get('accounting/payments/')

  p.then(function (response) {
    dispatch('ACCOUNTING_PAYMENT_WIPE')
  })

  // Populate their contact names
  p.then(function (response) {
    for (let payment of response.data.results) {
      var p2 = this.$http.get(payment.contact_contact)
      p2.then(function (response) {
        payment.contact_contact = response.data.name
        dispatch('ACCOUNTING_PAYMENT_ADD', payment)
      })
    }
  })
}

export const getPaymentsByContact = function ({ _vm, dispatch }, contact) {
  var p = _vm.$http.get(`accounting/contacts/${contact.invoice_contact.id}/payments/`)

  var p2 = p.then(function (response) {
    dispatch('ACCOUNTING_PAYMENT_WIPE')
    var promises = []
    for (let payment of response.data.results) {
      var p2 = p.then(function (response) {
        payment.contact_contact = contact.invoice_contact.contact_contact.name
        dispatch('ACCOUNTING_PAYMENT_ADD', payment)
      })
      promises.push(p2)
    }

    return promises
  })

  return p2
}

export const addPOS = function ({ dispatch }, pos) {
  var p = this.$http.post('invoice_ar/pointsofsalear/', pos)

  p.then(response => {
    dispatch('ACCOUNTING_POS_ADD', pos)
  })

  return p
}

export const getPOSs = function ({ dispatch }) {
  var p = this.$http.get('invoice_ar/pointsofsalear/')

  // Fetch the points of sale
  p.then(response => {
    dispatch('ACCOUNTING_POS_WIPE')
  })

  var p2 = p.then(function (response) {
    for (let pos of response.body.results) {
      dispatch('ACCOUNTING_POS_ADD', pos)
    }
  })

  return p2
}

export const getPOS = function ({ _vm, dispatch }, pointOfSale) {
  var p = _vm.$http.get(pointOfSale)

  // Populate its addresses
  p.then(function (response) {
    pointOfSale = response.data
    var p2 = _vm.$http.get(pointOfSale.fiscal_address.url)

    p2.then(function (response) {
      pointOfSale.fiscal_address = response.data.street_address + ' P' +
      response.data.floor_number + ' D' + response.data.apartment_number
      dispatch('ACCOUNTING_POS_EDIT', pointOfSale)
    })
  })

  return p
}

export const addProduct = function ({ _vm, dispatch }, product) {
  var p = _vm.$http.post('invoice/products/', product)

  var p2 = p.then(response => {
    dispatch('ACCOUNTING_PRODUCTS_ADD', product)
  })

  return p2
}

export const getProducts = function ({ _vm, dispatch }) {
  var p = _vm.$http.get('invoice/products/')

  // Fetch the points of sale
  p.then(response => {
    dispatch('ACCOUNTING_PRODUCTS_WIPE')
  })

  var p2 = p.then(function (response) {
    let promises = []
    let p3
    for (let product of response.body.results) {
      p3 = _vm.$http.get(product.vat)
      p3.then(function (response) {
        product.vat = response.body
        dispatch('ACCOUNTING_PRODUCTS_ADD', product)
      })
      promises.push(p3)
    }

    return Promise.all(promises)
  })

  return p2
}

// CONTACTS MODULE

export const getContacts = function ({ _vm, dispatch }) {
  var p = _vm.$http.get('invoice_ar/contacts/')

  var p2 = p.then(response => {
    dispatch('WIPE_CONTACTS')
    for (let contact of response.data.results) {
      dispatch('ADD_CONTACT', contact)
    }
  })

  return p2
}

export const getContact = function ({ _vm, dispatch }, url) {
  var p = _vm.$http.get(url)

  p.then(response => {
    dispatch('EDIT_CONTACT', response.data)
  })

  return p
}

export const addContact = function ({ _vm, dispatch }, context, contact) {
  var p = context.$http.post('invoice_ar/contacts/', contact)
  p.then(response => {
    dispatch('ADD_CONTACT', contact)
  })
  return p
}

export const editContact = function ({ _vm, dispatch }, contact) {
  var p = _vm.$http.put(`invoice_ar/contacts/${contact.id}/`, contact)
  p.then(response => {
    dispatch('EDIT_CONTACT', contact)
  })
  return p
}

export const deleteContact = ({ dispatch }) => {
  dispatch('DELETE_CONTACT')
}
