from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Inches, Pt

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "presentation" / "GraphPath_Presentation.pptx"
OUT.parent.mkdir(parents=True, exist_ok=True)
IMG = ROOT / "screenshots" / "light"

# Palette
BG = RGBColor(0xF7, 0xF8, 0xF6)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
DARK = RGBColor(0x17, 0x20, 0x1B)
MUTED = RGBColor(0x5D, 0x6B, 0x63)
ACCENT = RGBColor(0x1F, 0x6F, 0x5C)
ACCENT_LIGHT = RGBColor(0xE4, 0xF1, 0xEC)
LINE = RGBColor(0xD7, 0xDF, 0xDB)
AMBER = RGBColor(0xD8, 0x9A, 0x2B)

FONT = "Arial"
SLIDE_W = 13.333
SLIDE_H = 7.5

prs = Presentation()
prs.slide_width = Inches(SLIDE_W)
prs.slide_height = Inches(SLIDE_H)
BLANK = prs.slide_layouts[6]


def add_text(
    slide,
    text,
    left,
    top,
    width,
    height,
    *,
    size=18,
    bold=False,
    color=DARK,
    align=PP_ALIGN.LEFT,
    valign=MSO_ANCHOR.TOP,
    margin=0,
    line_spacing=1.0,
    italic=False,
):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(margin)
    tf.margin_right = Inches(margin)
    tf.margin_top = Inches(margin)
    tf.margin_bottom = Inches(margin)
    tf.vertical_anchor = valign
    p = tf.paragraphs[0]
    p.alignment = align
    p.line_spacing = line_spacing
    run = p.add_run()
    run.text = text
    run.font.name = FONT
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return box


def add_paragraphs(
    slide,
    items,
    left,
    top,
    width,
    height,
    *,
    size=16,
    color=DARK,
    bullet_color=ACCENT,
    line_spacing=1.12,
    space_after=8,
):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    tf.margin_left = 0
    tf.margin_right = 0
    tf.margin_top = 0
    tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.TOP
    for index, item in enumerate(items):
        p = tf.paragraphs[0] if index == 0 else tf.add_paragraph()
        p.line_spacing = line_spacing
        p.space_after = Pt(space_after)
        p.level = 0
        marker = p.add_run()
        marker.text = "•  "
        marker.font.name = FONT
        marker.font.size = Pt(size)
        marker.font.color.rgb = bullet_color
        marker.font.bold = True
        run = p.add_run()
        run.text = item
        run.font.name = FONT
        run.font.size = Pt(size)
        run.font.color.rgb = color
    return box


def add_rect(slide, left, top, width, height, fill, line=None, radius=False):
    shape_type = MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE
    shape = slide.shapes.add_shape(
        shape_type, Inches(left), Inches(top), Inches(width), Inches(height)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line
        shape.line.width = Pt(0.75)
    if radius:
        shape.adjustments[0] = 0.08
    return shape


def add_picture_fit(slide, path, left, top, max_w, max_h, border=True):
    from PIL import Image

    with Image.open(path) as im:
        w, h = im.size
    aspect = w / h
    if max_w / max_h > aspect:
        height = max_h
        width = height * aspect
    else:
        width = max_w
        height = width / aspect
    x = left + (max_w - width) / 2
    y = top + (max_h - height) / 2
    pic = slide.shapes.add_picture(str(path), Inches(x), Inches(y), Inches(width), Inches(height))
    if border:
        pic.line.color.rgb = LINE
        pic.line.width = Pt(0.75)
    return pic


def add_kicker(slide, text):
    add_text(slide, text, 0.78, 0.42, 8.0, 0.3, size=10, bold=True, color=ACCENT)


def add_title(slide, text, top=0.85, size=30, width=11.8):
    add_text(slide, text, 0.78, top, width, 1.0, size=size, bold=True, color=DARK)


def add_footer(slide, number):
    line = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0.78), Inches(7.06), Inches(11.78), Inches(0.012)
    )
    line.fill.solid()
    line.fill.fore_color.rgb = LINE
    line.line.fill.background()
    add_text(slide, "GraphPath · STEM-проєкт", 0.78, 7.13, 5.0, 0.22, size=9, color=MUTED)
    add_text(slide, f"{number:02d} / 10", 11.55, 7.13, 1.0, 0.22, size=9, color=MUTED, align=PP_ALIGN.RIGHT)


