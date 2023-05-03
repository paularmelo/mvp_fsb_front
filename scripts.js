/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {

  let url = 'http://127.0.0.1:5000/receitas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.receitas.forEach(item => insertList(item.id, item.titulo, item.categoria, item.status))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputTitulo, inputStatus, inputCategoria, inputPreparo) => {
  const formData = new FormData();
  formData.append('titulo', inputTitulo);
  formData.append('status', inputStatus);
  formData.append('preparo', inputPreparo);
  formData.append('categoria', inputCategoria);

  let url = 'http://127.0.0.1:5000/receita';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      newIngrediente2(data.id)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para colocar um ingrediente na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postIngrediente = async (inputDescricao, inputQuantidade, inputUnidadeMedida, inputReceitaID) => {
  const formData = new FormData();
  formData.append('descricao', inputDescricao);
  formData.append('quantidade', inputQuantidade);
  formData.append('unidade_medida', inputUnidadeMedida);
  formData.append('receita_id', inputReceitaID);

  let url = 'http://127.0.0.1:5000/ingrediente';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);

}
/*
  --------------------------------------------------------------------------------------
  Função para criar um botão detalhe para cada item da lista
  --------------------------------------------------------------------------------------
*/
const inserDetailtButton = (parent) => {
  let span = document.createElement("spanDetail");
  let txt = document.createTextNode("...");
  span.className = "detail";
  span.appendChild(txt);
  parent.appendChild(span);

}



/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[1].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para mostrar detalhe de um item da lista de acordo com o click
  --------------------------------------------------------------------------------------
*/
const detailElement = () => {
  let open = document.getElementsByClassName("detail");

  let i;
  for (i = 0; i < open.length; i++) {
    open[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[1].innerHTML
      detailItem(nomeItem)
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/receita?titulo=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para detalhar um item da lista do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const detailItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/receita?titulo=' + item;
  fetch(url, {
    method: 'get'
  })
    .then((response) => response.json())
    .then((data) => {
      insertDetailItem(data.id, data.titulo, data.categoria, data.status, data.preparo, [data.ingredientes])
    })
    .catch((error) => {
      console.error('Error:', error);
    });

}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputTitulo = document.getElementById("newTitulo").value;
  let inputPreparo = document.getElementById("newPreparo").value;

  var inputStatus;
  var inputCategoria;

  if (document.getElementById('AP').checked) {
    inputStatus = document.getElementById('AP').value;
  } else if (document.getElementById('RE').checked) {
    inputStatus = document.getElementById('RE').value;
  } else if (document.getElementById('NT').checked) {
    inputStatus = document.getElementById('NT').value;
  }

  if (document.getElementById('DOCE').checked) {
    inputCategoria = document.getElementById('DOCE').value;
  } else if (document.getElementById('SAL').checked) {
    inputCategoria = document.getElementById('SAL').value;
  }

  if (inputTitulo === '') {
    alert("Escreva o titulo da receita!");
  }
  else {
    //insertList(inputTitulo, status_value, inputCategoria)
    postItem(inputTitulo, inputStatus, inputCategoria, inputPreparo)
    alert("Item adicionado!")
  }
}

const newIngrediente = () => {
  let inputIngrediente = document.getElementById("newDescricao").value;
  let inputQuantity = document.getElementById("newQtd").value;
  let inputUnidade = document.getElementById("newUnidade").value;

  var item = [inputIngrediente, inputQuantity, inputUnidade]
  var table = document.getElementById('myIngredientes');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }

}

const newIngrediente2 = (receita_id) => {
  var table = document.getElementById('myIngredientes');
  var l = table.rows.length;

  for (var i = 1; i < l; i++) {
    var tr = table.rows[i];
    var descricao = tr.cells.item(0).innerHTML;
    var qunatidade = tr.cells.item(1).innerHTML;
    var unidade_medida = tr.cells.item(2).innerHTML;

    postIngrediente(descricao, qunatidade, unidade_medida, receita_id)


  }
}


/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (inputId, inputTitulo, inputCategoria, inputStatus) => {

  var item = [inputId, inputTitulo, inputCategoria, inputStatus]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  inserDetailtButton(row.insertCell(-1))
  detailElement()
  insertButton(row.insertCell(-1))
  removeElement()
}


/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista de ingredientes
  --------------------------------------------------------------------------------------
*/
const insertListIngredientes = (inputDescricao, inputQuantidade, inputUnidadeMedida) => {
  var item = [inputDescricao, inputQuantidade, inputUnidadeMedida]
  var table = document.getElementById('myIngredientes');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
}
/*
  --------------------------------------------------------------------------------------
  Função para preencher item na tela
  --------------------------------------------------------------------------------------
*/
const insertDetailItem = (inputId, inputTitulo, inputCategoria, inputStatus, inputPreparo, [ingredientes]) => {

  document.getElementById("newTitulo").value = inputTitulo

  if (inputStatus == "Aprovada") {
    document.getElementById("AP").checked = true
  } else if (inputStatus == "Reprovada") {
    document.getElementById("RE").checked = true
  } else {
    document.getElementById("NT").checked = true
  }

  if (inputCategoria == "Doce") {
    document.getElementById("DOCE").checked = true
  } else {
    document.getElementById("SAL").checked = true
  }

  document.getElementById("newPreparo").value = inputPreparo

  document.getElementById("newItem").style.display = "block";
  document.getElementById("listReceitas").style.display = "none";
  document.getElementById('Salvar').style.display = "none";

  ingredientes.forEach(item => insertListIngredientes(item.descricao, item.quantidade, item.unidade_media))

}
const voltar = () => {
  document.getElementById("newTitulo").value = ""
  document.getElementById("newPreparo").value = ""
  document.getElementById("Voltar").style.display = "none";
  document.getElementById('Salvar').style.display = "block";
  window.location.reload(true);

}