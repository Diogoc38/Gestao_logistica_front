import { defineStore } from 'pinia';

function safelyParse(value) {
    try {
        if (!value || value === 'undefined') return null;
        return JSON.parse(value);
    } catch {
        return null;
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        utilizador: safelyParse(localStorage.getItem('utilizador')),
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        isAuthenticated: state => !!state.token,
        nomeUtilizador: state => state.utilizador?.nome_utilizador || '',
    },
    actions: {
        login(utilizador, token) {
            this.utilizador = utilizador;
            this.token = token;
            localStorage.setItem('utilizador', JSON.stringify(utilizador));
            localStorage.setItem('token', token);
        },
        logout() {
            this.utilizador = null;
            this.token = null;
            localStorage.removeItem('utilizador');
            localStorage.removeItem('token');
        },
    },
});