def add_notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


def add_number_badge(slide, number, left, top, size=0.46):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.OVAL, Inches(left), Inches(top), Inches(size), Inches(size)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = ACCENT
    shape.line.fill.background()
    tf = shape.text_frame
    tf.margin_left = 0
    tf.margin_right = 0
    tf.margin_top = 0
    tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run = p.add_run()
    run.text = str(number)
    run.font.name = FONT
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = WHITE
    return shape


# ---------------------------------------------------------------------------
# 1. Title
# ---------------------------------------------------------------------------
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, SLIDE_W, SLIDE_H, BG)
add_rect(s, 0.78, 0.9, 0.05, 4.1, ACCENT)
add_text(s, "STEM-ПРОЄКТ · 2026", 1.05, 0.82, 6.0, 0.3, size=10, bold=True, color=ACCENT)
add_text(s, "GraphPath", 1.0, 1.25, 6.3, 0.9, size=46, bold=True, color=DARK)
add_text(
    s,
    "Інтерактивна візуалізація алгоритмів\nпошуку шляхів на графах",
    1.03,
    2.18,
    6.3,
    1.0,
    size=21,
    color=MUTED,
    line_spacing=1.12,
)
add_text(s, "BFS  ·  DFS  ·  Dijkstra", 1.05, 3.38, 6.0, 0.35, size=13, bold=True, color=ACCENT)
add_text(s, "Василець Олександр Миколайович", 1.05, 4.58, 6.2, 0.3, size=14, bold=True, color=DARK)
add_text(s, "Група ІПЗ-33, підгрупа 8", 1.05, 4.94, 6.2, 0.3, size=12, color=MUTED)
add_text(s, "Керівник: лектор Ірина ЮРЧУК", 1.05, 5.28, 6.2, 0.3, size=12, color=MUTED)
add_picture_fit(s, IMG / "hero.png", 7.55, 1.15, 5.0, 3.9, border=True)
add_text(s, "GraphPath · головна сторінка", 7.55, 5.15, 5.0, 0.3, size=9, color=MUTED, align=PP_ALIGN.CENTER)
add_text(s, "Київ · 2026", 10.75, 6.55, 1.8, 0.3, size=11, color=MUTED, align=PP_ALIGN.RIGHT)
add_footer(s, 1)
add_notes(
    s,
    "Добрий день. Мене звати Олександр Василець, група ІПЗ-33, підгрупа 8. "
    "Тема мого STEM-проєкту — GraphPath, веб-застосунок для інтерактивної візуалізації "
    "алгоритмів пошуку шляхів на графах. Далі — коротко про проблему, продукт і результат.",
)

# ---------------------------------------------------------------------------
# 2. Problem
# ---------------------------------------------------------------------------
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, SLIDE_W, SLIDE_H, BG)
add_kicker(s, "01 · ПРОБЛЕМА")
add_title(s, "Алгоритми вивчають абстрактно", 0.88, 30)
add_text(
    s,
    "Псевдокод і формули не показують, як саме змінюється стан під час пошуку.",
    0.8,
    1.78,
    11.5,
    0.5,
    size=16,
    color=MUTED,
)

cards = [
    ("01", "Немає динаміки", "Черга, стек і масив попередників залишаються текстом, а не процесом."),
    ("02", "Важко порівняти", "BFS, DFS і Dijkstra оптимізують різні критерії та дають різні маршрути."),
    ("03", "Багато зайвого", "Готові сервіси перевантажені функціями, які відволікають від навчання."),
]
card_w = 3.62
for index, (num, title, body) in enumerate(cards):
    left = 0.78 + index * (card_w + 0.25)
    add_rect(s, left, 2.5, card_w, 2.35, WHITE, LINE, radius=True)
    add_text(s, num, left + 0.28, 2.72, 0.6, 0.3, size=11, bold=True, color=ACCENT)
    add_text(s, title, left + 0.28, 3.1, card_w - 0.56, 0.4, size=17, bold=True, color=DARK)
    add_text(s, body, left + 0.28, 3.62, card_w - 0.56, 0.95, size=12.5, color=MUTED, line_spacing=1.15)

