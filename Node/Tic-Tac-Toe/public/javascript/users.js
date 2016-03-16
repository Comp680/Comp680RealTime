var client =  $.fn.ClientGame("localhost:3000", 4, {});

function success(data){
  alert(data);
}

function failure(jqXHR,textStatus,errorThrown){
  alert(textStatus);
}

function login(){
  client.login("world","world",success,failure);

}
