document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const alertContainer = document.getElementById('alert-container');

    const showAlert = (message, type = 'danger') => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
                                ${message}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                             </div>`;
        alertContainer.innerHTML = '';
        alertContainer.append(wrapper);
    };

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Falha no registro.');
                }
                showAlert('Registro realizado com sucesso! Você será redirecionado para o login.', 'success');
                setTimeout(() => window.location.href = '/login', 2000);
            } catch (err) {
                showAlert(err.message);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Falha no login.');
                }
                // Salva o token no localStorage
                localStorage.setItem('authToken', result.token);
                showAlert('Login bem-sucedido! Redirecionando...', 'success');
                setTimeout(() => window.location.href = '/products', 1500);
            } catch (err) {
                showAlert(err.message);
            }
        });
    }
});