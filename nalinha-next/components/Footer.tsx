import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer>
      <div className="foot">
        <div className="foot-brand">
          <strong aria-label="Na Linha"><Logo /></strong>
          <span>Livros, leitura e literatura em Cascais.</span>
        </div>
        <div className="foot-links" role="navigation" aria-label="Rodapé">
          <div className="foot-texts">
            <button type="button">Contactos</button>
            <button type="button">Parceiros</button>
            <button type="button">Mailing List</button>
          </div>
          <div className="redes" role="group" aria-label="Redes">
            <button type="button" aria-label="YouTube"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M5.4 4.6h13.2A4.4 4.4 0 0 1 23 9v6a4.4 4.4 0 0 1-4.4 4.4H5.4A4.4 4.4 0 0 1 1 15V9a4.4 4.4 0 0 1 4.4-4.4z M9.8 8.8v6.4l5.6-3.2z" /></svg></button>
            <button type="button" aria-label="Facebook"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M12 1a11 11 0 1 0 0 22a11 11 0 1 0 0-22z M13.3 22.9v-8.2h2.7l.5-3.2h-3.2V9.6c0-.9.4-1.7 1.8-1.7h1.5V5.1c-.3 0-1.2-.2-2.2-.2-2.5 0-4.1 1.5-4.1 4.2v2.4H7.5v3.2h2.8v8.2a11 11 0 0 0 3 .1z" /></svg></button>
            <button type="button" aria-label="Instagram"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M7.2 2.2h9.6a5 5 0 0 1 5 5v9.6a5 5 0 0 1-5 5H7.2a5 5 0 0 1-5-5V7.2a5 5 0 0 1 5-5z M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 1 0 0-9.6z M12 8.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 1 0 0-6.2z M17.4 5.5a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 1 0 0-2.2z" /></svg></button>
          </div>
        </div>
        <small>© 2027 Na Linha. Todos os direitos reservados.</small>
      </div>
    </footer>
  );
}
