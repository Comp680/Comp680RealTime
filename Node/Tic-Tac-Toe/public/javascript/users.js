var client = $.fn.ClientGame("http://localhost:3000", 4, {});

function success(data){
  alert(data);
}

function failure(jqXHR,textStatus,errorThrown){
  alert(textStatus);
}

function login(event,form){
  client.login(form.elements['username'].value,form.elements['password'].value,success,failure);
  event.preventDefault();
  return false;
}

function register(event,form){
  client.register(form.elements['username'].value,form.elements['password'].value,success,failure);
  event.preventDefault();
	return false;
}