add_rect(s, 0.78, 5.45, 11.78, 0.75, ACCENT_LIGHT)
add_text(
    s,
    "Мета: один екран, де граф, псевдокод і стан алгоритму змінюються синхронно.",
    1.0,
    5.62,
    11.3,
    0.4,
    size=16,
    bold=True,
    color=ACCENT,
)
add_footer(s, 2)
add_notes(
    s,
    "Проблема в тому, що ці алгоритми часто вивчають за підручником. Студент бачить формулу, "
    "але не бачить, як змінюється черга або стек і чому Dijkstra може обрати інший маршрут. "
    "Мета — зібрати пояснення, граф і покрокове виконання на одному екрані.",
)

# ---------------------------------------------------------------------------
# 3. Product
# ---------------------------------------------------------------------------
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, SLIDE_W, SLIDE_H, BG)
add_kicker(s, "02 · ПРОДУКТ")
add_title(s, "GraphPath: три алгоритми на одному екрані", 0.88, 28)
add_paragraphs(
    s,
    [
        "Три демонстраційні набори та власний граф.",
        "Покрокове виконання: play, pause, step, reset.",
        "Синхронний псевдокод, черга або стек і таблиця.",
        "BFS/DFS — кількість ребер; Dijkstra — сума ваг.",
    ],
    0.8,
    1.95,
    6.1,
    2.6,
    size=16.5,
    space_after=10,
)
stats = [
    ("3", "алгоритми", "BFS, DFS, Dijkstra"),
    ("4", "набори", "місто, мережа, навчальний, власний"),
    ("1", "екран", "граф + код + стан"),
]
for index, (value, label, note) in enumerate(stats):
    left = 0.78 + index * 3.95
    add_rect(s, left, 4.55, 3.7, 1.5, WHITE, LINE, radius=True)
    add_text(s, value, left + 0.25, 4.72, 0.8, 0.6, size=30, bold=True, color=ACCENT)
    add_text(s, label, left + 1.0, 4.8, 2.3, 0.3, size=14, bold=True, color=DARK)
    add_text(s, note, left + 1.0, 5.18, 2.4, 0.6, size=10.5, color=MUTED, line_spacing=1.1)

add_footer(s, 3)
add_notes(
    s,
    "GraphPath — це SPA, який поєднує граф, псевдокод і стан алгоритму. "
    "Є три готові набори і власний граф. Можна запустити автоматичне відтворення, "
    "поставити паузу або рухатися по кроках. Для BFS і DFS показується кількість ребер, "
    "для Dijkstra — сума ваг.",
)

# ---------------------------------------------------------------------------
# 4. User scenario
# ---------------------------------------------------------------------------
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, SLIDE_W, SLIDE_H, BG)
add_kicker(s, "03 · СЦЕНАРІЙ")
add_title(s, "Від графа до висновку — чотири кроки", 0.88, 28)
steps = [
    ("1", "Обрати граф", "Готовий набір або власні вершини й ребра."),
    ("2", "Задати межі", "Старт і фініш через список або клік/Shift+клік."),
    ("3", "Запустити", "BFS, DFS або Dijkstra; play, pause або крок."),
    ("4", "Порівняти", "Шлях, вартість, таблиця та журнал кроків."),
]
step_w = 2.72
for index, (num, title, body) in enumerate(steps):
    left = 0.78 + index * (step_w + 0.3)
    add_rect(s, left, 2.0, step_w, 2.8, WHITE, LINE, radius=True)
    add_number_badge(s, num, left + 0.24, 2.22, 0.46)
    add_text(s, title, left + 0.24, 2.9, step_w - 0.48, 0.4, size=15, bold=True, color=DARK)
    add_text(s, body, left + 0.24, 3.38, step_w - 0.48, 1.0, size=11.5, color=MUTED, line_spacing=1.15)
    if index < 3:
        arrow = s.shapes.add_shape(
            MSO_SHAPE.RIGHT_ARROW,
            Inches(left + step_w + 0.05),
            Inches(3.25),
            Inches(0.22),
            Inches(0.26),
        )
        arrow.fill.solid()
        arrow.fill.fore_color.rgb = ACCENT
        arrow.line.fill.background()

