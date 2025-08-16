import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, HeartHandshake, HandHeart, Info, MapPin, Phone, Mail, Share2, Target, Facebook, Instagram, Copy, CheckCircle2, Coins, ExternalLink, Landmark, HandCoins, Menu, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// --- Helper: Smooth scroll to section
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// --- Color themes: blue-yellow or blue-gray
const THEMES = {
  blueYellow: {
    key: "blueYellow",
    name: "Azul & Amarelo",
    bg: "from-blue-50 to-yellow-50",
    primary: "blue-600",
    primarySoft: "blue-100",
    accent: "yellow-400",
    accentSoft: "yellow-100",
    text: "slate-800",
  },
  blueGray: {
    key: "blueGray",
    name: "Azul & Cinza",
    bg: "from-slate-50 to-blue-50",
    primary: "blue-700",
    primarySoft: "blue-100",
    accent: "slate-400",
    accentSoft: "slate-100",
    text: "slate-800",
  },
};

export default function CampanhaBeneficenteJoinville() {
  // ---- Editable data (preencha livremente!)
  const [dados, setDados] = useState({
    campanha: {
      titulo: "Ajude o [Nome do Sobrinho] na Cirurgia em Joinville",
      subtitulo: "Rizotomia Dorsal Seletiva • 03/10 • Joinville (SC)",
      chamada: "Sua doação ajuda a cobrir custos de viagem, estadia e reabilitação.",
      metaArrecadacao: 25000, // R$ meta
      valorArrecadado: 0, // atualize conforme forem entrando doações
      cidadeEvento: "Joinville, SC",
      dataCirurgia: "03/10/2025",
      imagemCapa: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    },
    crianca: {
      nome: "[Nome do Sobrinho]",
      idade: "22 anos",
      diagnostico: "Paralisia cerebral espástica",
      historia: `Desde pequeno, [Nome do Sobrinho] enfrenta desafios de mobilidade. Com muito carinho e dedicação da família, ele evoluiu com terapias e acompanhamento médico. Agora surgiu a oportunidade da Rizotomia Dorsal Seletiva (RDS) em Joinville, um procedimento que pode reduzir a espasticidade, aliviar dores e melhorar a qualidade de vida.`,
      beneficiosCirurgia: [
        "Redução da espasticidade e dores musculares",
        "Melhora do equilíbrio e da postura",
        "Maior autonomia nas atividades diárias",
        "Facilita o progresso na fisioterapia",
      ],
      foto: "https://images.unsplash.com/photo-1604882737450-ef66190d7c35?q=80&w=1200&auto=format&fit=crop",
    },
    custos: [
      { item: "Passagens (ida e volta)", valor: 3500 },
      { item: "Hospedagem (10 dias)", valor: 4200 },
      { item: "Alimentação e transporte local", valor: 1800 },
      { item: "Medicamentos e insumos", valor: 1200 },
      { item: "Fisioterapia pós-operatória (3 meses)", valor: 8000 },
      { item: "Exames e consultas de retorno", valor: 2500 },
    ],
    eventos: [
      { titulo: "Almoço Beneficente", data: "14/09/2025", local: "Salão da Comunidade – Bairro X", link: "#", descricao: "Prato feito + sobremesa. Retirada no local." },
      { titulo: "Bazar do Bem", data: "21/09/2025", local: "Praça Central", link: "#", descricao: "Roupas e calçados em ótimo estado." },
      { titulo: "Rifa Solidária", data: "Sorteio: 30/09/2025", local: "Online", link: "#", descricao: "Prêmios variados – números via Pix." },
    ],
    doacao: {
      pixChave: "000.000.000-00", // CPF/CNPJ, e-mail ou aleatória
      pixNome: "[Nome do Responsável]",
      banco: "[Banco]",
      agencia: "0000",
      conta: "000000-0",
      linkVakinha: "#",
      contato: { telefone: "(00) 90000-0000", email: "contato@email.com" },
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
    },
  });

  // ---- Theme state
  const [theme, setTheme] = useState(THEMES.blueYellow);
  const toggleTheme = () => setTheme((t) => (t.key === "blueYellow" ? THEMES.blueGray : THEMES.blueYellow));

  // ---- Derived values
  const totalCustos = useMemo(() => dados.custos.reduce((s, c) => s + (Number(c.valor) || 0), 0), [dados.custos]);
  const progresso = useMemo(() => Math.min(100, Math.round((dados.campanha.valorArrecadado / dados.campanha.metaArrecadacao) * 100)), [dados.campanha]);

  const pieData = useMemo(() => dados.custos.map((c) => ({ name: c.item, value: Number(c.valor) || 0 })), [dados.custos]);

  // ---- Copy to clipboard feedback
  const [copied, setCopied] = useState(false);
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {}
  };

  // ---- Mobile menu
  const [open, setOpen] = useState(false);

  // ---- Share
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: dados.campanha.titulo, text: dados.campanha.chamada, url });
      } else {
        await copy(url);
        alert("Link copiado! Compartilhe com seus contatos.");
      }
    } catch (e) {}
  };

  // ---- Countdown until surgery date
  const [dias, setDias] = useState(null);
  useEffect(() => {
    const update = () => {
      const target = new Date(dados.campanha.dataCirurgia.split("/").reverse().join("-"));
      const now = new Date();
      const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      setDias(diff);
    };
    update();
    const t = setInterval(update, 60 * 60 * 1000);
    return () => clearInterval(t);
  }, [dados.campanha.dataCirurgia]);

  // ---- Colors utility
  const c = (cls) => cls
    .replaceAll("$primary", theme.primary)
    .replaceAll("$primarySoft", theme.primarySoft)
    .replaceAll("$accent", theme.accent)
    .replaceAll("$accentSoft", theme.accentSoft)
    .replaceAll("$text", theme.text)
    .replaceAll("$bg", theme.bg);

  return (
    <div className={c("min-h-screen bg-gradient-to-b $bg text-$text")}>      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => scrollToId("topo")} className={c("font-bold text-xl text-$text flex items-center gap-2")}>
            <HandHeart className={c("text-$primary")} />
            <span>Campanha do Bem</span>
          </button>
          <nav className="hidden md:flex items-center gap-6">
            {[
              ["Início", "topo"],
              ["História", "historia"],
              ["A Cirurgia", "cirurgia"],
              ["Custos", "custos"],
              ["Eventos", "eventos"],
              ["Doar", "doar"],
              ["Contato", "contato"],
            ].map(([label, id]) => (
              <button key={id} onClick={() => scrollToId(id)} className={c("text-sm hover:text-$primary transition-colors")}>{label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className={c("px-3 py-1.5 text-sm rounded-full bg-$primarySoft text-$text border border-$primary/30 hover:bg-white transition")}>{theme.name}</button>
            <button onClick={() => setOpen(true)} className="md:hidden p-2"><Menu/></button>
          </div>
        </div>
        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
            <div className={c("absolute right-0 top-0 h-full w-72 bg-white shadow-xl p-6 space-y-4 text-$text")}
                 onClick={(e)=>e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">Menu</div>
                <button onClick={()=>setOpen(false)}><X/></button>
              </div>
              {[
                ["Início", "topo"],
                ["História", "historia"],
                ["A Cirurgia", "cirurgia"],
                ["Custos", "custos"],
                ["Eventos", "eventos"],
                ["Doar", "doar"],
                ["Contato", "contato"],
              ].map(([label, id]) => (
                <button key={id} onClick={() => { scrollToId(id); setOpen(false); }} className={c("block text-left w-full py-2 rounded-lg hover:bg-$primarySoft/60")}>{label}</button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="topo" className="relative">
        <div className="absolute inset-0">
          <img src={dados.campanha.imagemCapa} alt="capa" className="w-full h-[60vh] object-cover opacity-70" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 h-[60vh] flex items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className={c("bg-white/80 backdrop-blur rounded-2xl p-6 md:p-10 shadow-xl border border-$primarySoft/80 max-w-3xl")}
          >
            <div className={c("text-sm font-medium text-$primary mb-2")}>Campanha Solidária</div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{dados.campanha.titulo}</h1>
            <p className="mt-2 text-base md:text-lg opacity-80">{dados.campanha.subtitulo} • {dados.campanha.cidadeEvento}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={() => scrollToId("doar")} className={c("inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-$primary text-white hover:brightness-110 transition shadow-lg")}>
                <HandCoins size={18}/> Doar Agora
              </button>
              <button onClick={() => scrollToId("historia")} className={c("inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-$text border border-$primary/30 hover:bg-$primarySoft transition")}>
                <Info size={18}/> Saber Mais
              </button>
              <button onClick={share} className={c("inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-$text border border-$primary/30 hover:bg-$primarySoft transition")}>
                <Share2 size={18}/> Compartilhar
              </button>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Meta: R$ {dados.campanha.metaArrecadacao.toLocaleString("pt-BR")}</span>
                <span className="opacity-80">Arrecadado: R$ {dados.campanha.valorArrecadado.toLocaleString("pt-BR")}</span>
              </div>
              <div className="mt-2 h-3 w-full bg-white rounded-full border border-slate-200 overflow-hidden">
                <div className={c(`h-full bg-$primary`)} style={{ width: `${progresso}%`}}/>
              </div>
              <div className="mt-1 text-xs opacity-70">Progresso: {progresso}%</div>
            </div>
            {dias !== null && (
              <div className="mt-4 text-sm flex items-center gap-2">
                <Calendar className={c("text-$primary")} size={18}/> Faltam <span className="font-semibold">{dias}</span> dias para a cirurgia (prevista para {dados.campanha.dataCirurgia}).
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* HISTÓRIA */}
      <section id="historia" className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <motion.img initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            src={dados.crianca.foto} alt="foto" className="w-full h-80 object-cover rounded-2xl shadow-md border border-slate-200"/>
          <div>
            <h2 className={c("text-2xl md:text-3xl font-bold text-$text mb-3")}>A história do {dados.crianca.nome}</h2>
            <p className="leading-relaxed text-slate-700">{dados.crianca.historia}</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {dados.crianca.beneficiosCirurgia.map((b, i) => (
                <div key={i} className={c("flex items-start gap-3 p-4 rounded-2xl bg-$accentSoft/60 border border-$accent/30")}> 
                  <CheckCircle2 className={c("text-$primary")} />
                  <span className="text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CIRURGIA */}
      <section id="cirurgia" className={c("py-16 bg-$primarySoft/60 border-y border-$primary/20")}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h2 className={c("text-2xl md:text-3xl font-bold text-$text mb-4")}>
                Sobre a Rizotomia Dorsal Seletiva (RDS)
              </h2>
              <p className="text-slate-700 leading-relaxed">
                A RDS é um procedimento neurológico que busca reduzir a espasticidade em pessoas com paralisia cerebral. Por meio da seleção de raízes nervosas responsáveis pela rigidez muscular, a cirurgia pode melhorar a mobilidade, o conforto e a resposta às terapias de reabilitação. O acompanhamento multidisciplinar antes e depois do procedimento é essencial para alcançar bons resultados.
              </p>
              <ul className="mt-4 list-disc pl-6 text-slate-700 space-y-2">
                <li>Cirurgia prevista: <strong>{dados.campanha.dataCirurgia}</strong> em <strong>{dados.campanha.cidadeEvento}</strong>.</li>
                <li>Objetivo: reduzir espasticidade e melhorar autonomia.</li>
                <li>Plano: fisioterapia intensiva nos primeiros meses após a cirurgia.</li>
              </ul>
            </div>
            <div className={c("md:col-span-1 p-5 rounded-2xl bg-white border border-$primary/20 shadow-sm")}> 
              <div className="flex items-center gap-2 font-semibold mb-3"><Target className={c("text-$primary")} /> Meta da Campanha</div>
              <div className="text-3xl font-extrabold">R$ {dados.campanha.metaArrecadacao.toLocaleString("pt-BR")}</div>
              <div className="text-sm opacity-70">Total estimado dos custos: R$ {totalCustos.toLocaleString("pt-BR")}</div>
              <button onClick={() => scrollToId("doar")} className={c("mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-$primary text-white hover:brightness-110 transition shadow")}>Quero apoiar <ArrowRight size={16}/></button>
              <div className="mt-4 text-xs text-slate-600">Qualquer valor faz diferença. Compartilhe com amigos e familiares! 💙</div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOS */}
      <section id="custos" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className={c("text-2xl md:text-3xl font-bold text-$text")}>
              Prestação de contas: custos previstos
            </h2>
            <div className="text-sm opacity-70">Total: <strong>R$ {totalCustos.toLocaleString("pt-BR")}</strong></div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead className={c("bg-$primarySoft/60 text-left text-slate-700")}> 
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3 w-32">Valor (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.custos.map((custo, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="p-3">{custo.item}</td>
                      <td className="p-3 font-medium text-right">{Number(custo.valor).toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={45} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={c("mt-6 text-xs text-slate-600 bg-$accentSoft/50 border border-$accent/30 rounded-2xl p-4")}> 
            * Atualizaremos esta seção conforme recebimento de doações e comprovantes. Transparência total 💙.
          </div>
        </div>
      </section>

      {/* EVENTOS */}
      <section id="eventos" className={c("py-16 bg-$primarySoft/60 border-y border-$primary/20")}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className={c("text-2xl md:text-3xl font-bold text-$text mb-6")}>
            Eventos beneficentes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {dados.eventos.map((ev, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="text-sm opacity-70 flex items-center gap-2">
                  <Calendar size={16}/> {ev.data}
                </div>
                <div className="font-semibold text-lg mt-2">{ev.titulo}</div>
                <div className="text-sm flex items-center gap-2 mt-1 opacity-80"><MapPin size={16}/> {ev.local}</div>
                <p className="text-sm mt-3 leading-relaxed">{ev.descricao}</p>
                <div className="mt-4 flex items-center gap-2">
                  <a href={ev.link} target="_blank" className={c("inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-$primary text-white hover:brightness-110 transition text-sm")}>Saiba mais <ExternalLink size={14}/></a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DOAÇÃO */}
      <section id="doar" className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-start">
          <div className={c("rounded-2xl p-6 bg-white border border-$primary/20 shadow-sm")}> 
            <div className="flex items-center gap-2 text-lg font-semibold"><HandCoins className={c("text-$primary")} /> Formas de Doar</div>
            <div className="mt-4 space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-sm opacity-70">Chave Pix</div>
                <div className="font-mono text-lg break-all">{dados.doacao.pixChave}</div>
                <div className="text-xs opacity-70">Titular: {dados.doacao.pixNome}</div>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => copy(dados.doacao.pixChave)} className={c("inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-$primary text-white text-sm hover:brightness-110")}>{copied ? "Copiado!" : <>Copiar chave <Copy size={14}/></>}</button>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-sm opacity-70">Depósito/Transferência</div>
                <div className="text-sm">Banco: {dados.doacao.banco}</div>
                <div className="text-sm">Agência: {dados.doacao.agencia} • Conta: {dados.doacao.conta}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-sm opacity-70">Plataforma</div>
                <a href={dados.doacao.linkVakinha} target="_blank" className={c("inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-$primary text-white text-sm hover:brightness-110")}>Acessar campanha online <ExternalLink size={14}/></a>
              </div>
              <div className={c("mt-2 text-xs text-slate-600 bg-$accentSoft/50 border border-$accent/30 rounded-xl p-3")}> 
                Envie o comprovante para agilizar a atualização: {dados.doacao.contato.email}
              </div>
            </div>
          </div>
          <div>
            <div className={c("rounded-2xl p-6 bg-$primarySoft/60 border border-$primary/20")}> 
              <div className="text-lg font-semibold flex items-center gap-2"><Coins className={c("text-$primary")} /> Por que sua doação é importante?</div>
              <p className="mt-2 text-slate-700 leading-relaxed">
                A cirurgia e a reabilitação exigem deslocamento, estadia, alimentação e fisioterapia intensiva. Com sua ajuda, garantimos que {dados.crianca.nome} tenha acesso ao melhor cuidado no momento certo.
              </p>
              <ul className="mt-3 list-disc pl-6 text-slate-700 space-y-1">
                <li>Transparência: custos detalhados e atualizações constantes;</li>
                <li>Impacto real: melhora de mobilidade e autonomia;</li>
                <li>Comunidade: cada compartilhamento também ajuda 💙.</li>
              </ul>
              <div className="mt-4 flex gap-2 flex-wrap">
                <button onClick={share} className={c("inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-$text border border-$primary/30 hover:bg-$primarySoft text-sm")}><Share2 size={14}/> Compartilhar</button>
                <button onClick={() => scrollToId("custos")} className={c("inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-$text border border-$primary/30 hover:bg-$primarySoft text-sm")}><Info size={14}/> Ver custos</button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl p-6 bg-white border border-slate-200">
              <div className="text-lg font-semibold flex items-center gap-2"><Landmark className={c("text-$primary")} /> Transparência</div>
              <p className="mt-2 text-slate-700 text-sm">Publicaremos recibos e comprovantes após cada etapa. Obrigado pela confiança!</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / DÚVIDAS */}
      <section className={c("py-16 bg-$primarySoft/60 border-y border-$primary/20")}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className={c("text-2xl md:text-3xl font-bold text-$text mb-6")}>Dúvidas frequentes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-5">
              <div className="font-semibold">O que é Rizotomia Dorsal Seletiva?</div>
              <p className="text-sm mt-2 text-slate-700">É uma cirurgia neurológica que visa reduzir a espasticidade por meio da seleção de raízes dorsais. Ajuda a melhorar conforto, postura e participação nas terapias.</p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-5">
              <div className="font-semibold">Como saberei para onde foi o dinheiro?</div>
              <p className="text-sm mt-2 text-slate-700">Mantemos a tabela de custos atualizada e divulgamos comprovantes periodicamente nas redes e nesta página.</p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-5">
              <div className="font-semibold">Posso ajudar de outras formas?</div>
              <p className="text-sm mt-2 text-slate-700">Sim! Divulgue, participe dos eventos, doe prêmios para rifas e indique serviços de hospedagem/viagem com desconto.</p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-5">
              <div className="font-semibold">Emitirão recibo da doação?</div>
              <p className="text-sm mt-2 text-slate-700">Podemos enviar um recibo simples por e-mail mediante solicitação.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className={c("text-2xl md:text-3xl font-bold text-$text")}>
              Contato e redes sociais
            </h2>
            <p className="mt-2 text-slate-700">Fale com a família para dúvidas, comprovantes e parcerias.</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone className={c("text-$primary")} size={18}/> {dados.doacao.contato.telefone}</div>
              <div className="flex items-center gap-2"><Mail className={c("text-$primary")} size={18}/> {dados.doacao.contato.email}</div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <a className={c("inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-$primary text-white text-sm hover:brightness-110")} href={dados.doacao.instagram} target="_blank"><Instagram size={16}/> Instagram</a>
              <a className={c("inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-$text border border-$primary/30 hover:bg-$primarySoft text-sm")} href={dados.doacao.facebook} target="_blank"><Facebook size={16}/> Facebook</a>
            </div>
          </div>
          <div className={c("rounded-2xl p-6 bg-$accentSoft/50 border border-$accent/30")}> 
            <div className="font-semibold">Como atualizar os dados do site?</div>
            <p className="text-sm mt-2 text-slate-700">No código, procure pelo objeto <code>dados</code> (lá no topo do componente) e edite os campos: títulos, datas, custos, eventos, chaves Pix, etc. Tudo aparece automaticamente na página.</p>
            <ul className="list-disc pl-6 text-sm text-slate-700 mt-2 space-y-1">
              <li>Troque as imagens (<code>imagemCapa</code> e <code>foto</code>) por links seus.</li>
              <li>Atualize <code>valorArrecadado</code> para mostrar o progresso da meta.</li>
              <li>Altere o tema com o botão <em>{theme.name}</em> no topo (Azul&Amarelo ↔ Azul&Cinza).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="pt-10 pb-24 md:pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-sm opacity-70">
            Feito com 💙 para apoiar o {dados.crianca.nome}. Obrigado por compartilhar e contribuir.
          </div>
          <div className="mt-2 text-center text-xs opacity-60">Cirurgia prevista: {dados.campanha.dataCirurgia} • {dados.campanha.cidadeEvento}</div>
        </div>
      </footer>

      {/* Sticky donate bar (mobile) */}
      <div className={c("fixed bottom-3 left-3 right-3 md:hidden bg-$primary text-white rounded-2xl shadow-xl flex items-center justify-between px-4 py-3")}> 
        <div className="text-sm">
          Apoie a campanha
          <div className="text-xs opacity-90">Meta: R$ {dados.campanha.metaArrecadacao.toLocaleString("pt-BR")} • {progresso}%</div>
        </div>
        <button onClick={() => scrollToId("doar")} className="px-3 py-2 bg-white text-slate-900 rounded-xl text-sm font-medium">Doar</button>
      </div>
    </div>
  );
}
