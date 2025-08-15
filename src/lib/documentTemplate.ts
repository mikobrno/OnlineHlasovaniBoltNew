// Jednoduchý renderer dokumentových šablon s podporou proměnných a bloku otázek
// Odstraněn import mock dat – definujeme minimalistické typy potřebné pro šablonu
interface SimpleQuestion { id: string; text: string }
interface SimpleVote { id: string; title: string; questions: SimpleQuestion[] }
interface SimpleBuilding { id: string; name: string }
interface SimpleMember { id: string; name: string }

export interface DocumentContext {
  building: SimpleBuilding;
  vote: SimpleVote;
  member?: SimpleMember;
  date?: string; // např. nové Date().toLocaleDateString()
}

// Bezpečné získání vnořené hodnoty z objektu podle cesty 'a.b.c'
function getByPath(obj: unknown, path: string): unknown {
  if (obj === null || obj === undefined) return '';
  const parts = path.split('.');
  let acc: unknown = obj;
  for (const key of parts) {
    if (typeof acc === 'object' && acc !== null && key in (acc as Record<string, unknown>)) {
      acc = (acc as Record<string, unknown>)[key];
    } else {
      return '';
    }
  }
  return acc;
}

// Nahradí proměnné {{path}} v textu
function replaceVariables(text: string, context: Record<string, unknown>): string {
  return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_m, p1) => {
    const key = String(p1).trim();
    const val = getByPath(context, key);
    return val === undefined || val === null ? '' : String(val);
  });
}

// Zpracuje opakující se blok {{#questions}}...{{/questions}}
function renderQuestionsBlock(template: string, vote: SimpleVote, buildingContext: Record<string, unknown>): string {
  const blockRegex = /\{\{#questions\}\}([\s\S]*?)\{\{\/questions\}\}/g;
  return template.replace(blockRegex, (_match, block: string) => {
    return vote.questions
      .map((q: SimpleQuestion, idx: number) => {
        const localCtx = {
          ...buildingContext,
          index: idx + 1,
          question: q,
        };
        // Nejdřív nahradit proměnné v bloku
        return replaceVariables(block, localCtx);
      })
      .join('\n');
  });
}

export function renderDocumentTemplate(rawTemplate: string, ctx: DocumentContext): string {
  const baseCtx: Record<string, unknown> = {
    building: ctx.building,
    vote: ctx.vote,
    member: ctx.member,
    date: ctx.date || new Date().toLocaleDateString(),
  };

  // 1) otázky
  let html = renderQuestionsBlock(rawTemplate, ctx.vote, baseCtx);
  // 2) zbytek proměnných
  html = replaceVariables(html, baseCtx);
  return html;
}

export const defaultBallotTemplate = `
<style>
  body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; color:#111827; }
  h1 { font-size: 20px; margin: 0 0 8px; }
  h2 { font-size: 16px; margin: 16px 0 8px; }
  .muted { color:#6B7280; font-size:12px; }
  .section { margin: 16px 0; }
  .line { border-bottom: 1px solid #D1D5DB; height: 18px; }
  .q { margin: 10px 0; }
  .checkboxes span { display:inline-block; margin-right: 16px; }
  .small { font-size: 12px; }
  .footer { margin-top:24px; }
</style>
<div>
  <h1>Hlasovací listina – {{vote.title}}</h1>
  <div class="muted">SVJ: {{building.name}} • Datum: {{date}}</div>

  <div class="section">
    <div class="small muted">Jméno vlastníka/Jednotka</div>
    <div class="line"></div>
  </div>

  <div class="section">
    <h2>Otázky</h2>
    {{#questions}}
      <div class="q">
        <div><strong>{{index}}.</strong> {{question.text}}</div>
        <div class="checkboxes small">
          <span>[ ] Ano</span>
          <span>[ ] Ne</span>
          <span>[ ] Zdržel(a) jsem se</span>
        </div>
      </div>
    {{/questions}}
  </div>

  <div class="footer">
    <div class="small muted">Podpis</div>
    <div class="line" style="width: 60%;"></div>
  </div>
</div>`;
