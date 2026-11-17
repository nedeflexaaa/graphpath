from pathlib import Path
from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor
from docx.enum.style import WD_STYLE_TYPE

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "report" / "GraphPath_Report.docx"
OUT.parent.mkdir(parents=True, exist_ok=True)

IMG = ROOT / "screenshots" / "light"
DIAG = ROOT / "docs" / "diagrams" / "png"

FONT = "Times New Roman"
BODY_SIZE = Pt(12)
CAPTION_SIZE = Pt(12)
TABLE_SIZE = Pt(10.5)
ACCENT = RGBColor(0x1F, 0x6F, 0x5C)
DARK = RGBColor(0x17, 0x20, 0x1B)
GRAY = RGBColor(0x55, 0x63, 0x5B)

GIT_URL = "https://github.com/nedeflexaaa/graphpath"
SITE_URL = "https://nedeflexaaa.github.io/graphpath/"

doc = Document()

# ---------------------------------------------------------------------------
# Page and base styles
# ---------------------------------------------------------------------------
section = doc.sections[0]
section.page_width = Cm(21)
section.page_height = Cm(29.7)
section.left_margin = Cm(3.0)
section.right_margin = Cm(1.5)
section.top_margin = Cm(2.0)
section.bottom_margin = Cm(2.0)
section.header_distance = Cm(1.0)
section.footer_distance = Cm(1.0)
section.different_first_page_header_footer = True

styles = doc.styles
normal = styles["Normal"]
normal.font.name = FONT
normal.font.size = BODY_SIZE
normal.font.color.rgb = DARK
normal.paragraph_format.line_spacing = 1.5
normal.paragraph_format.space_after = Pt(0)
normal.paragraph_format.first_line_indent = Cm(1.25)
normal.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
normal.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
normal.element.rPr.rFonts.set(qn("w:cs"), FONT)

for style_name in ("Heading 1", "Heading 2", "Heading 3"):
    style = styles[style_name]
    style.font.name = FONT
    style.font.color.rgb = DARK
    style.font.bold = True
    style.font.size = Pt(14 if style_name == "Heading 1" else 13)
    style.paragraph_format.first_line_indent = Cm(0)
    style.paragraph_format.space_before = Pt(0 if style_name == "Heading 1" else 12)
    style.paragraph_format.space_after = Pt(10 if style_name == "Heading 1" else 6)
    style.paragraph_format.keep_with_next = True
    style.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    style.element.rPr.rFonts.set(qn("w:cs"), FONT)

# Caption style
caption_style = styles.add_style("Figure Caption", WD_STYLE_TYPE.PARAGRAPH)
caption_style.base_style = styles["Normal"]
caption_style.font.name = FONT
caption_style.font.size = CAPTION_SIZE
caption_style.font.italic = False
caption_style.font.color.rgb = GRAY
caption_style.paragraph_format.first_line_indent = Cm(0)
caption_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
caption_style.paragraph_format.space_before = Pt(4)
caption_style.paragraph_format.space_after = Pt(10)
caption_style.paragraph_format.line_spacing = 1.0

# Table caption style
table_caption_style = styles.add_style("Table Caption", WD_STYLE_TYPE.PARAGRAPH)
table_caption_style.base_style = styles["Normal"]
table_caption_style.font.name = FONT
table_caption_style.font.size = CAPTION_SIZE
table_caption_style.font.color.rgb = GRAY
table_caption_style.paragraph_format.first_line_indent = Cm(0)
table_caption_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
table_caption_style.paragraph_format.space_before = Pt(8)
table_caption_style.paragraph_format.space_after = Pt(4)
table_caption_style.paragraph_format.keep_with_next = True
table_caption_style.paragraph_format.line_spacing = 1.0

# Source style
source_style = styles.add_style("Source Item", WD_STYLE_TYPE.PARAGRAPH)
source_style.base_style = styles["Normal"]
source_style.font.name = FONT
source_style.font.size = BODY_SIZE
source_style.paragraph_format.first_line_indent = Cm(-1.25)
source_style.paragraph_format.left_indent = Cm(1.25)
source_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
source_style.paragraph_format.space_after = Pt(4)
source_style.paragraph_format.line_spacing = 1.5


def set_run_font(run, size=None, bold=None, italic=None, color=None):
    run.font.name = FONT
    run._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    run._element.rPr.rFonts.set(qn("w:cs"), FONT)
    if size is not None:
        run.font.size = size
    if bold is not None:
        run.font.bold = bold
    if italic is not None:
        run.font.italic = italic
    if color is not None:
        run.font.color.rgb = color


def para(text="", *, first_line=True, align=WD_ALIGN_PARAGRAPH.JUSTIFY, bold=False,
         italic=False, size=None, space_before=0, space_after=0, keep_with_next=False):
    p = doc.add_paragraph()
    p.paragraph_format.first_line_indent = Cm(1.25) if first_line else Cm(0)
    p.paragraph_format.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.keep_with_next = keep_with_next
    if text:
        run = p.add_run(text)
        set_run_font(run, size=size, bold=bold, italic=italic)
    return p


def bullet(text, level=0):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.left_indent = Cm(1.25 + level * 0.6)
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(text)
    set_run_font(run, size=BODY_SIZE)
    return p


def h1(text):
    p = doc.add_paragraph(style="Heading 1")
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(12)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text.upper())
    set_run_font(run, size=Pt(14), bold=True, color=DARK)
    return p


def h2(text):
    p = doc.add_paragraph(style="Heading 2")
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    set_run_font(run, size=Pt(13), bold=True, color=DARK)
    return p


def figure(path, width_cm, caption):
    p = doc.add_paragraph()
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run()
    run.add_picture(str(path), width=Cm(width_cm))
    cap = doc.add_paragraph(style="Figure Caption")
    cap.add_run(caption)
    return cap


def table_caption(text):
    p = doc.add_paragraph(style="Table Caption")
    p.add_run(text)
    return p


def shade_cell(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)


