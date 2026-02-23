const cardapioItens = [
    { id: 1, categoria: "combos", nome: "Ferris Wheel Box", descricao: "8 Mini Burgers + Fries with Cheddar and Bacon.", preco: 89.90, imagem: "./imagens/imagem01.jpg", destaque: true, tags: "family large party" },
    { id: 2, categoria: "combos", nome: "Premium Couple Box", descricao: "2 Burgers + Onion Rings + Fries.", preco: 64.90, imagem: "./imagens/imagem02.jpg", tags: "couples two" },
    { id: 3, categoria: "combos", nome: "Ostentation Boat", descricao: "4 Burgers + Nuggets + Loaded Fries.", preco: 79.90, imagem: "./imagens/imagem03.jpg", destaque: true, tags: "chicken" },
    { id: 4, categoria: "combos", nome: "Family Box", descricao: "4 Classic Burgers + Large Fries.", preco: 72.90, imagem: "./imagens/imagem04.jpg" },
    { id: 5, categoria: "combos", nome: "Squad Combo", descricao: "6 Burgers + 2 Sodas 1.5L.", preco: 95.00, imagem: "./imagens/imagem05.jpg", tags: "drink" },
    { id: 6, categoria: "promocoes", nome: "Double Dinner", descricao: "2 Bacon Cheese Salads + Eggs/Cheddar Fries.", preco: 39.90, precoAntigo: 55.00, imagem: "./imagens/imagem06.jpg", tags: "cheap" },
    { id: 7, categoria: "promocoes", nome: "Soda Duo", descricao: "2 Cheeseburgers + Fries + Coke 1.5L.", preco: 45.90, precoAntigo: 62.00, imagem: "./imagens/imagem07.jpg", destaque: true, tags: "coke soda" },
    { id: 8, categoria: "promocoes", nome: "Smash Trio", descricao: "3 Simple Smash Burgers.", preco: 29.90, precoAntigo: 42.00, imagem: "./imagens/imagem08.jpg" },
    { id: 9, categoria: "promocoes", nome: "Solo Offer", descricao: "1 Burger + Small Fries + Canned Soda.", preco: 22.90, precoAntigo: 30.00, imagem: "./imagens/imagem09.jpg", tags: "alone" },
    { id: 10, categoria: "promocoes", nome: "Chicken Bucket", descricao: "500g of Crispy Chicken.", preco: 35.00, precoAntigo: 45.00, imagem: "./imagens/imagem10.jpg", tags: "chicken" },
    { id: 11, categoria: "destaques", nome: "Monster Cheddar", descricao: "Double Blend bathed in Cheddar.", preco: 34.90, imagem: "./imagens/imagem11.jpg", destaque: true, tags: "cheese giant" },
    { id: 12, categoria: "destaques", nome: "5 Friends Box", descricao: "5 Burgers + Pepperoni Fries.", preco: 59.90, imagem: "./imagens/imagem12.jpg" },
    { id: 13, categoria: "destaques", nome: "Double Bacon", descricao: "Lots of bacon and green mayo.", preco: 32.90, imagem: "./imagens/imagem13.jpg", tags: "pork" },
    { id: 14, categoria: "destaques", nome: "Double Bacon", descricao: "Lots of bacon and green mayo.", preco: 32.90, imagem: "./imagens/imagem14.jpg", tags: "pork" },


]

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const NUMERO_ZAP = "5511913257453"; 

document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho();
    const containerGrade = document.getElementById('grade-produtos');
    
    
    if (containerGrade) {
        renderizarGrade(containerGrade.getAttribute('data-categoria'));
    } else {
        renderizarCardapio(cardapioItens);
        inicializarScroll();
        inicializarBusca();
    }
});


function renderizarCardapio(lista) {
    const containers = { 
        combos: document.getElementById('container-combos'), 
        promocoes: document.getElementById('container-promocoes'), 
        destaques: document.getElementById('container-destaques') 
    };
    
    
    if(!containers.combos) return;

    Object.values(containers).forEach(c => c.innerHTML = '');
    
    if(lista.length === 0) { 
        document.getElementById('msg-sem-resultado').style.display = 'block'; 
        return; 
    }
    document.getElementById('msg-sem-resultado').style.display = 'none';

    lista.forEach(item => {
        const card = criarHTMLCard(item);
        if(item.categoria === 'combos' && containers.combos) containers.combos.innerHTML += card;
        if(item.categoria === 'promocoes' && containers.promocoes) containers.promocoes.innerHTML += card;
        if(item.categoria === 'destaques' && containers.destaques) containers.destaques.innerHTML += card;
    });
}


