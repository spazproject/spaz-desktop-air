jQuery.extend(jQuery.expr[':'], {
  icontains: function(a,i){return (a.textContent||a.innerText||jQuery(a).text()||'').toLowerCase().indexOf((m[3]||'').toLowerCase())>=0;}
});
