document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login'; // Se não há token, redireciona para login
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    const productTableBody = document.getElementById('products-table-body');
    const productForm = document.getElementById('product-form');
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    const modalTitle = document.getElementById('modalTitle');
    const productIdField = document.getElementById('productId');

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products', { headers });
            if (response.status === 401) { // Token expirado/inválido
                 localStorage.removeItem('authToken');
                 window.location.href = '/login';
                 return;
            }
            const products = await response.json();
            productTableBody.innerHTML = '';
            products.forEach(product => {
                const row = `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.description}</td>
                        <td>R$ ${product.price.toFixed(2)}</td>
                        <td>
                            <button class="btn btn-sm btn-warning btn-edit" data-id="${product.id}">Editar</button>
                            <button class="btn btn-sm btn-danger btn-delete" data-id="${product.id}">Excluir</button>
                        </td>
                    </tr>
                `;
                productTableBody.innerHTML += row;
            });
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };
    
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = productIdField.value;
        const productData = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value)
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/products/${id}` : '/api/products';
        
        try {
            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(productData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            productForm.reset();
            productIdField.value = '';
            modal.hide();
            fetchProducts();
        } catch(error) {
            console.error('Erro ao salvar produto:', error);
        }
    });

    // Event Delegation para botões de editar e excluir
    productTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.dataset.id;
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                await fetch(`/api/products/${id}`, { method: 'DELETE', headers });
                fetchProducts();
            }
        }
        
        if (e.target.classList.contains('btn-edit')) {
            const id = e.target.dataset.id;
            const response = await fetch(`/api/products/${id}`, { headers });
            const product = await response.json();

            modalTitle.textContent = 'Editar Produto';
            productIdField.value = product.id;
            document.getElementById('name').value = product.name;
            document.getElementById('description').value = product.description;
            document.getElementById('price').value = product.price;
            modal.show();
        }
    });

    // Limpar o formulário ao abrir o modal para Adicionar
    document.getElementById('productModal').addEventListener('hidden.bs.modal', () => {
        productForm.reset();
        productIdField.value = '';
        modalTitle.textContent = 'Novo Produto';
    });
    
    fetchProducts();
});

// Adicionar um botão de Logout
const headerNav = document.querySelector('.navbar-nav');
if (localStorage.getItem('authToken')) {
    const logoutLink = document.createElement('li');
    logoutLink.className = 'nav-item';
    logoutLink.innerHTML = '<a href="#" class="nav-link" id="logout-btn">Sair</a>';
    headerNav.appendChild(logoutLink);

    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    });
}