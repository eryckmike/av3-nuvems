const API_URL = 'http://localhost:3000';

const form = document.getElementById('produto-form');
const listaProdutos = document.getElementById('lista-produtos');

async function carregarProdutos() {
    const response = await fetch(`${API_URL}/produtos`);
    const produtos = await response.json();
    listaProdutos.innerHTML = '';
    produtos.forEach(produto => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${produto.nome}</strong> - R$ ${produto.preco.toFixed(2)}
            <p>${produto.descricao || 'Sem descrição'}</p>
            <button onclick="editarProduto(${produto.id})">Editar</button>
            <button onclick="deletarProduto(${produto.id})">Excluir</button>
        `;
        listaProdutos.appendChild(li);
    });
}

async function salvarProduto(event) {
    event.preventDefault();
    const id = document.getElementById('produto-id').value;
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const preco = parseFloat(document.getElementById('preco').value);

    const produto = { nome, descricao, preco };
    const url = id ? `${API_URL}/produtos/${id}` : `${API_URL}/produtos`;
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
    });

    if (response.ok) {
        form.reset();
        document.getElementById('produto-id').value = '';
        carregarProdutos();
    } else {
        alert('Erro ao salvar o produto');
    }
}

async function editarProduto(id) {
    const response = await fetch(`${API_URL}/produtos/${id}`);
    const produto = await response.json();
    document.getElementById('produto-id').value = produto.id;
    document.getElementById('nome').value = produto.nome;
    document.getElementById('descricao').value = produto.descricao || '';
    document.getElementById('preco').value = produto.preco;
}

async function deletarProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        const response = await fetch(`${API_URL}/produtos/${id}`, { method: 'DELETE' });
        if (response.ok) {
            carregarProdutos();
        } else {
            alert('Erro ao excluir o produto');
        }
    }
}

form.addEventListener('submit', salvarProduto);
carregarProdutos();