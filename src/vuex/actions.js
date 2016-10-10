// ACCOUNTING MODULE
export const getFiscalPositions = function ({ _vm, dispatch }) {
  var p = _vm.$http.get('invoice/fiscalpositions/')
  p.then((response) => {
    dispatch('ACCOUNTING_FISCALPOSITION_WIPE')
    for (let fiscalposition of response.body.results) {
      dispatch('ACCOUNTING_FISCALPOSITION_ADD', fiscalposition)
    }
  })

  return p
}

export const getInvoices = function ({ _vm, dispatch, state }) {
  var p = this.$http.get('invoice_ar/invoices/')
  p.then(function (response) {
    dispatch('ACCOUNTING_INVOICE_WIPE')
  })

  p.then(function (response) {
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
          invoice.invoice_type = state.accounting.invoice_types.all
            .find(t => t.url === invoice.invoice_type)
            .name.split(' ').reverse()[0]
      //         invoice.invoice_type = response.data.name.split(' ').reverse()[0]
        })
      }

      // Fetch the point of sale number
      var p4 = getPOS({ _vm, dispatch }, invoice.point_of_sale)

      p4.then(function (response) {
        invoice.point_of_sale = ('000' + response.data.afip_id).slice(-4)
      })

      Promise.all([p2, p3, p4]).then(function (values) {
        dispatch('ACCOUNTING_INVOICE_ADD', invoice)
      })
    }
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

  var p2 = p.then(function (response) {
    dispatch('ACCOUNTING_INVOICETYPE_WIPE')
    for (let invoiceType of response.data.results) {
      dispatch('ACCOUNTING_INVOICETYPE_ADD', invoiceType)
    }
  })

  return p2
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

export const getPaymentsByContact = function ({ dispatch }, contact) {
  var p = this.$http.get(`accounting/contacts/${contact.id}/payments/`)

  p.then(function (response) {
    dispatch('ACCOUNTING_PAYMENT_WIPE')

    for (let payment of response.data.results) {
      p.then(function (response) {
        payment.contact_contact = contact.invoice_contact.contact_contact.name
        dispatch('ACCOUNTING_PAYMENT_ADD', payment)
      })
    }
  })
  return p
}

export const addPOS = function ({ dispatch }, pos) {
  var p = this.$http.post('invoice_ar/pointsofsale/', pos)

  p.then(response => {
    dispatch('ACCOUNTING_POS_ADD', pos)
  })

  return p
}

export const getPOSs = function ({ dispatch }) {
  var p = this.$http.get('invoice_ar/pointsofsale/')

  // Fetch the points of sale
  p.then(response => {
    dispatch('ACCOUNTING_POS_WIPE')
  })

  // Populate their addresses
  var p2 = p.then(function (response) {
    var promises = []
    for (let pos of response.data.results) {
      let p3 = this.$http.get(pos.fiscal_address)
      p3.then(function (response) {
        pos.fiscal_address = response.data.street_address + ' P' +
        response.data.floor_number + ' D' + response.data.apartment_number
        dispatch('ACCOUNTING_POS_ADD', pos)
      })
      promises.push(p3)
    }
    return Promise.all(promises)
  })

  return p2
}

export const getPOS = function ({ _vm, dispatch }, pointOfSale) {
  var p = _vm.$http.get(pointOfSale)

  // Populate its addresses
  p.then(function (response) {
    pointOfSale = response.data
    var p2 = _vm.$http.get(pointOfSale.fiscal_address)

    p2.then(function (response) {
      pointOfSale.fiscal_address = response.data.street_address + ' P' +
      response.data.floor_number + ' D' + response.data.apartment_number
      dispatch('ACCOUNTING_POS_EDIT', pointOfSale)
    })
  })

  return p
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

export const addContact = function ({ dispatch }, contact) {
  var p = this.$http.post('invoice_ar/contacts/', contact)
  p.then(response => {
    dispatch('ADD_CONTACT', contact)
  })
  return p
}

export const editContact = function ({ dispatch }, contact) {
  var p = this.$http.put(`invoice_ar/contacts/${contact.id}/`, contact)
  p.then(response => {
    dispatch('EDIT_CONTACT', contact)
  })
  return p
}

export const deleteContact = ({ dispatch }) => {
  dispatch('DELETE_CONTACT')
}
