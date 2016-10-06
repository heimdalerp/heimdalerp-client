<template>
  <div class='jumbotron'>
    <p v-if='wizard_fiscalpositions'><span class='glyphicon glyphicon-pencil'></span>Cargar posiciones fiscales: <button @click='fiscalpositions_ar'>Argentina</button></p>
    <p v-else><span class='glyphicon glyphicon-ok'></span> Posiciones fiscales cargadas.</p>
    <p><span class='glyphicon glyphicon-pencil'></span>Cargar clientes: <button @click='doit_phaggot'>Enviar</button></p>

    <form id='bootstrapTagsInputForm' method='post' class='form-horizontal'>
        <div class='form-group'>
            <label class='col-xs-3 control-label'>Cliente</label>
            <div class='col-xs-8'>
                <input type='text' class='form-control' />
            </div>
        </div>
    </form>
    watup dogwg
    <one-to-many name="watup"></one-to-many>
  </div>
</template>

<script>
import OneToOne from '../utils/components/OneToOne.vue'
import OneToMany from '../utils/components/OneToMany.vue'

export default {
  components: {
    OneToOne,
    OneToMany
  },
  data () {
    return {
      wizard_fiscalpositions: true,
      invoice_ar_contact: {
        id: null,
        invoice_contact: {
          contact_contact: {
            persons_company: 'http://localhost:8000/api/persons/companies/1/',
            name: '',
            birth_date: null,
            born_in: null,
            phone_numbers: '',
            extra_emails: '',
            contact_type: 'C',
            home_address: {
              street_address: '',
              floor_number: '',
              apartment_number: '',
              city: null,
              postal_code: ''
            }
          },
          fiscal_address: {
            street_address: '',
            floor_number: '',
            apartment_number: '',
            city: null,
            postal_code: ''
          },
          legal_name: '',
          fiscal_position: null
        },
        id_type: null,
        id_number: 0
      },
      contacts: [
        {name: 'Capitel S.A.', street_address: 'San Martin 1945', city: '3836277', postal_code: '3000', id_number: '30627871348', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Bureau Veritas Argentina S.A.', street_address: 'Leandro N. Alem 1134 Piso 9', city: '3435910', postal_code: '1001', id_number: '33658043779', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'COAC', street_address: 'Junin 2654', city: '3836277', postal_code: '3000', id_number: '30654905122', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Arcor SAIC', street_address: 'Av. Freyre 2355', city: '3836277', postal_code: '3000', id_number: '30502793175', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Funes Fernando Daniel', street_address: 'Bouvier 2193', city: null, postal_code: '2200', id_number: '20269767937', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'TECSA S.A.', street_address: 'Primera Junta 2507', city: '3836277', postal_code: '3000', id_number: '30505552918', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Caballi S.A. - PECAM S.A. - Nestor I. Szczech - UTE', street_address: 'Balcarce 1021', city: '3838583', postal_code: '2000', id_number: '30714544086', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Fleming y Martolio', street_address: 'San Jeronimo 2933', city: '3836277', postal_code: '3000', id_number: '30678393734', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Quimadh', street_address: 'Azcuenaga 2884', city: '3835793', postal_code: '3016', id_number: '30678363673', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Winkelmann S.R.L.', street_address: 'Sarmiento 2730', city: '3836277', postal_code: '3000', id_number: '30708497335', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Frigorifico Goggi', street_address: 'Brasil 4676', city: '3836277', postal_code: '3000', id_number: '30710264712', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Sbodio S.A.', street_address: 'San Jeronimo 2859', city: '3836277', postal_code: '3000', id_number: '30692358720', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Paladini Eduardo Luis', street_address: 'Azcuenaga 8535', city: '3838583', postal_code: '2000', id_number: '20055220450', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Haidar y Cia S.R.L.', street_address: 'Berutti 6001', city: '3836277', postal_code: '3000', id_number: '30506141237', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Ramos Mexia Alberto Jose', street_address: 'Tucuman 2720', city: '3836277', postal_code: '3000', id_number: '20125653287', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Wenten S.R.L.', street_address: 'San Martin 2515 Piso 12 Dpto B', city: '3836277', postal_code: '3000', id_number: '30710815085', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Renzulli Maria del Carmen', street_address: 'Suipacha 2980', city: '3836277', postal_code: '3000', id_number: '27126960021', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'David Domingo Alberto Ramon', street_address: '9 de Julio 2838', city: '3836277', postal_code: '3000', id_number: '20138831583', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Duende del Jardin S.A.', street_address: 'Fryda Schultz de Mantovani 470 - Puerto Santa Fe', city: '3836277', postal_code: '3000', id_number: '30710088051', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Tecno Dalvo', street_address: 'Hipolito Irigoyen 2860', city: '3836277', postal_code: '3000', id_number: '30707854088', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Sindicato Luz y Fuerza', street_address: 'Junin 2957', city: '3836277', postal_code: '3000', id_number: '30545758241', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Unisem', street_address: '9 de Julio 3601', city: '3836277', postal_code: '3000', id_number: '30610382408', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Stratta Osvaldo y Stratta Maria S.H.', street_address: '9 de Julio 2820', city: '3836277', postal_code: '3000', id_number: '30709483222', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'COEMYC S.A.', street_address: 'Padre Genesio 888', city: '3836277', postal_code: '3000', id_number: '30523468460', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Vassallo Maria Hercilia', street_address: 'Facundo Zuviria 4424', city: '3836277', postal_code: '3000', id_number: '23075899904', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Farre Ricardo Oscar', street_address: 'San Juan 2239', city: '3836277', postal_code: '3000', id_number: '23149925619', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Secretaria de Estado del Habitat', street_address: 'San Luis 3153', city: '3836277', postal_code: '3000', id_number: '30714378771', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'Caja de Ingenieros de Santa Fe', street_address: 'San Jeronimo 3033', city: '3836277', postal_code: '3000', id_number: '30645040704', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'Electronica Megatone S.A.', street_address: 'Ruta Nacional 168 Km 473,6', city: '3836277', postal_code: '3000', id_number: '30543659734', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Acantilados S.A.', street_address: 'San Luis 3102', city: '3836277', postal_code: '3000', id_number: '30709414786', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'PECAM S.A.', street_address: 'BALCARCE 1021', city: '3838583', postal_code: '2000', id_number: '30616509361', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Carlos Daniel Peres', street_address: '9 de Julio 2700', city: '3836277', postal_code: '3000', id_number: '20172221638', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Ministerio de Educacion', street_address: 'Illia 1159', city: '3836277', postal_code: '3000', id_number: '30999079039', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'PANTANALI RUBEN ANGEL', street_address: 'SAN JERONIMO 2558 DPTO 2', city: '3836277', postal_code: '3000', id_number: '20133777114', id_type: 'L', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/3/'},
        {name: 'Gobierno de la Ciudad de Buenos Aires', street_address: 'Esmeralda 189 Piso 7', city: '3435910', postal_code: '1035', id_number: '34999032089', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'Municipalidad de Santa Fe', street_address: 'Salta 2951', city: '3836277', postal_code: '3000', id_number: '30999033381', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'Juan Pablo II S. R.L.', street_address: 'Guemes 4543', city: '3836277', postal_code: '3000', id_number: '30713676809', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Fideicomiso Portales lV', street_address: '3 de Febrero 2831', city: '3836277', postal_code: '3000', id_number: '30714044288', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'J.C. Construcciones SA', street_address: 'Pasaje Público 8536', city: '3836277', postal_code: '3000', id_number: '33712976409', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Cocyar SA Empresa Constructora - Pilatti SA - UTE', street_address: 'Mitre 5960', city: '3836277', postal_code: '3000', id_number: '30714718629', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'Vallverdu Hector Pedro', street_address: 'San Martin 2664', city: '3836277', postal_code: '3000', id_number: '23117204669', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Saux Wernl y S.A.', street_address: 'General López 2840', city: '3836277', postal_code: '3000', id_number: '30595784774', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'CSN S.A.', street_address: 'Ruta Nacional 168 km 473,6', city: '3836277', postal_code: '3000', id_number: '30641056177', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'ISOLUX INGENIERIA S.A E IECSA S.A. - UTE', street_address: 'MANUEL SAENZ 323 Piso:8 - BARRIO: PUERTO MADERO', city: '3435910', postal_code: '1107', id_number: '30710681836', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'ALTO PARANA PISOS S.A. EN FORMACION', street_address: 'RIVADAVIA 6065', city: '3836277', postal_code: '3000', id_number: '30715092448', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'Defensoría del Pueblo', street_address: 'Eva Perón 2726', city: '3836277', postal_code: '3000', id_number: '30649537808', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'File Protection S.R.L', street_address: 'Llerena 1976', city: '3836277', postal_code: '3000', id_number: '30708184302', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'CILSA', street_address: 'La Rioja 2441 3º piso', city: '3836277', postal_code: '3000', id_number: '30562113289', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'BERTONE Y MURCHIO SH', street_address: 'SAAVEDRA 2673', city: '3836277', postal_code: '3000', id_number: '30712279229', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'NESTLE ARGENTINA SA', street_address: 'AV. DEL LIBERTADOR 1855', city: null, postal_code: '1638', id_number: '30546764040', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'PRONET DE ARGENTINA S.R.L.', street_address: 'ALEM LEANDRO N. AV. 424', city: '3435910', postal_code: '1003', id_number: '30662037156', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'SIAL INGENIERIA', street_address: 'PACHECO 421', city: '3838583', postal_code: '2000', id_number: '30708732024', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'PILAY S.A.', street_address: 'SAN MARTIN 1878', city: '3836277', postal_code: '3000', id_number: '30573819256', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'MARTINEZ ANA LAURA', street_address: 'AZOPARDO 9167', city: '3836277', postal_code: '3000', id_number: '27282174311', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/3/'},
        {name: 'CHAYA INGRID ANGELINA', street_address: '1º DE MAYO 3074 9B', city: '3836277', postal_code: '3000', id_number: '27295954359', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'VERDE E HIJOS S.C.A', street_address: '25 DE MAYO 2676', city: '3836277', postal_code: '3000', id_number: '30526164241', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'HONORABLE CONCEJO MUNICIPAL', street_address: 'SALTA 2943', city: '3836277', postal_code: '3000', id_number: '30682027343', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'GENUS COMERCIAL S.A.', street_address: 'AZPEITIA 1909', city: '3860259', postal_code: '5000', id_number: '30709805017', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'INVERSIONES HOTELERAS S.R.L', street_address: 'RIVADAVIA 2680', city: '3836277', postal_code: '3000', id_number: '30714391654', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'NOVO S.A.', street_address: 'BV. PELLEGRINI 3297', city: '3836277', postal_code: '3000', id_number: '30714175722', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'SIERRA CARLOS ALBERTO', street_address: 'J.J. PASO 3493', city: '3836277', postal_code: '3000', id_number: '20107143107', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'KARLEN ELIANA MAGALI', street_address: 'MARCIAL CANDIOTI 6162', city: '3836277', postal_code: '3000', id_number: '27348278946', id_type: 'L', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'JOSE BALLARI', street_address: '9 DE JULIO 2621', city: '3836277', postal_code: '3000', id_number: '23272047359', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'MARIA HERCILIA VASSARIO', street_address: 'CORONEL FASOLINO 450', city: '3836277', postal_code: '3000', id_number: '23075899904', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'SECRETARIA DE ESTADO DE LA ENERGIA', street_address: 'TUCUMAN 2945', city: '3836277', postal_code: '3000', id_number: '30712161384', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/1/'},
        {name: 'KERZ JUAN ANDRES HUMBERTO', street_address: 'AMENABAR 3059', city: '3836277', postal_code: '3000', id_number: '20144021534', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'MARTIN AVEILLETESTI', street_address: 'BULEVAR PELEGRINI 2349', city: '3836277', postal_code: '3000', id_number: '20251575437', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'},
        {name: 'AMIND S.R.L.', street_address: 'PAVON 434', city: '3837675', postal_code: '2400', id_number: '30711809054', id_type: 'T', fiscal_position: 'http://localhost:8000/api/invoice/fiscalpositions/2/'}
      ]
    }
  },
  methods: {
    fiscalpositions_ar () {
      var fiscalposition = {name: 'IVA Responsable Inscripto'}
      this.$http.post('invoice/fiscalpositions', fiscalposition)
      fiscalposition = {name: 'IVA Exento'}
      this.$http.post('invoice/fiscalpositions', fiscalposition)
      fiscalposition = {name: 'Consumidor Final'}
      this.$http.post('invoice/fiscalpositions', fiscalposition)
      this.wizard_fiscalpositions = false
    },
    doit_phaggot () {
      console.log('aw fuk bye')
      var _self = this
      this.contacts.forEach(function (contact) {
        _self.invoice_ar_contact.invoice_contact.contact_contact.name = contact.name
        _self.invoice_ar_contact.invoice_contact.legal_name = contact.name
        _self.invoice_ar_contact.invoice_contact.fiscal_address.street_address = contact.street_address
        _self.invoice_ar_contact.invoice_contact.fiscal_address.city = contact.city
        _self.invoice_ar_contact.invoice_contact.fiscal_address.postal_code = contact.postal_code
        _self.invoice_ar_contact.invoice_contact.fiscal_position = contact.fiscal_position
        _self.invoice_ar_contact.id_type = contact.id_type
        _self.invoice_ar_contact.id_number = contact.id_number
        console.log(JSON.stringify(_self.invoice_ar_contact))
        _self.$http.post('invoice_ar/contacts/', _self.invoice_ar_contact)
      })
    }
  },
  ready: function () {
    /*
    var $ = window.jQuery

    var engine = new window.Bloodhound({
      datumTokenizer: window.Bloodhound.tokenizers.obj.whitespace('text'),
      queryTokenizer: window.Bloodhound.tokenizers.whitespace,
      local: [
        {'id': 1, 'text': 'Capitel S.A.', 'continent': 'Europe'},
        {'id': 2, 'text': 'COAC', 'continent': 'Europe'},
        {'id': 3, 'text': 'COEMYC S.A.', 'continent': 'Europe'},
        {'id': 4, 'text': 'Honorable Concejo Municipal', 'continent': 'America'},
        {'id': 5, 'text': 'Genus Comercial S.A.', 'continent': 'America'}
      ]
    })
    engine.initialize()

    var elt = $('input')
    elt.tagsinput({
      itemValue: 'id',
      itemText: 'text',
      typeaheadjs: {
        name: 'engine',
        displayKey: 'text',
        source: engine.ttAdapter()
      }
    })
    elt.tagsinput('add', {'id': 6, 'text': 'Arcor SAIC', 'id_type': 'T'})
    elt.tagsinput('add', {'id': 7, 'text': 'Winkelmann S.R.L.', 'id_type': 'T'})

    elt.tagsinput({
      itemValue: 'id',
      itemText: 'text',
      typeaheadjs: {
        name: 'engine',
        displayKey: 'text',
        source: engine.ttAdapter()
      }
    })
    */

    this.$parent.$data.currentApp = 'Configuración'
    this.$parent.$data.subMenuElements = []

    this.$http.get('invoice/fiscalpositions/').then(function (response) {
      if (response.json().count > 0) {
        this.wizard_fiscalpositions = false
      }
    })
  }
}
</script>
