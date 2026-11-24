// Wraps Danish UI text in tx() for client components and injects `const { tx } = useLocale()`.
// Usage: node scripts/i18n/wrap-tx.cjs <files...>
const ts = require('typescript')
const fs = require('fs')
const path = require('path')

const files = process.argv.slice(2)
const ATTRS = new Set(['alt', 'title', 'text', 'eyebrow', 'accent', 'label', 'placeholder', 'aria-label', 'description', 'subtitle', 'heading', 'cta', 'caption', 'badge', 'hint', 'note', 'sub', 'tagline'])
const looksDanish = (s) =>
  /\p{L}/u.test(s) &&
  (/\s/.test(s.trim()) || /[æøåÆØÅ]/.test(s) || /^[A-ZÆØÅ]/.test(s.trim())) &&
  !/^(https?:|\/|#|[\w-]+\.(png|jpe?g|webp|svg|mp4))/.test(s.trim())

function jsxNormalize(raw) {
  const lines = raw.split(/\r?\n/)
  const out = []
  lines.forEach((line, i) => {
    let l = line
    if (i > 0) l = l.replace(/^\s+/, '')
    if (i < lines.length - 1) l = l.replace(/\s+$/, '')
    if (l.length) out.push(l)
  })
  return out.join(' ')
}

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const edits = []
  const usedIn = new Set()
  const orphans = []

  const isComponentFn = (n) =>
    (ts.isFunctionDeclaration(n) && n.name && /^[A-Z]|^use[A-Z]/.test(n.name.text)) ||
    ((ts.isArrowFunction(n) || ts.isFunctionExpression(n)) &&
      ts.isVariableDeclaration(n.parent) &&
      ts.isIdentifier(n.parent.name) &&
      /^[A-Z]|^use[A-Z]/.test(n.parent.name.text))

  const enclosingComponent = (node) => {
    let n = node.parent
    let found = null
    while (n) {
      if (isComponentFn(n)) found = n
      n = n.parent
    }
    return found
  }
  const mark = (node) => {
    const c = enclosingComponent(node)
    if (!c) {
      orphans.push(sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1)
      return false
    }
    usedIn.add(c)
    return true
  }
  const attrContext = (node) => {
    let n = node.parent
    while (n) {
      if (ts.isJsxAttribute(n)) return ATTRS.has(n.name.getText(sf)) ? 'ok' : 'skip'
      if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) return 'child'
      if (ts.isSourceFile(n)) return 'none'
      n = n.parent
    }
    return 'none'
  }
  const insideJsxExpression = (node) => {
    let n = node.parent
    while (n && !ts.isSourceFile(n)) {
      if (ts.isJsxExpression(n)) return true
      n = n.parent
    }
    return false
  }
  const isTxCall = (n) => ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'tx'

  function visit(node) {
    if (ts.isJsxText(node)) {
      const norm = jsxNormalize(node.getFullText(sf))
      if (/\p{L}/u.test(norm) && mark(node)) {
        const lead = /^\s/.test(norm) ? '{" "}' : ''
        const trail = /\s$/.test(norm) ? '{" "}' : ''
        edits.push([node.getStart(sf), node.getEnd(), `${lead}{tx(${JSON.stringify(norm.trim())})}${trail}`])
      }
      return
    }
    if (ts.isJsxAttribute(node) && ATTRS.has(node.name.getText(sf)) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const v = node.initializer.text
      if (/\p{L}/u.test(v) && mark(node)) edits.push([node.initializer.getStart(sf), node.initializer.getEnd(), `{tx(${JSON.stringify(v)})}`])
      return
    }
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && insideJsxExpression(node) && looksDanish(node.text)) {
      const ctx = attrContext(node)
      const p = node.parent
      const bad =
        ts.isCallExpression(p) ||
        ts.isBinaryExpression(p) ||
        ts.isCaseClause(p) ||
        ts.isElementAccessExpression(p) ||
        (ts.isPropertyAssignment(p) && p.name === node) ||
        ts.isLiteralTypeNode(p)
      if ((ctx === 'ok' || ctx === 'child') && !bad && mark(node)) edits.push([node.getStart(sf), node.getEnd(), `tx(${node.getText(sf)})`])
      return
    }
    if (ts.isJsxExpression(node) && node.expression) {
      const e = node.expression
      const parentIsChild = ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent)
      const parentAttr = ts.isJsxAttribute(node.parent) && ATTRS.has(node.parent.name.getText(sf))
      if ((parentIsChild || parentAttr) && (ts.isIdentifier(e) || ts.isPropertyAccessExpression(e) || ts.isElementAccessExpression(e)) && !isTxCall(e) && mark(node)) {
        edits.push([e.getStart(sf), e.getEnd(), `tx(${e.getText(sf)})`])
        return
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  if (!edits.length) {
    if (orphans.length) console.log(`${file}: ORPHAN text at lines ${orphans.join(',')}`)
    continue
  }

  for (const fn of usedIn) {
    const body = fn.body
    if (ts.isBlock(body)) {
      edits.push([body.getStart(sf) + 1, body.getStart(sf) + 1, '\n  const { tx } = useLocale();'])
    } else {
      edits.push([body.getStart(sf), body.getStart(sf), '{\n  const { tx } = useLocale();\n  return '])
      edits.push([body.getEnd(), body.getEnd(), ';\n}'])
    }
  }
  edits.sort((a, b) => b[0] - a[0] || b[1] - a[1])
  let out = src
  for (const [s, e, text] of edits) out = out.slice(0, s) + text + out.slice(e)

  if (!/from ['"]@\/components\/locale-provider['"]/.test(out)) {
    const m = out.match(/^(['"]use client['"];?\s*\n)/)
    const imp = 'import { useLocale } from "@/components/locale-provider";\n'
    out = m ? out.replace(m[1], m[1] + imp) : imp + out
  }
  fs.writeFileSync(file, out)
  console.log(`${path.relative(process.cwd(), file)}: ${edits.length} edits${orphans.length ? ` | ORPHAN lines ${orphans.join(',')}` : ''}`)
}
