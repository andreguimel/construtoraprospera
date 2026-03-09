

# Modernizar a Página Inicial — Plano

## Visão Geral
Tornar a landing page mais moderna com: hero full-screen com subtítulo e CTA mais impactante, seção de estatísticas/contadores, cards de imóveis com badges e hover mais elaborado, scroll animations, e layout mais respirado com tipografia refinada.

## Mudanças Planejadas

### 1. Header — Glassmorphism + CTA button
- Header translúcido com `backdrop-blur-lg` e transição de fundo ao scroll (transparente → sólido)
- Adicionar botão "Fale Conosco" dourado no header desktop
- Smooth scroll effect com `useEffect` + `useState` para detectar scroll

### 2. Hero Section — Full-screen + animações
- Hero `min-h-[90vh]` com centralização vertical
- Subtítulo descritivo abaixo do título
- Barra de busca com design mais arredondado e espaçoso
- Badges/tags animados ("Mais de 500 imóveis disponíveis")
- Scroll indicator animado (seta/chevron pulsando) no bottom

### 3. Nova Seção: Estatísticas / Contadores
- Seção entre hero e imóveis com números de destaque (ex: "+500 Imóveis", "+1.200 Clientes", "+15 Anos")
- Ícones e layout horizontal em 3-4 colunas
- Fundo com gradiente sutil ou accent color

### 4. Featured Properties — Cards modernizados
- Badge de "Destaque" ou "Novo" sobre a imagem
- Ícones para quartos/banheiros/vagas além de localização e área
- Botão "Ver Detalhes" no card
- Animação de entrada com `fade-in-up` staggered via Intersection Observer ou CSS `animation-delay`

### 5. About Section — Layout mais dinâmico
- Adicionar contadores/stats inline
- Imagem com bordas arredondadas e leve rotação decorativa (pseudo-element dourado atrás)

### 6. Services Section — Cards com ícone colorido e hover accent
- Hover com borda dourada e scale sutil
- Ícones em círculos com gradiente dourado

### 7. Features Section — Melhorar hierarquia visual
- Números/índices decorativos nos cards (01, 02, 03)

### 8. Footer — Redes sociais + layout refinado
- Adicionar ícones de redes sociais (Instagram, Facebook, WhatsApp)
- Separadores visuais mais elegantes

### 9. Animações de Scroll (CSS-only)
- Adicionar keyframes `fade-in-up` com `animation-delay` staggered
- Usar Intersection Observer hook simples para trigger de animações ao scroll
- Aplicar em todas as seções

### 10. CSS Updates
- Novas keyframes em `tailwind.config.ts`: `fade-in-up`, `fade-in-left`, `fade-in-right`, `pulse-slow`
- Utilitários de animação correspondentes

## Arquivos Modificados
- `src/components/Header.tsx` — scroll effect + CTA
- `src/components/HeroSection.tsx` — full-screen + subtitle + scroll indicator
- `src/components/FeaturedProperties.tsx` — badges + more details + hover
- `src/components/AboutSection.tsx` — decorative element + stats
- `src/components/ServicesSection.tsx` — hover accent + gradient icons
- `src/components/FeaturesSection.tsx` — numbered items
- `src/components/Footer.tsx` — social icons
- `src/pages/Index.tsx` — nova seção StatsSection
- `src/components/StatsSection.tsx` — novo componente
- `src/hooks/useScrollAnimation.ts` — novo hook para Intersection Observer
- `tailwind.config.ts` — novos keyframes/animations
- `src/index.css` — classes utilitárias novas