add_rect(s, 0.78, 5.3, 11.78, 0.75, ACCENT_LIGHT)
add_text(
    s,
    "Якщо результат не влаштовує — змінити граф або алгоритм і повторити.",
    1.0,
    5.48,
    11.3,
    0.4,
    size=14,
    bold=True,
    color=ACCENT,
)
add_footer(s, 4)
add_notes(
    s,
    "Сценарій простий: обрати граф, задати старт і фініш, запустити алгоритм і порівняти результат. "
    "Якщо маршрут не влаштовує, можна змінити граф або алгоритм і повторити. "
    "Це цикл навчального експерименту, а не одноразовий перегляд.",
)

# ---------------------------------------------------------------------------
# 5. Stack
# ---------------------------------------------------------------------------
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, SLIDE_W, SLIDE_H, BG)
add_kicker(s, "04 · СТЕК")
add_title(s, "Мінімум залежностей, повний контроль", 0.88, 28)
stack = [
    ("React 18", "Компоненти, хуки,\nкерування станом"),
    ("Vite 5", "Швидкий dev-сервер\nі production-збірка"),
    ("Sass", "Теми, змінні,\nадаптивність"),
    ("SVG + Pointer Events", "Граф без важких\nбібліотек"),
]
card_w = 2.86
for index, (title, body) in enumerate(stack):
    left = 0.78 + index * (card_w + 0.2)
    add_rect(s, left, 1.95, card_w, 2.0, WHITE, LINE, radius=True)
    add_text(s, title, left + 0.24, 2.16, card_w - 0.48, 0.55, size=15, bold=True, color=DARK, line_spacing=1.0)
    add_text(s, body, left + 0.24, 2.78, card_w - 0.48, 0.9, size=11.5, color=MUTED, line_spacing=1.15)

add_rect(s, 0.78, 4.4, 11.78, 1.35, ACCENT_LIGHT)
add_text(
    s,
    "App → GraphWorkspace → GraphCanvas / StatePanel / DistanceTable",
    1.02,
    4.62,
    11.2,
    0.35,
    size=14.5,
    bold=True,
    color=ACCENT,
)
add_text(
    s,
    "Алгоритми — в окремому модулі algorithms.js · без бекенду · дані створюються в браузері",
    1.02,
    5.05,
    11.2,
    0.3,
    size=11,
    color=MUTED,
)
add_text(
    s,
    "Збірка: 53 модулі · 188,92 кБ JS (gzip 61,67 кБ) · 28,89 кБ CSS (gzip 5,83 кБ)",
    0.8,
    6.05,
    11.8,
    0.3,
    size=11,
    color=MUTED,
)
add_footer(s, 5)
add_notes(
    s,
    "Стек мінімальний: React 18, Vite 5, Sass і SVG. Я свідомо не брав важкі графові бібліотеки, "
    "бо для семи вершин достатньо власного рендерера. Це дало повний контроль над анімацією "
    "і невеликий бандл: близько 189 кілобайт JavaScript і 29 кілобайт CSS.",
)

# ---------------------------------------------------------------------------
# 6. Editor
# ---------------------------------------------------------------------------
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, SLIDE_W, SLIDE_H, BG)
add_kicker(s, "05 · РЕДАКТОР")
add_title(s, "Граф можна змінити, а не лише переглянути", 0.88, 27)
add_paragraphs(
    s,
    [
        "Три набори: місто, мережа, навчальний.",
        "Перетягування вершин і додавання нових.",
        "З’єднання ребер із вагою 1–99.",
        "Випадковий граф і скидання.",
        "Клік — старт, Shift+клік — фініш.",
    ],
    0.8,
    1.9,
    5.2,
    3.3,
    size=14.5,
    space_after=7,
)
add_picture_fit(s, IMG / "workspace-slide-editor.png", 6.25, 1.35, 6.55, 5.1)
add_footer(s, 6)
add_notes(
    s,
    "Граф — не статична картинка. Вершини можна перетягувати, додавати нові, з’єднувати ребрами "
    "з вагою від 1 до 99, генерувати випадковий граф або скидати його. Старт задається кліком, "
    "фініш — Shift+кліком. Будь-яка зміна скидає попередній прогін.",
)

