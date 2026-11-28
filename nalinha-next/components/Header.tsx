"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { MENU } from "@/lib/menu";

const REGRA = (
  <svg className="rule" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 1H100" fill="none" stroke="#fffae8" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
  </svg>
);

/** Descobre que campo do menu corresponde ao endereço actual. */
function activo(pathname: string): { top: number; sub: string } {
  const p = pathname.replace(/\/+$/, "");
  if (p === "/livros" || p.startsWith("/livros/")) {
    const m = p.match(/^\/livros\/tema\/([a-z-]+)/);
    return { top: 0, sub: m ? "livros-" + m[1] : "" };
  }
  const m = p.match(/^\/secao\/([a-z0-9-]+)/);
  if (m) {
    const chave = m[1];
    const top = MENU.findIndex((i) => chave === i.chave || chave.startsWith(i.chave + "-"));
    return { top, sub: chave };
  }
  return { top: -1, sub: "" };
}

export function Header() {
  const pathname = usePathname() || "/";
  const [aberto, setAberto] = useState(false);
  const [esconde, setEsconde] = useState(false);
  const [subAberto, setSubAberto] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const ult = useRef(0);
  const { top, sub } = activo(pathname);
  const home = pathname === "/";

  // fecha o menu ao mudar de página
  useEffect(() => { setAberto(false); setSubAberto(null); setEsconde(false); }, [pathname]);

  // telemóvel: o cabeçalho esconde-se ao descer a página e volta ao subir
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    ult.current = window.scrollY;
    let tick = false;
    const atualizar = () => {
      tick = false;
      const h = ref.current;
      const y = Math.max(0, window.scrollY);
      const d = y - ult.current;
      if (!mq.matches || !h || y <= h.offsetHeight) { setEsconde(false); ult.current = y; return; }
      if (d > 6) { setSubAberto(null); setEsconde(true); ult.current = y; }
      else if (d < -6) { setEsconde(false); ult.current = y; }
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(atualizar); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape e toque fora fecham o menu
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setAberto(false); setSubAberto(null); } };
    const fora = (e: MouseEvent) => {
      const t = e.target as Element;
      if (!t.closest("nav") && !t.closest(".menu-toggle")) { setAberto(false); setSubAberto(null); }
    };
    document.addEventListener("keydown", esc);
    document.addEventListener("click", fora);
    return () => { document.removeEventListener("keydown", esc); document.removeEventListener("click", fora); };
  }, []);

  return (
    <header ref={ref} className={[aberto ? "open" : "", esconde ? "esconde" : ""].join(" ").trim()}>
      <div className="masthead">
        {REGRA}
        <h1>
          <Link href="/" className="logo-btn" aria-label="Na Linha, voltar ao início"><Logo /></Link>
        </h1>
        {REGRA}
        <button
          type="button"
          className="menu-toggle"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          aria-controls="menu"
          onClick={() => setAberto((a) => !a)}
        >
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <g className="i-open" fill="currentColor" stroke="none"><path d="M2.6 7.70Q12.0 4.90 21.4 5.40L21.4 6.00Q12.0 7.00 2.6 8.30Z" /><path d="M3.2 12.90Q12.0 10.35 20.8 10.80L20.8 11.40Q12.0 12.35 3.2 13.50Z" /><path d="M3.9 18.10Q11.6 15.85 19.4 16.30L19.4 16.90Q11.6 17.75 3.9 18.70Z" /></g>
            <g className="i-close" fill="currentColor" stroke="none"><path d="M5.00 6.02Q10.65 13.48 18.60 18.42L19.00 17.98Q12.00 12.00 5.40 5.58Z" /><path d="M18.18 5.00Q12.06 11.97 5.58 18.60L6.02 19.00Q13.46 13.26 18.62 5.40Z" /></g>
          </svg>
        </button>
      </div>
      <nav id="menu" aria-label="Secções">
        {MENU.map((item, n) => (
          <div key={item.chave} className={"item" + (subAberto === n ? " open" : "")}>
            <Link
              href={item.href}
              className={"top" + (top === n ? " active" : "") + (home && n === 0 ? " act-d" : "")}
              aria-current={top === n ? "page" : undefined}
              aria-haspopup="true"
              aria-expanded={subAberto === n}
              onClick={() => setSubAberto(n)}
            >
              <span className="lbl">{item.t}</span>
            </Link>
            <ul className="sub">
              {item.subs.map((s) => (
                <li key={s.chave}>
                  <Link href={s.href} className={sub === s.chave ? "active" : ""} onClick={() => { setAberto(false); setSubAberto(null); }}>{s.t}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </header>
  );
}
