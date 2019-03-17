function siblings (domObj, query) {
  return [].slice.call(
    domObj
    .parentElement
    .querySelectorAll(query)
  ).filter(function (d) {return d != domObj;});
}

function delay (cb) {
  setTimeout(cb, 100);
}

document
.querySelectorAll('.field > input')
.forEach(function ($input) {
  var $label = siblings($input, 'label')[0];
  if ($input.value) {
    $label.classList.add('field__label--active');
  }
  $input.addEventListener('focus', function () {
    $label.classList.add('field__label--active');
  });
  $input.addEventListener('focusout', function () {
    delay(function () {
      if(!$input.value)
        $label.classList.remove('field__label--active');
    });
  });
  $input.addEventListener('change', function () {
    delay(function () {
      if($input.value)
        $label.classList.add('field__label--active');
    });
  });
})