# ---------------------------------------------------------------------------
# 7. Algorithms
# ---------------------------------------------------------------------------
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, SLIDE_W, SLIDE_H, BG)
add_kicker(s, "06 · АЛГОРИТМИ")
add_title(s, "Три різні стратегії — одна модель кроку", 0.88, 27)
rows = [
    ("BFS", "Черга", "Найменше ребер у незваженому графі"),
    ("DFS", "Стек", "Обхід углиб; шлях не обов’язково найкоротший"),
    ("Dijkstra", "Пріоритетна черга", "Мінімальна сума додатних ваг"),
]
y = 1.95
for name, structure, guarantee in rows:
    add_rect(s, 0.8, y, 5.6, 1.05, WHITE, LINE, radius=True)
    add_text(s, name, 1.02, y + 0.12, 1.35, 0.3, size=14, bold=True, color=ACCENT)
    add_text(s, structure, 2.3, y + 0.12, 1.9, 0.3, size=11.5, bold=True, color=DARK)
    add_text(s, guarantee, 1.02, y + 0.5, 5.0, 0.4, size=10.5, color=MUTED)
    y += 1.2
add_text(
    s,
    "Кожен крок — знімок: вершина, ребро, черга, відстані, попередники, рядок псевдокоду.",
    0.8,
    5.75,
    5.7,
    0.7,
    size=11.5,
    color=MUTED,
    line_spacing=1.15,
)
add_picture_fit(s, IMG / "workspace-slide-running.png", 6.55, 1.3, 6.25, 5.2)
add_footer(s, 7)
add_notes(
    s,
    "Усі три алгоритми повертають не просто фінальний шлях, а масив знімків стану. "
    "Тому граф, псевдокод, черга або стек і таблиця оновлюються синхронно. "
    "BFS використовує чергу, DFS — стек, Dijkstra — пріоритетну чергу. "
    "BFS і DFS не враховують ваги, Dijkstra враховує лише додатні.",
)

# ---------------------------------------------------------------------------
# 8. Result
# ---------------------------------------------------------------------------
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, SLIDE_W, SLIDE_H, BG)
add_kicker(s, "07 · РЕЗУЛЬТАТ")
add_title(s, "Результат пояснює, а не просто показує", 0.88, 27)
add_text(s, "Місто · Dijkstra", 0.8, 1.85, 5.4, 0.3, size=11, bold=True, color=ACCENT)
add_text(s, "Вокзал → Стадіон → Парк → Лікарня", 0.8, 2.18, 5.5, 0.5, size=17, bold=True, color=DARK)
add_text(s, "Сума ваг: 7", 0.8, 2.8, 5.4, 0.5, size=28, bold=True, color=ACCENT)
add_text(
    s,
    "BFS і DFS для цього ж графа дають 3 ребра, але Dijkstra обирає інший маршрут "
    "з мінімальною сумою ваг.",
    0.8,
    3.55,
    5.3,
    1.0,
    size=12.5,
    color=MUTED,
    line_spacing=1.15,
)
add_text(
    s,
    "Таблиця фіксує статус, відстань і попередника кожної вершини — маршрут можна "
    "перевірити вручну.",
    0.8,
    4.85,
    5.3,
    0.9,
    size=11.5,
    color=MUTED,
    line_spacing=1.15,
)
add_picture_fit(s, IMG / "workspace-slide-result.png", 6.4, 1.3, 6.4, 5.2)
add_footer(s, 8)
add_notes(
    s,
    "На демонстрації: місто, Dijkstra, старт Вокзал, фініш Лікарня. "
    "Результат — Вокзал → Стадіон → Парк → Лікарня, сума ваг 7. "
    "BFS і DFS для цього ж графа дають три ребра, але інший маршрут. "
    "Це добре показує різницю між критеріями.",
)

