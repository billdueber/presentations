var root = '';

function getCollections(select) {
  var sublib = jq(select)
  var suffix = sublib.attr('id').split('sub_library').pop()
  var collections = jq('#items-_-collection' + suffix);
  var current = jq('option:selected', sublib).val();
  collections.empty();
  jq.get(root + "/ajax/collections/" + current, function(data) {
    collections.append(data);
    }
  );
}

function ajax_submit_form(target_id, form_id, post_url) {
  var target = jq('#' + target_id);
  target.empty().append("Working...");
  target.show();
  jq.post(post_url, jq('#' + form_id).serialize(),
    function(data) {
      target.empty().append(data).show();
    }
  );
  return false;
}



function hide_on_empty(dd, id_to_hide) {
  if (jq(dd).val() == 'empty') {
    jq('#' + id_to_hide).hide();
  } else {
    jq('#' + id_to_hide).show();
  }
}


function verify_inventory() {
  var errors = []
  grange_box_verify(errors);
  sub_lib_verify(errors);
  numbers_verify(errors);
  if (errors.length > 0) {
    alert(errors.join("\n"));
    return false;
  } else {
    return true;
  }
}



function sub_lib_verify(errors) {
  var sel = jq('#items-_-sub_library');
  var has_sublib = jq('option', sel).filter(':selected').val() != "";
  if (!has_sublib) {
    errors.push("You need to choose a sublibrary (and, optionally, collections) before submitting");
  }
  return has_sublib;
}

function numbers_verify(errors) {
  var ok_to_submit = true;
  already_noted = {}
  jq('input[data-type="number"]').each(function() {
    var val = jq(this).val();
    if (val.match(/\S/) && !val.match(/\s*\d+\s*/)) {
      hrv = jq(this).attr('data-hrv')
      if (!already_noted[hrv]) {
        errors.push(hrv + " must be a number");
        ok_to_submit = false;
        already_noted[hrv] = true;
      }
    }
  })
  return ok_to_submit;
}


/* grangeBox(name) -- allow between/lte/gte values to be entered */

function grangeBox(sel, reset) {
  reset = typeof reset !== 'undefined' ? reset : true; // default is true
  s = jq(sel);
  name = s.attr('data-basename');
  
  between = jq('div[name="' + name + '_between"]');
  single  = jq('div[name="' + name + '_single"]');
  
  typed_name = name + '-_-type_grange';
  curr = jq('option', s).filter(':selected').val();
  if (curr == "between") {
    single.hide();
    between.show();
  } else {
    single.show();
    between.hide();
  }
  
  if (reset) {
    jq('input[name="' + typed_name + '"]').val('');
  }
  
}


function grange_box_verify(errors) {
  var ok_to_go_on = true;
  jq('.grange_between').each(
    function() {
      var div = jq(this);
      var basename = div.attr('data-basename');
      var selectname = basename + '-_-type_rangetype';
      var s = jq('select[name="' + selectname + '"]');
      var curr = jq('option', s).filter(':selected').val();
      
      var full = 0;
      if (curr == 'between') {
        jq('input', div).each(function() {
          var val = jq(this).val();
          if (val.match(/\S/)) {
            full++;
          }
        });
      }
      if (full == 1) {
        errors.push('"' + div.attr('data-hrv') + '" must have both values filled in for a "between" filter');
        ok_to_go_on = false;
      }
    }
  )
  return ok_to_go_on;
}



