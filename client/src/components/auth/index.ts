import type { SessionState } from "../../types.js";
import { escapeHtml } from "../../utils/format.js";

export function renderAuthPage(session: SessionState): string {
    if (session.user) {
        return `
            <main class="page">
                <section class="auth-card">
                    <h2 class="section-title">Профиль пользователя</h2>
                    <div class="summary-list">
                        <div class="summary-row"><span>Имя</span><strong>${escapeHtml(session.user.name)}</strong></div>
                        <div class="summary-row"><span>Email</span><strong>${escapeHtml(session.user.email)}</strong></div>
                        <div class="summary-row"><span>Логин</span><strong>${escapeHtml(session.user.login)}</strong></div>
                        <div class="summary-row"><span>Телефон</span><strong>${escapeHtml(session.user.phone)}</strong></div>
                    </div>
                </section>
            </main>
        `;
    }

    return `
        <main class="page auth-layout">
            <section class="auth-card">
                <h2 class="section-title">Авторизация</h2>
                <form data-form="login">
                    <div class="field">
                        <label for="login-auth">Логин</label>
                        <input id="login-auth" name="login" type="text" required>
                    </div>
                    <div class="field">
                        <label for="password-auth">Пароль</label>
                        <input id="password-auth" name="password" type="password" required>
                    </div>
                    <div class="inline-actions">
                        <button class="btn" type="submit">Войти</button>
                    </div>
                </form>
            </section>

            <section class="auth-card">
                <h2 class="section-title">Регистрация</h2>
                <form data-form="register" data-registration>
                    <div class="field">
                        <label for="name-register">Имя</label>
                        <input id="name-register" name="name" type="text" required>
                    </div>
                    <div class="field">
                        <label for="email-register">Email</label>
                        <input id="email-register" name="email" type="email" required>
                    </div>
                    <div class="field">
                        <label for="login-register">Логин</label>
                        <input id="login-register" name="login" type="text" required>
                    </div>
                    <div class="field">
                        <label for="phone-register">Телефон</label>
                        <input id="phone-register" name="phone" type="tel" required>
                    </div>
                    <div class="field">
                        <label for="password-register">Пароль</label>
                        <input id="password-register" name="password" type="password" required>
                    </div>
                    <div class="inline-actions">
                        <button class="btn" type="submit">Зарегистрироваться</button>
                    </div>
                </form>
            </section>
        </main>
    `;
}