# ---------------------------------------------------------------------------
# 9. Quality
# ---------------------------------------------------------------------------
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, SLIDE_W, SLIDE_H, BG)
add_kicker(s, "08 · ЯКІСТЬ")
add_title(s, "Адаптивність, теми й доступність", 0.88, 28)
add_paragraphs(
    s,
    [
        "Одна колонка на мобільних, без втрати функцій.",
        "Світла й темна теми; вибір зберігається.",
        "Клавіатура: Tab, Enter, Space, Shift+Enter.",
        "Skip-link, aria-pressed, role=status, видимий фокус.",
        "9/9 комбінацій алгоритмів перевірено вручну.",
    ],
    0.8,
    1.9,
    6.0,
    3.6,
    size=14.5,
    space_after=8,
)
add_picture_fit(s, IMG / "workspace-mobile-slide.png", 8.25, 1.45, 3.0, 5.2)
add_rect(s, 0.8, 5.75, 6.1, 0.75, ACCENT_LIGHT)
add_text(
    s,
    "390 px · 2 теми · 9 перевірок · без бекенду",
    1.0,
    5.93,
    5.8,
    0.3,
    size=12,
    bold=True,
    color=ACCENT,
)
add_footer(s, 9)
add_notes(
    s,
    "Я перевірив адаптивність на ширині 390 пікселів, світлу й темну теми, клавіатурну навігацію "
    "та дев’ять комбінацій наборів і алгоритмів. На мобільному зберігається той самий функціонал, "
    "але для редагування великого графа зручніше використовувати планшет або десктоп.",
)

# ---------------------------------------------------------------------------
# 10. Conclusion
# ---------------------------------------------------------------------------
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, SLIDE_W, SLIDE_H, BG)
add_kicker(s, "09 · ВИСНОВКИ")
add_title(s, "Що вдалося і що далі", 0.88, 30)
conclusions = [
    ("01", "Повний цикл", "Аналіз вимог, User Flow, State Diagram, реалізація, тестування й звіт."),
    ("02", "Робочий продукт", "SPA з трьома алгоритмами, редактором графа, темами й адаптивністю."),
    ("03", "Наступні кроки", "A*, Bellman–Ford, імпорт/експорт JSON, збереження стану, автотести."),
]
for index, (num, title, body) in enumerate(conclusions):
    left = 0.78 + index * 4.0
    add_rect(s, left, 2.0, 3.7, 2.25, WHITE, LINE, radius=True)
    add_text(s, num, left + 0.25, 2.2, 0.5, 0.3, size=11, bold=True, color=ACCENT)
    add_text(s, title, left + 0.25, 2.55, 3.2, 0.4, size=16, bold=True, color=DARK)
    add_text(s, body, left + 0.25, 3.05, 3.2, 0.95, size=11.5, color=MUTED, line_spacing=1.15)

add_text(s, "Дякую за увагу", 0.8, 5.25, 7.0, 0.7, size=30, bold=True, color=ACCENT)
add_text(s, "Готовий відповісти на запитання.", 0.8, 5.95, 7.0, 0.4, size=15, color=MUTED)
add_text(s, "GraphPath · 2026", 10.2, 6.35, 2.3, 0.3, size=11, color=MUTED, align=PP_ALIGN.RIGHT)
add_footer(s, 10)
add_notes(
    s,
    "Підсумок: мета досягнута — є робочий SPA, який показує BFS, DFS і Dijkstra покроково. "
    "Перевірено дев’ять комбінацій, адаптивність і теми. Обмеження — неорієнтовані графи, "
    "додатні ваги, немає збереження графа. Далі — A*, Bellman–Ford, імпорт/експорт JSON і автотести. "
    "Дякую за увагу, готовий відповісти на запитання.",
)

prs.core_properties.title = "GraphPath — інтерактивна візуалізація алгоритмів на графах"
prs.core_properties.author = "Василець Олександр Миколайович"
prs.core_properties.subject = "Індивідуальний STEM-проєкт"
prs.core_properties.keywords = "GraphPath, BFS, DFS, Dijkstra, React, Vite, Sass, STEM"

prs.save(OUT)
print(OUT)
