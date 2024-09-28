const routes = {
    login: {
        title: {
            de: "Login",
            en: "Login",
        },
        usernameLabel: {
            de: "Benutzername:",
            en: "Username:",
        },
        passwordLabel: {
            de: "Passwort:",
            en: "Password:",
        },
        loginButton: {
            de: "Einloggen",
            en: "Login",
        },
        invalidCredentials: {
            de: "Benutzername oder Passwort stimmen nicht.",
            en: "Username or password is incorrect.",
        },
        exportSuccess: {
            de: "Benutzer wurde eingeloggt. ",
            en: "User logged in. ",
        }
    },
    register: {
        title: {
            de: "Registrieren",
            en: "Register",
        },
        usernameLabel: {
            de: "Benutzername:",
            en: "Username:",
        },
        emailLabel: {
            de: "E-Mail Adresse:",
            en: "Email Address:",
        },
        passwordLabel: {
            de: "Passwort:",
            en: "Password:",
        },
        confirmPasswordLabel: {
            de: "Passwort wiederholen:",
            en: "Confirm Password:",
        },
        registerButton: {
            de: "Registrieren",
            en: "Register",
        },
        registrationSuccess: {
            de: `Der Benutzer {username} wurde registriert!`,
            en: `User {username} has been registered!`,
        },
        passwordMismatch: {
            de: "Die Passwörter stimmen nicht überein.",
            en: "Passwords do not match.",
        },
        passwordTooShort: {
            de: "Das Passwort muss mindestens 5 Zeichen lang sein.",
            en: "Password must be at least 5 characters long.",
        },
        defaultError: {
            de: "Fehler beim Erstellen des Benutzers.",
            en: "Error creating user.",
        },
    },
};

export default routes;