def set_cell_margins(cell, top=70, bottom=70, left=90, right=90):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for m, v in (("top", top), ("bottom", bottom), ("left", left), ("right", right)):
        node = tc_mar.find(qn(f"w:{m}"))
        if node is None:
            node = OxmlElement(f"w:{m}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(v))
        node.set(qn("w:type"), "dxa")


def repeat_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def cant_split(row):
    tr_pr = row._tr.get_or_add_trPr()
    cant = OxmlElement("w:cantSplit")
    cant.set(qn("w:val"), "true")
    tr_pr.append(cant)


def add_table(headers, rows, widths=None, font_size=TABLE_SIZE):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    hdr = table.rows[0]
    repeat_header(hdr)
    for index, header in enumerate(headers):
        cell = hdr.cells[index]
        if widths:
            cell.width = Cm(widths[index])
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        shade_cell(cell, "E4F1EC")
        set_cell_margins(cell)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.first_line_indent = Cm(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.0
        run = p.add_run(header)
        set_run_font(run, size=font_size, bold=True, color=DARK)

    for row_data in rows:
        row = table.add_row()
        cant_split(row)
        for index, value in enumerate(row_data):
            cell = row.cells[index]
            if widths:
                cell.width = Cm(widths[index])
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            set_cell_margins(cell)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT if index == 0 else WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.first_line_indent = Cm(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.0
            run = p.add_run(str(value))
            set_run_font(run, size=font_size)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return table


def add_page_number_footer():
    section.footer.is_linked_to_previous = False
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p.paragraph_format.first_line_indent = Cm(0)

    def add_field_run(kind=None, text=None):
        run = p.add_run()
        set_run_font(run, size=Pt(12))
        if kind:
            node = OxmlElement("w:fldChar")
            node.set(qn("w:fldCharType"), kind)
            run._r.append(node)
        elif text is not None:
            node = OxmlElement("w:instrText")
            node.set(qn("xml:space"), "preserve")
            node.text = text
            run._r.append(node)
        return run

    add_field_run("begin")
    add_field_run(text="PAGE")
    add_field_run("separate")
    result_run = p.add_run("1")
    set_run_font(result_run, size=Pt(12))
    add_field_run("end")

    section.first_page_footer.is_linked_to_previous = False
    first = section.first_page_footer.paragraphs[0]
    first.text = ""
    first.alignment = WD_ALIGN_PARAGRAPH.RIGHT


add_page_number_footer()

# ---------------------------------------------------------------------------
# Title page
# ---------------------------------------------------------------------------
title_lines = [
    ("МІНІСТЕРСТВО ОСВІТИ І НАУКИ УКРАЇНИ", 12, True, 0),
    ("КИЇВСЬКИЙ НАЦІОНАЛЬНИЙ УНІВЕРСИТЕТ ІМЕНІ ТАРАСА ШЕВЧЕНКА", 12, True, 0),
    ("ФАКУЛЬТЕТ ІНФОРМАЦІЙНИХ ТЕХНОЛОГІЙ", 12, False, 0),
    ("КАФЕДРА ПРОГРАМНИХ СИСТЕМ І ТЕХНОЛОГІЙ", 12, False, 0),
]
for text, size, bold, before in title_lines:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    set_run_font(run, size=Pt(size), bold=bold, color=DARK)

for _ in range(4):
    doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.first_line_indent = Cm(0)
p.paragraph_format.space_after = Pt(4)
run = p.add_run("STEM-проєкт")
set_run_font(run, size=Pt(16), bold=True)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.first_line_indent = Cm(0)
p.paragraph_format.space_after = Pt(18)
run = p.add_run("з дисципліни «Розробка фронтенду програмних систем»")
set_run_font(run, size=Pt(12))

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.first_line_indent = Cm(0)
p.paragraph_format.space_after = Pt(6)
run = p.add_run("«ВЕБ-ЗАСТОСУНОК ДЛЯ ІНТЕРАКТИВНОЇ ВІЗУАЛІЗАЦІЇ")
set_run_font(run, size=Pt(15), bold=True)
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.first_line_indent = Cm(0)
p.paragraph_format.space_after = Pt(6)
run = p.add_run("АЛГОРИТМІВ ПОШУКУ ШЛЯХІВ НА ГРАФАХ»")
set_run_font(run, size=Pt(15), bold=True)

for _ in range(4):
    doc.add_paragraph()

author_lines = [
    ("Виконав:", False),
    ("студент групи ІПЗ-33, підгрупа 8", False),
    ("Василець Олександр Миколайович", True),
    ("", False),
    ("Перевірила:", False),
    ("лектор Ірина ЮРЧУК", False),
]
for text, bold in author_lines:
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Cm(9.0)
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    set_run_font(run, size=Pt(12), bold=bold)

for _ in range(5):
    doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.first_line_indent = Cm(0)
run = p.add_run("Київ – 2026")
set_run_font(run, size=Pt(12))

doc.add_page_break()

# ---------------------------------------------------------------------------
# Section 1
# ---------------------------------------------------------------------------
h1("РОЗДІЛ 1. ПРОЄКТУВАННЯ ПРОГРАМНОГО ПРОДУКТУ")
h2("1.1. Аналіз предметної області та формулювання вимог")

para(
    "Граф є однією з базових моделей подання зв’язків між об’єктами. У навігації, "
    "логістиці, комп’ютерних мережах і плануванні маршрутів задача пошуку шляху "
    "зводиться до знаходження послідовності вершин, що з’єднані ребрами та "
    "задовольняють заданий критерій: мінімальну кількість переходів або мінімальну "
    "сумарну вагу. Для розв’язання цієї задачі використовують пошук у ширину (BFS), "
    "пошук у глибину (DFS) та алгоритм Дейкстри [1–4]."
)
para(
    "Під час вивчення цих алгоритмів студенти часто бачать лише формули та "
    "фрагменти псевдокоду. Через це залишається незрозумілим, як саме змінюється "
    "черга або стек, коли вершина стає відвіданою, як формується масив попередників "
    "і чому Dijkstra може обрати дорожчий за кількістю ребер, але дешевший за "
    "сумарною вагою маршрут. Статичні схеми не дають змоги зупинити процес, "
    "повернутися на крок назад і порівняти проміжні стани."
)
para(
    "Метою STEM-проєкту є створення веб-застосунку GraphPath, який поєднує "
    "інтерактивне полотно графа, покрокове виконання трьох алгоритмів, "
    "синхронізований псевдокод, чергу або стек, журнал кроків і таблицю станів "
    "вершин. Користувач має побачити не лише готовий маршрут, а й логіку його "
    "отримання."
)
para(
    "Цільова аудиторія застосунку — студенти, які вивчають дискретну математику, "
    "теорію графів або алгоритми, викладачі, яким потрібен демонстраційний "
    "матеріал для заняття, а також початківці, які готуються до технічних "
    "співбесід. Застосунок не потребує реєстрації та працює повністю у браузері."
)
para("Функціональні вимоги до системи узагальнено в таблиці 1.1.")

table_caption("Таблиця 1.1 – Функціональні вимоги до застосунку")
add_table(
    ["ID", "Вимога", "Реалізація"],
    [
        ("F1", "Вибір демонстраційного графа", "Набори «Місто», «Мережа», «Навчальний»"),
        ("F2", "Створення власного графа", "Додавання вершин, з’єднання ребер, зміна ваги, генерація випадкового графа"),
        ("F3", "Вибір старту та фінішу", "Списки вершин, клік по вершині, Shift+клік"),
        ("F4", "Три алгоритми", "BFS, DFS, Dijkstra з різними структурами даних"),
        ("F5", "Керування виконанням", "Запуск, пауза, крок, скидання, швидкість 1–4×"),
        ("F6", "Візуалізація станів", "Кольори вершин і ребер, легенда, підсвічування псевдокоду"),
        ("F7", "Пояснення результату", "Шлях, кількість ребер або сума ваг, таблиця відстаней і попередників"),
        ("F8", "Адаптивність і теми", "Одна колонка на мобільних, світла й темна теми, збереження вибору"),
    ],
    widths=[1.2, 5.6, 9.2],
)

para("Нефункціональні вимоги подано в таблиці 1.2.")

table_caption("Таблиця 1.2 – Нефункціональні вимоги")
add_table(
    ["ID", "Вимога", "Критерій перевірки"],
    [
        ("N1", "Продуктивність", "Миттєва реакція на крок; графи до 7–10 вершин; відсутність важких бібліотек"),
        ("N2", "Кросбраузерність", "Chromium-браузери (Edge, Chrome), сучасний JavaScript без експериментальних API"),
        ("N3", "Доступність", "Семантичні елементи, клавіатурна навігація, контраст, skip-link, ARIA-підписи"),
        ("N4", "Безпека", "Немає бекенду та збору персональних даних; уся робота з даними локальна"),
        ("N5", "Зручність", "Один екран для демонстрації, зрозумілі підписи, підказки та візуальна легенда"),
    ],
    widths=[1.2, 4.6, 10.2],
)

h2("1.2. Проєктування потоку користувача (User Flow)")
para(
    "Для формалізації основного сценарію розроблено діаграму потоку користувача "
    "(рис. 1.1). Вона охоплює відкриття сторінки, вибір або створення графа, "
    "налаштування стартової та цільової вершин, вибір алгоритму, керування "
    "виконанням і перегляд результату."
)
figure(DIAG / "user-flow.png", 14.0, "Рис. 1.1 – User Flow основного сценарію роботи з GraphPath")

para(
    "Потік починається з головної сторінки, де користувач бачить коротке пояснення "
    "призначення застосунку та кнопку переходу до візуалізатора. Далі він обирає "
    "готовий набір даних або створює власний граф. Стартова й цільова вершини "
    "задаються через випадаючі списки або безпосередньо на полотні: звичайний клік "
    "призначає старт, Shift+клік — фініш."
)
para(
    "Після вибору алгоритму користувач запускає автоматичне відтворення або "
    "рухається по кроках. На кожному кроці оновлюються граф, псевдокод, "
    "черга/стек, лічильники та журнал. Якщо ціль знайдено, з’являється банер із "
    "маршрутом і вартістю; якщо ні — користувач змінює граф, старт/фініш або "
    "алгоритм і повторює спробу. Такий цикл відповідає навчальному сценарію "
    "«висунув гіпотезу — перевірив — порівняв»."
)

h2("1.3. Проєктування діаграми станів (State Diagram)")
para(
    "Візуалізатор має скінченний набір станів, які визначають доступні дії та "
    "вигляд інтерфейсу (рис. 1.2). Стан Idle відповідає готовності до запуску, "
    "Running — активному відтворенню, Paused — зупинці після паузи або кроку, "
    "Finished — завершеному проходу з результатом."
)
figure(DIAG / "state-diagram.png", 15.5, "Рис. 1.2 – State Diagram візуалізатора")

para("Переходи між станами та умови їх виникнення наведено в таблиці 1.3.")

table_caption("Таблиця 1.3 – Стани візуалізатора та переходи")
add_table(
    ["Стан", "Умова входу", "Доступні дії"],
    [
        ("Idle", "Сторінку відкрито або виконано скидання", "Змінити граф, старт/фініш, алгоритм; запустити"),
        ("Running", "Натиснуто «Запустити» або «Продовжити»", "Пауза, зміна швидкості, скидання"),
        ("Paused", "Натиснуто «Пауза» або виконано один крок", "Продовжити, крок, скидання"),
        ("Finished", "Досягнуто цільової вершини або обхід завершено", "Переглянути результат, запустити ще раз, змінити параметри"),
    ],
    widths=[2.2, 7.1, 6.7],
)

para(
    "Окреме правило спрощує поведінку: будь-яка зміна графа, стартової або цільової "
    "вершини чи алгоритму скидає візуалізатор у стан Idle. Це запобігає ситуації, "
    "коли на екрані залишаються кроки від попереднього запуску, але граф уже інший."
)

h2("1.4. Каркас інтерфейсу та структура екранів")
para(
    "Головна сторінка побудована як односторінковий застосунок (SPA) з лінійною "
    "послідовністю смислових блоків. На десктопі (рис. 1.3) використано "
    "дванадцятиколонкову сітку: заголовок і навігація, hero-блок із поясненням і "
    "реальним фото, робочий простір із трьома колонками, таблиця станів, секції "
    "алгоритмів, прикладів застосування, принципу роботи та опису проєкту."
)
figure(DIAG / "wireframe-desktop.png", 15.5, "Рис. 1.3 – Wireframe головної сторінки для десктопа")

para(
    "Робочий простір складається з трьох функціональних зон. Ліва колонка містить "
    "параметри запуску та редактор графа, центральна — SVG-полотно з вершинами й "
    "ребрами, права — стан алгоритму, псевдокод, пріоритетну чергу та журнал "
    "кроків. Під робочим простором розташована таблиця відстаней і попередників. "
    "Така композиція дає змогу бачити причину й наслідок зміни на одному екрані."
)
para(
    "На мобільних пристроях (рис. 1.4) блоки перебудовуються в одну колонку. "
    "Порядок збережено за сенсом: спочатку пояснення, потім параметри, граф, стан "
    "алгоритму й таблиця. Для редагування великого графа на вузькому екрані "
    "передбачено масштабування полотна та підказки; для повноцінної роботи з "
    "редактором доцільніше використовувати планшет або десктоп."
)
figure(DIAG / "wireframe-mobile.png", 6.4, "Рис. 1.4 – Wireframe мобільної версії")

h2("1.5. Архітектура клієнтської частини та модель даних")
para(
    "Застосунок реалізовано як клієнтський SPA без серверної частини. Такий вибір "
    "зумовлений навчальним характером проєкту: усі дані створюються в браузері, "
    "немає потреби в авторизації, базі даних або мережевих запитах. Стан зберігається "
    "в React-компонентах, а тема оформлення — у localStorage [10]."
)
para(
    "Модель графа має вигляд Graph = {nodes, edges, start, end}, де вершина — це "
    "{id, label, x, y}, а ребро — {id, source, target, weight}. Ребра "
    "неорієнтовані: під час побудови списку суміжності вони додаються в обидва "
    "боки. Вага ребра — ціле число від 1 до 99; для BFS і DFS вона не впливає на "
    "результат, а для Dijkstra використовується як вартість переходу."
)
para("Основні модулі застосунку та їхні обов’язки наведено в таблиці 1.4.")

table_caption("Таблиця 1.4 – Основні модулі застосунку")
add_table(
    ["Модуль", "Відповідальність"],
    [
        ("App.jsx", "Композиція сторінки, керування темою, збереження вибору в localStorage"),
        ("Header.jsx", "Навігація, мобільне меню, перемикач теми"),
        ("Hero.jsx", "Вступний блок із поясненням призначення застосунку"),
        ("GraphWorkspace.jsx", "Стан графа, вибір старту/фінішу, запуск і керування кроками"),
        ("ControlPanel.jsx", "Набори даних, параметри, кнопки запуску та редактор"),
        ("GraphCanvas.jsx", "SVG-полотно, переміщення вершин, вибір, режим з’єднання"),
        ("StatePanel.jsx", "Метрики, псевдокод, черга/стек і журнал кроків"),
        ("DistanceTable.jsx", "Таблиця відстаней, статусів і попередників"),
        ("algorithms.js", "BFS, DFS, Dijkstra та формування масиву знімків стану"),
        ("graphs.js", "Демонстраційні набори даних і клонування графа"),
    ],
    widths=[4.0, 12.0],
)

doc.add_page_break()

# ---------------------------------------------------------------------------
# Section 2
# ---------------------------------------------------------------------------
h1("РОЗДІЛ 2. ПРОГРАМНА РЕАЛІЗАЦІЯ")
h2("2.1. Технології, інструменти та обґрунтування вибору")
para(
    "Для реалізації обрано React 18 — бібліотеку з декларативною моделлю "
    "інтерфейсу та зручним керуванням станом [5]. Vite 5 використано як збирач і "
    "сервер розробки: він забезпечує швидкий старт, гаряче оновлення та "
    "оптимізований production-build [6]. Стилізацію виконано на Sass із "
    "частковими файлами та CSS-змінними [7]."
)
para(
    "Графічне полотно побудовано на SVG [8]. Це дає змогу працювати з вершинами як "
    "із DOM-елементами, задавати `tabIndex`, обробляти клавіатурні події та "
    "масштабувати зображення без втрати якості. Для перетягування вершин "
    "використано Pointer Events [9], які об’єднують мишу, палець і стилус в одному "
    "наборі подій. Тему збережено через localStorage [10], а доступність "
    "перевірено з орієнтацією на WCAG 2.2 [11]."
)
para(
    "Свідомо відмовлено від важких графових і UI-бібліотек: для семи вершин і "
    "навчальної візуалізації достатньо власного SVG-рендерера. Це зменшує розмір "
    "бандла, спрощує контроль над анімацією та робить код зрозумілим для "
    "подальшого розвитку. Фотографії для контекстних секцій взято з Unsplash і "
    "використано згідно з ліцензією [12]."
)
para("Технологічний стек узагальнено в таблиці 2.1.")

table_caption("Таблиця 2.1 – Технології та інструменти")
add_table(
    ["Технологія", "Версія", "Призначення"],
    [
        ("React", "18.3", "Компонентний інтерфейс, хуки, керування станом"),
        ("Vite", "5.4", "Збирання, dev-сервер, оптимізація production-збірки"),
        ("Sass", "1.83", "Модульні стилі, змінні, міксини, адаптивність"),
        ("JavaScript", "ES2022", "Логіка алгоритмів і взаємодії"),
        ("SVG", "—", "Полотно графа, вершини, ребра, стрілки та підписи"),
        ("Pointer Events", "—", "Перетягування вершин мишею, пальцем або стилусом"),
        ("localStorage", "—", "Збереження обраної теми"),
        ("Git", "2.53", "Контроль версій і публікація коду"),
        ("Edge / Chrome", "—", "Ручне тестування та перевірка сумісності"),
    ],
    widths=[4.0, 2.2, 9.8],
)

h2("2.2. Структура проєкту")
para(
    "Проєкт має модульну структуру: окремі компоненти відповідають за робочий "
    "простір, полотно, панель стану та таблицю; алгоритми винесено в "
    "lib/algorithms.js, а демонстраційні дані — у data/graphs.js. Стилі "
    "розділено на часткові Sass-файли за призначенням."
)
para(
    "Спрощена структура каталогів: StemProject/ — корінь; src/components/ — "
    "React-компоненти; src/lib/ — алгоритми; src/data/ — набори графів; "
    "src/styles/ — Sass-частини; src/assets/images/ — реальні фотографії; "
    "public/ — favicon; scripts/ — допоміжні скрипти для скриншотів; "
    "docs/ — діаграми, звіт і презентація."
)
para(
    "Компонент GraphWorkspace є оркестратором: він зберігає поточний граф, "
    "стартову та цільову вершини, алгоритм, швидкість, масив кроків і індекс "
    "поточного кроку. Дочірні компоненти отримують дані через props і повертають "
    "події через колбеки. Завдяки цьому логіка алгоритмів не змішана з "
    "відображенням, а кожен компонент можна тестувати окремо."
)

h2("2.3. Реалізація алгоритмів BFS, DFS і Dijkstra")
para(
    "Список суміжності будується функцією buildAdjacency: для кожного ребра "
    "створюються два записи — в обидва напрямки. Це відповідає неорієнтованому "
    "графу. BFS використовує чергу: стартова вершина додається першою, далі "
    "обробляються сусіди в порядку додавання. DFS використовує стек; щоб порядок "
    "обходу був передбачуваним, сусіди додаються у зворотному порядку. Dijkstra "
    "підтримує пріоритетну чергу, реалізовану як відсортований масив пар "
    "{id, distance}; для навчальних графів із 7 вершин цього достатньо, хоча "
    "концептуальна складність алгоритму — O((V + E) log V)."
)
para(
    "Кожен алгоритм не просто повертає фінальний шлях, а формує масив знімків "
    "стану. Знімок містить тип кроку (init, visit, discover, relax, done), "
    "поточну вершину, активне ребро, множину відвіданих вершин, чергу або стек, "
    "масиви distances і previous, знайдений шлях, номер рядка псевдокоду, "
    "повідомлення та статистику. Саме цей масив дає змогу відтворювати процес "
    "крок за кроком без повторного запуску алгоритму."
)
para(
    "Після досягнення цілі шлях відновлюється за масивом previous: від цільової "
    "вершини до стартової, після чого послідовність розвертається. Якщо ціль "
    "недосяжна, алгоритм завершується кроком done без шляху та повідомленням про "
    "відсутність маршруту. Для BFS і DFS вартість у таблиці показує кількість "
    "ребер, для Dijkstra — суму ваг."
)
para("Порівняння алгоритмів наведено в таблиці 2.2.")

table_caption("Таблиця 2.2 – Порівняння реалізованих алгоритмів")
add_table(
    ["Алгоритм", "Структура", "Складність", "Ваги", "Що гарантує"],
    [
        ("BFS", "Черга", "O(V + E)", "Не враховує", "Найменшу кількість ребер у незваженому графі"),
        ("DFS", "Стек", "O(V + E)", "Не враховує", "Обхід усіх досяжних вершин; шлях не обов’язково найкоротший"),
        ("Dijkstra", "Пріоритетна черга", "O((V + E) log V)", "Додатні", "Мінімальну суму ваг від старту до цілі"),
    ],
    widths=[2.4, 3.5, 3.6, 2.4, 4.1],
)

h2("2.4. Реалізація інтерфейсу та взаємодії")
para(
    "Полотно графа має viewBox 700×460 і масштабується під доступну ширину. "
    "Вершини рендеряться як групи SVG з колом, підписом і необов’язковим кільцем "
    "старту або фінішу. Кожна вершина доступна з клавіатури: Tab переміщує фокус, "
    "Enter або Space призначає старт, Shift+Enter — фініш. Під час перетягування "
    "використовується setPointerCapture, а координати переводяться з екранних у "
    "координати SVG через getScreenCTM().inverse()."
)
para(
    "Колірне кодування є частиною навчальної логіки: старт — синє кільце, фініш — "
    "зелене, поточна вершина — бурштинова, вершини в черзі — блакитні, відвідані — "
    "сірі, знайдений шлях — зелений. Ребра підсвічуються під час перегляду сусіда "
    "або релаксації. Легенда під полотном пояснює кожен стан, тому користувачу не "
    "потрібно запам’ятовувати кольори."
)
para(
    "Інтерфейс має дві теми. Початково тема відповідає системному налаштуванню "
    "prefers-color-scheme, а вибір користувача зберігається в localStorage. "
    "Перемикач у шапці змінює атрибут data-theme на кореневому елементі, а Sass "
    "використовує CSS-змінні для кольорів, фонів і тіней. Це дає змогу уникнути "
    "дублювання стилів і зберегти контраст в обох темах."
)
para(
    "Адаптивність реалізовано через медіазапити: на ширині до 1100 px права "
    "колонка переноситься під граф, на ширині до 760 px усі три колонки "
    "складаються в одну, а навігація перетворюється на кнопку меню. Мобільна "
    "версія зберігає той самий функціонал, але потребує більше вертикального "
    "прокручування."
)
para(
    "Для доступності додано skip-link «Перейти до основного вмісту», семантичні "
    "заголовки, підписи до полів, aria-pressed для перемикача алгоритму, "
    "role=status для банера результату та видимий фокус. Кнопки мають текстові "
    "підписи, а не лише іконки; декоративні іконки позначено aria-hidden."
)
para("Головна сторінка застосунку в світлій темі показана на рисунку 2.1.")
figure(IMG / "hero.png", 16.0, "Рис. 2.1 – Головна сторінка GraphPath")

para("Стан готовності робочого простору показано на рисунку 2.2.")
figure(IMG / "workspace.png", 16.0, "Рис. 2.2 – Робочий простір у стані Idle")

para(
    "Після запуску Dijkstra поточний крок підсвічує вершину та ребро, а права "
    "панель синхронно показує активний рядок псевдокоду й вміст пріоритетної черги "
    "(рис. 2.3)."
)
figure(IMG / "workspace-running.png", 16.0, "Рис. 2.3 – Виконання алгоритму Dijkstra")

para(
    "Після завершення з’являється банер із маршрутом і сумою ваг, а таблиця "
    "фіксує відстані та попередників для кожної вершини (рис. 2.4)."
)
figure(IMG / "workspace-result.png", 15.5, "Рис. 2.4 – Результат пошуку шляху")

h2("2.5. Тестування та перевірка коректності")
para(
    "Алгоритми перевірено окремими Node-скриптами на всіх трьох наборах даних. "
    "Для кожного запуску фіксувалися кількість кроків, маршрут, кількість ребер і "
    "сума ваг. Результати наведено в таблиці 2.3."
)
table_caption("Таблиця 2.3 – Результати перевірки алгоритмів")
add_table(
    ["Набір", "BFS", "DFS", "Dijkstra", "Очікування"],
    [
        ("Місто", "3 ребра: Вокзал → Центр → Універ → Лікарня", "3 ребра: той самий маршрут", "7: Вокзал → Стадіон → Парк → Лікарня", "BFS/DFS — 3 ребра, Dijkstra — 7"),
        ("Мережа", "2 ребра: Ядро → SW-2 → PC", "3 ребра: Ядро → SW-1 → SRV-2 → PC", "8: Ядро → SW-2 → PC", "BFS — 2, DFS — 3, Dijkstra — 8"),
        ("Навчальний", "3 ребра: A → B → C → G", "3 ребра: A → B → C → G", "3: A → B → C → G", "Усі — 3 ребра / 3"),
    ],
    widths=[2.2, 4.0, 4.0, 3.2, 2.6],
    font_size=Pt(9.5),
)
para(
    "Окремо перевірено граничні випадки: старт і фініш не можуть збігатися "
    "(застосунок автоматично змінює іншу вершину), вага ребра обмежується "
    "діапазоном 1–99, неіснуючий шлях завершується повідомленням, а зміна графа "
    "скидає попередній прогін. Ручне тестування виконано в Edge та Chrome, у "
    "світлій і темній темах, на десктопі 1440×1000 і мобільному 390×844."
)
para(
    "Production-збірка виконується командою npm run build. Основні показники "
    "наведено в таблиці 2.4."
)
table_caption("Таблиця 2.4 – Показники production-збірки")
add_table(
    ["Показник", "Значення"],
    [
        ("JavaScript", "188,92 кБ (gzip 61,67 кБ)"),
        ("CSS", "28,89 кБ (gzip 5,83 кБ)"),
        ("Кількість сторінок", "Одна SPA-сторінка"),
        ("Зовнішні бібліотеки графів", "Відсутні"),
    ],
    widths=[8.0, 8.0],
)
para(
    "Перевірка показала, що застосунок коректно працює без серверної частини, "
    "не звертається до зовнішніх API під час роботи та не зберігає персональні "
    "дані. Єдине значення, яке зберігається між сесіями, — обрана тема."
)

h2("2.6. Розміщення коду в Git")
para(
    "Вихідний код проєкту розміщено в Git-репозиторії. Публічне посилання на "
    "репозиторій: " + GIT_URL + ". У репозиторії зберігаються вихідні файли, "
    "конфігурація Vite, Sass-стилі, реальні фотографії, діаграми та матеріали "
    "звіту. Історія комітів фіксує етапи розробки: базову структуру, алгоритми, "
    "інтерфейс, адаптивність і фінальне доопрацювання."
)
para(
    "Для локального запуску достатньо встановити Node.js 18+, виконати npm install "
    "у каталозі StemProject і запустити npm run dev. Production-версія збирається "
    "командою npm run build у каталозі dist."
)

doc.add_page_break()

# ---------------------------------------------------------------------------
# Section 3
# ---------------------------------------------------------------------------
h1("РОЗДІЛ 3. КЕРІВНИЦТВО КОРИСТУВАЧА")
h2("3.1. Призначення програми та цільова аудиторія")
para(
    "GraphPath — це веб-застосунок для інтерактивної візуалізації алгоритмів "
    "пошуку шляхів на графах. Він допомагає побачити, як BFS, DFS і Dijkstra "
    "досліджують граф, які структури даних використовують і як формується "
    "фінальний маршрут. Програма не є промисловою системою маршрутизації: це "
    "навчальний інструмент, у якому всі дані створюються локально."
)
para(
    "Керівництво розраховане на студентів, викладачів і початківців, які мають "
    "базові навички роботи з браузером. Досвід програмування не потрібен: "
    "інтерфейс пояснює стани алгоритму природною мовою та візуальними "
    "підказками."
)

h2("3.2. Швидкий старт")
para(
    "Онлайн-версія застосунку доступна за адресою " + SITE_URL + ". "
    "Для локального запуску виконайте такі кроки:"
)
bullet("Встановіть Node.js 18 або новішу версію.")
bullet("Відкрийте термінал у каталозі StemProject.")
bullet("Виконайте npm install, щоб встановити залежності.")
bullet("Виконайте npm run dev і відкрийте адресу, яку запропонує Vite (зазвичай http://localhost:5173).")
bullet("Для production-збірки виконайте npm run build, а для локального перегляду — npm run preview.")
para(
    "Після відкриття сторінки користувач одразу бачить головну сторінку з описом "
    "і робочим простором. Авторизація не потрібна. За замовчуванням відкрито "
    "набір «Місто» і алгоритм Dijkstra; старт — «Вокзал», фініш — «Лікарня»."
)

h2("3.3. Огляд інтерфейсу")
para(
    "Основні зони інтерфейсу позначено на рисунку 3.1, а їхнє призначення "
    "узагальнено в таблиці 3.1."
)
figure(IMG / "workspace-annotated.png", 16.0, "Рис. 3.1 – Основні зони робочого простору")

table_caption("Таблиця 3.1 – Призначення основних зон інтерфейсу")
add_table(
    ["№", "Зона", "Призначення"],
    [
        ("1", "Набір даних", "Вибір готового графа або перехід до власного"),
        ("2", "Алгоритм", "Перемикання BFS / DFS / Dijkstra"),
        ("3", "Керування", "Старт, пауза, крок, скидання, швидкість"),
        ("4", "Полотно графа", "Вершини, ребра, ваги, перетягування та вибір"),
        ("5", "Стан алгоритму", "Метрики, псевдокод, черга/стек, журнал"),
        ("6", "Таблиця вершин", "Статус, відстань і попередник кожної вершини"),
    ],
    widths=[1.0, 4.4, 10.6],
)
para(
    "Над робочим простором розташовані заголовок, короткий опис, навігація та "
    "перемикач теми. Нижче — секції з поясненням алгоритмів, прикладами "
    "застосування, принципом роботи та описом проєкту. У футері вказано "
    "призначення застосунку та джерело фотографій."
)

h2("3.4. Робота з графом")
para(
    "Щоб почати, оберіть один із трьох наборів у лівому верхньому куті. «Місто» "
    "показує маршрути між локаціями з вагами в хвилинах, «Мережа» — вузли "
    "комп’ютерної мережі з вагами в мілісекундах, «Навчальний» — невеликий "
    "абстрактний граф без ваг. Після вибору набір повністю замінює поточний граф."
)
para(
    "Стартову вершину можна змінити через список «Стартова вершина» або кліком по "
    "вершині на полотні. Щоб призначити фініш, утримуйте Shift і клікніть по "
    "потрібній вершині або скористайтеся списком «Цільова вершина». Якщо вибрати "
    "вершину, яка вже є протилежною точкою, застосунок автоматично поміняє їх "
    "місцями, щоб старт і фініш не збігалися."
)
para(
    "Редактор графа дає змогу перетягувати вершини, додавати нові вузли, "
    "з’єднувати їх ребрами та змінювати вагу. Для з’єднання натисніть «З’єднати», "
    "задайте вагу, потім послідовно клікніть дві вершини. Повторне з’єднання тієї "
    "самої пари оновлює вагу наявного ребра. Кнопка «Випадковий» створює новий "
    "граф із семи вершин, а «Скинути граф» повертає вихідний набір."
)
para(
    "Після будь-якої зміни графа попередній прогін скидається. Це зроблено "
    "навмисно: інакше підсвічений шлях і таблиця відстаней не відповідали б "
    "новому графу."
)

h2("3.5. Запуск алгоритму та керування кроками")
para(
    "Оберіть алгоритм у перемикачі над полотном. BFS і DFS не враховують ваги "
    "ребер, тому для них важлива кількість переходів. Dijkstra враховує вагу та "
    "знаходить маршрут із мінімальною сумою. Після натискання «Запустити» "
    "починається автоматичне відтворення; кнопка змінюється на «Пауза»."
)
para(
    "Кнопка «Крок» виконує один знімок стану та зупиняє автоматичне відтворення. "
    "Це зручно для пояснення на занятті: можна зупинитися на релаксації ребра, "
    "показати зміну пріоритетної черги та порівняти її з псевдокодом. Повзунок "
    "швидкості задає темп від 1× до 4×; мінімальна затримка — 140 мс."
)
para(
    "Кнопка «Скинути» очищує кроки, але залишає граф і вибір старту/фінішу. "
    "Після завершення кнопка запуску перетворюється на «Ще раз»: повторний запуск "
    "виконує алгоритм заново з поточними параметрами."
)

h2("3.6. Читання результатів")
para(
    "Під час виконання кольори вершин показують їхній стан: старт має синє кільце, "
    "фініш — зелене, поточна вершина — бурштиновий фон, вершини в черзі — "
    "блакитний, відвідані — сірий, знайдений шлях — зелений. Ребра підсвічуються "
    "під час перегляду сусіда або релаксації."
)
para(
    "Права панель містить чотири блоки. Блок «Стан алгоритму» показує номер кроку, "
    "кількість відвіданих вершин, розмір черги та вартість. Блок «Псевдокод» "
    "підсвічує активний рядок. Блок «Пріоритетна черга» або «Черга/стек» показує "
    "поточний фронт. Блок «Журнал кроків» зберігає останні повідомлення; його "
    "можна прокручувати."
)
para(
    "Після завершення з’являється банер «Шлях знайдено» з маршрутом і вартістю. "
    "Для BFS і DFS це кількість ребер, для Dijkstra — сума ваг. Таблиця під "
    "робочим простором показує для кожної вершини статус, відстань і попередника. "
    "Саме за попередниками можна відновити маршрут вручну та перевірити "
    "результат."
)
para("Мобільна версія робочого простору показана на рисунку 3.2.")
figure(IMG / "workspace-mobile-crop.png", 6.2, "Рис. 3.2 – Робочий простір на мобільному екрані")

h2("3.7. Типові ситуації та обмеження")
para("Найпоширеніші ситуації та способи дії наведено в таблиці 3.2.")
table_caption("Таблиця 3.2 – Типові ситуації під час роботи")
add_table(
    ["Ситуація", "Причина", "Що зробити"],
    [
        ("Шлях не знайдено", "Між стартом і фінішем немає ребер", "Додати ребра або змінити вершини"),
        ("Старт і фініш збігаються", "Обрано ту саму вершину", "Застосунок автоматично змінює іншу вершину"),
        ("Dijkstra дає інший маршрут, ніж BFS", "BFS мінімізує кількість ребер, Dijkstra — суму ваг", "Порівняти обидва критерії; це очікувано"),
        ("Граф зник після перезавантаження", "Стан графа не зберігається між сесіями", "Знову обрати набір або створити граф"),
        ("На телефоні граф дрібний", "Полотно масштабується під ширину екрана", "Використати планшет або десктоп для редагування"),
    ],
    widths=[4.6, 5.6, 5.8],
    font_size=Pt(9.5),
)
para(
    "Обмеження проєкту: підтримуються лише неорієнтовані додатні ваги; немає "
    "імпорту/експорту JSON, збереження графа між сесіями та автоматичних "
    "юніт-тестів у репозиторії. Ці напрями визначено як подальший розвиток."
)

doc.add_page_break()

# ---------------------------------------------------------------------------
# Conclusion
# ---------------------------------------------------------------------------
h1("ВИСНОВОК")
para(
    "У межах індивідуального STEM-проєкту створено веб-застосунок GraphPath для "
    "інтерактивної візуалізації алгоритмів пошуку шляхів на графах. Мета проєкту "
    "досягнута: користувач може обрати готовий або створити власний граф, "
    "налаштувати старт і фініш, запустити BFS, DFS або Dijkstra та спостерігати "
    "за кожним кроком алгоритму."
)
para(
    "Під час проєктування проаналізовано предметну область, сформульовано "
    "функціональні й нефункціональні вимоги, розроблено User Flow, State Diagram "
    "і каркас інтерфейсу. Під час реалізації застосовано React 18, Vite 5, Sass, "
    "SVG, Pointer Events і localStorage. Алгоритми винесено в окремий модуль, "
    "який формує масив знімків стану; завдяки цьому граф, псевдокод, черга та "
    "таблиця оновлюються синхронно."
)
para(
    "Перевірено дев’ять комбінацій «набір даних × алгоритм». Для міста BFS і DFS "
    "знаходять маршрут із трьох ребер, Dijkstra — шлях вартістю 7; для мережі BFS "
    "дає два ребра, DFS — три, Dijkstra — вартість 8; для навчального графа всі "
    "алгоритми дають три ребра. Production-збірка займає 188,92 кБ JavaScript і "
    "28,89 кБ CSS до стиснення. Застосунок адаптивний, має світлу й темну теми, "
    "підтримує клавіатурну навігацію та не потребує бекенду."
)
para(
    "Подальший розвиток доцільно спрямувати на орієнтовані графи, алгоритми A* і "
    "Bellman–Ford, імпорт та експорт графа у JSON, збереження стану між сесіями, "
    "автоматичні тести та публікацію застосунку на GitHub Pages або іншому "
    "статичному хостингу. Отриманий досвід демонструє повний цикл фронтенд-"
    "розробки: від аналізу вимог і проєктування взаємодії до реалізації, "
    "тестування й документування."
)

doc.add_page_break()

# ---------------------------------------------------------------------------
# Sources
# ---------------------------------------------------------------------------
h1("СПИСОК ВИКОРИСТАНИХ ДЖЕРЕЛ")
sources = [
    "Cormen T. H., Leiserson C. E., Rivest R. L., Stein C. Introduction to Algorithms. 4th ed. Cambridge, MA : MIT Press, 2022. 1312 p.",
    "Dijkstra E. W. A note on two problems in connexion with graphs // Numerische Mathematik. 1959. Vol. 1. P. 269–271. DOI: 10.1007/BF01386390.",
    "Moore E. F. The shortest path through a maze // Proceedings of the International Symposium on the Theory of Switching. Cambridge, MA : Harvard University Press, 1959. P. 285–292.",
    "Tarjan R. Depth-first search and linear graph algorithms // SIAM Journal on Computing. 1972. Vol. 1, No. 2. P. 146–160. DOI: 10.1137/0201010.",
    "React : бібліотека для побудови користувацьких інтерфейсів. URL: https://react.dev/ (дата звернення: 18.11.2026).",
    "Vite : інструмент збирання фронтенд-застосунків. URL: https://vite.dev/ (дата звернення: 18.11.2026).",
    "Sass : документація препроцесора CSS. URL: https://sass-lang.com/documentation/ (дата звернення: 18.11.2026).",
    "MDN Web Docs. SVG: Scalable Vector Graphics. URL: https://developer.mozilla.org/en-US/docs/Web/SVG (дата звернення: 18.11.2026).",
    "MDN Web Docs. Pointer events. URL: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events (дата звернення: 18.11.2026).",
    "MDN Web Docs. Window.localStorage. URL: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage (дата звернення: 18.11.2026).",
    "Web Content Accessibility Guidelines (WCAG) 2.2. W3C Recommendation, 5 October 2023. URL: https://www.w3.org/TR/WCAG22/ (дата звернення: 18.11.2026).",
    "Unsplash License. URL: https://unsplash.com/license (дата звернення: 18.11.2026).",
]
for index, source in enumerate(sources, start=1):
    p = doc.add_paragraph(style="Source Item")
    p.add_run(f"{index}. {source}")

# ---------------------------------------------------------------------------
# Properties and save
# ---------------------------------------------------------------------------
doc.core_properties.title = "GraphPath — звіт з індивідуального STEM-проєкту"
doc.core_properties.author = "Василець Олександр Миколайович"
doc.core_properties.subject = "Розробка фронтенду програмних систем"
doc.core_properties.keywords = "React, Vite, Sass, графи, BFS, DFS, Dijkstra, STEM"
doc.save(OUT)
print(OUT)
