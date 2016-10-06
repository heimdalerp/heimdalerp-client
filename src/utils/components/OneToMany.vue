<template>
<div>
  <form id='bootstrapTagsInputForm' method='post' class='form-horizontal'>
      <div class='form-group'>
          <label class='col-xs-3 control-label'>{{ name }}:</label>
          <div class='col-xs-8'>
              <input id='wotmate' type='text' class='form-control' />
          </div>
      </div>
  </form>
</div>
</template>
<script>
export default {
  props: ['name', 'options', 'model'],
  created () {
    this.id = Math.floor((Math.random() * 10000) + 1)
  },
  ready () {
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

    var elt = $('#wotmate')
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
  }
}
</script>
<style>
</style>