function renderizarGrade(categoriaAlvo) {
    const container = document.getElementById('grade-produtos');
    const itens = cardapioItens.filter(item => item.categoria === categoriaAlvo);
    container.innerHTML = itens.length === 0 ? '<h3 style="color:#fff;">No items found.</h3>' : itens.map(criarHTMLCard).join('');
}

/* Card de Produto */
function criarHTMLCard(item) {
    const precoHTML = item.precoAntigo ? 
        `<div class="price-tag-promo"><span class="preco-antigo">$ ${item.precoAntigo.toFixed(2)}</span><span class="preco-novo">$ ${item.preco.toFixed(2)}</span></div>` : 
        `<div class="price-tag">$ ${item.preco.toFixed(2)}</div>`;
        
    return `
        <div class="burger-card">
            ${item.destaque ? '<div class="ribbon">TOP</div>' : ''}
            <div class="card-image">
                <img src="${item.imagem}" alt="${item.nome}" loading="lazy">
                ${precoHTML}
            </div>
            <div class="card-info">
                <h3>${item.nome}</h3>
                <p>${item.descricao}</p>
                <button class="btn-add" onclick="adicionarCarrinho(${item.id})">Add</button>
            </div>
        </div>`;
}

/* Sistema de Busca */
function inicializarBusca() {
    const input = document.getElementById('input-busca');
    const btn = document.getElementById('btn-busca');
    if(!input) return;
    input.addEventListener('input', (e) => filtrarItens(e.target.value));
    btn.addEventListener('click', () => filtrarItens(input.value));
}

function filtrarItens(termo) {
    const termoLimpo = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    if(termoLimpo === "") { renderizarCardapio(cardapioItens); return; }
    const filtrados = cardapioItens.filter(item => (item.nome + item.descricao + item.tags).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(termoLimpo));
    renderizarCardapio(filtrados);
}
function limparBusca() { document.getElementById('input-busca').value = ""; filtrarItens(""); }


function inicializarScroll() {
    document.querySelectorAll('.row-container').forEach(cont => {
        const row = cont.querySelector('.netflix-row');
        cont.querySelector('.btn-left').onclick = () => row.scrollBy({ left: -300, behavior: 'smooth' });
        cont.querySelector('.btn-right').onclick = () => row.scrollBy({ left: 300, behavior: 'smooth' });
    });
}

/* Funções do Menu e Carrinho */
function toggleMenu() { document.querySelector('.main-nav').classList.toggle('active'); }

function adicionarCarrinho(id) { 
    const item = cardapioItens.find(p => p.id === id); 
    carrinho.push(item); 
    salvarCarrinho(); 
    atualizarCarrinho(); 
}

function remover(i) { 
    carrinho.splice(i, 1); 
    salvarCarrinho(); 
    atualizarCarrinho(); 
}

function salvarCarrinho() { localStorage.setItem('carrinho', JSON.stringify(carrinho)); }

function atualizarCarrinho() {
    document.getElementById('contador-carrinho').innerText = carrinho.length;
    document.getElementById('lista-itens-carrinho').innerHTML = carrinho.map((item, i) => 
        `<div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee; align-items:center;">
            <span>${item.nome}</span>
            <span>$ ${item.preco.toFixed(2)} <i class="fas fa-trash" onclick="remover(${i})" style="color:red; cursor:pointer; margin-left:10px;"></i></span>
        </div>`
    ).join('');
    document.getElementById('total-carrinho').innerText = `$ ${carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}`;
}

function toggleCarrinho() { document.getElementById('carrinho-modal').classList.toggle('aberto'); }

function finalizarPedidoWhatsapp() {
    const nome = document.getElementById('nome-cliente').value; 
    const end = document.getElementById('endereco-cliente').value; 
    const pag = document.getElementById('forma-pagamento').value;
    
    if(!nome || !end || carrinho.length === 0) return alert("Please fill in all fields!");
    
    let msg = `*MORABURGER ORDER* 🍔\n\n*Customer:* ${nome}\n*Address:* ${end}\n\n*ITEMS:*\n`;
    carrinho.forEach(i => msg += `- ${i.nome} ($ ${i.preco.toFixed(2)})\n`);
    msg += `\n*Total:* $ ${carrinho.reduce((acc, i) => acc + i.preco, 0).toFixed(2)}\n*Payment:* ${pag}`;
    
    carrinho = []; salvarCarrinho(); atualizarCarrinho(); 
    window.open(`https://wa.me/${NUMERO_ZAP}?text=${encodeURIComponent(msg)}`);
}

function toggleContato() { document.getElementById('modal-contato').classList.toggle('active'); }


function toggleDropdownMobile(event) {
    if (window.innerWidth <= 768) {
        event.preventDefault();
        
        event.target.closest('.dropdown').classList.toggle('ativo');
    }
}