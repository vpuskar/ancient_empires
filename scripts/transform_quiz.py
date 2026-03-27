"""
Transform HuggingFace Roman Empire Q&A CSV into quiz_questions format
for Supabase import.

Input:  roman_empire_qa.csv (ChunkIDs, ChunkTexts, Question, Answer, Quoted_Text_ID)
Output: quiz_questions_import.csv ready for Supabase

Usage: py scripts/transform_quiz.py
"""

import csv
import re
import random
from collections import defaultdict
from pathlib import Path

random.seed(42)  # reproducible output

INPUT = Path(__file__).resolve().parent.parent / "roman_empire_qa.csv"
OUTPUT = Path(__file__).resolve().parent.parent / "quiz_questions_import.csv"
MAX_QUESTIONS = 5000
EMPIRE_ID = 1
DIFFICULTY = 2

# ---------------------------------------------------------------------------
# 1. Category detection
# ---------------------------------------------------------------------------

CATEGORY_RULES = [
    # (category, compiled regex pattern applied to question text)
    ("rulers", re.compile(
        r"\b(emperor|empress|ruler|king|queen|dynasty|reign|caesar|augustus|"
        r"consul|dictator|princeps|succeeded|accession|abdicate|coronat|"
        r"who ruled|who became|under which emperor|under whose)\b", re.I)),
    ("battles", re.compile(
        r"\b(battle|war|siege|campaign|invasion|conquer|defeat|victory|"
        r"military|army|legion|troops|fought|conflict|revolt|rebellion|"
        r"sack of|fall of)\b", re.I)),
    ("religion", re.compile(
        r"\b(christian|church|bishop|pope|pagan|temple|god|gods|goddess|"
        r"worship|religious|faith|edict|council|nicaea|milan|"
        r"christianity|judaism|cult|priest|sacred|divine)\b", re.I)),
    ("geography", re.compile(
        r"\b(province|territory|border|river|city|capital|region|"
        r"mediterranean|atlantic|danube|rhine|nile|tiber|"
        r"britain|gaul|egypt|africa|asia|hispania|syria|"
        r"located|where was|where did|map|frontier|boundary)\b", re.I)),
    ("politics", re.compile(
        r"\b(senate|law|republic|constitution|reform|govern|political|"
        r"administration|bureaucra|edict|decree|policy|tax|tribute|"
        r"citizen|rights|magistrat|praetor|tribune|assembly|"
        r"treaty|alliance|diplomacy|succession)\b", re.I)),
    ("culture", re.compile(
        r"\b(art|architect|literature|philosophy|language|latin|greek|"
        r"amphitheatre|colosseum|aqueduct|road|forum|bath|"
        r"gladiator|chariot|festival|poet|writer|historian|"
        r"mosaic|sculpture|theatre|education|trade|commerce|"
        r"currency|coin|engineering|roman law)\b", re.I)),
]


def detect_category(question: str, answer: str) -> str:
    """Return best-matching category, or 'culture' as fallback."""
    combined = question + " " + answer
    for category, pattern in CATEGORY_RULES:
        if pattern.search(combined):
            return category
    return "culture"


# ---------------------------------------------------------------------------
# 2. Answer type classification (for distractor grouping)
# ---------------------------------------------------------------------------

RE_YEAR = re.compile(r"^\d{1,4}(\s*(BC|AD|CE|BCE))?$", re.I)
RE_NUMBER = re.compile(r"^\d[\d,\.]*$")
# Common Roman / historical person name patterns
RE_PERSON = re.compile(
    r"\b(Augustus|Caesar|Trajan|Hadrian|Nero|Tiberius|Caligula|Claudius|"
    r"Vespasian|Titus|Domitian|Marcus Aurelius|Commodus|Diocletian|"
    r"Constantine|Theodosius|Justinian|Octavian|Pompey|Cicero|Seneca|"
    r"Antony|Cleopatra|Brutus|Sulla|Marius|Romulus|Remus|Virgil|Ovid|"
    r"Hannibal|Scipio|Crassus|Spartacus)\b", re.I)
RE_PLACE = re.compile(
    r"\b(Rome|Constantinople|Carthage|Alexandria|Athens|Antioch|Jerusalem|"
    r"Britain|Gaul|Egypt|Spain|Hispania|Syria|Africa|Asia|Byzantium|"
    r"Ravenna|Milan|Trier|Adrianople|Actium|Cannae|Zama|Danube|Rhine|"
    r"Tiber|Mediterranean|Colosseum|Forum|Pantheon)\b", re.I)


def classify_answer(answer: str) -> str:
    """Classify answer into type for distractor grouping."""
    a = answer.strip()
    if RE_YEAR.match(a):
        return "year"
    if RE_NUMBER.match(a):
        return "number"
    if RE_PERSON.search(a):
        return "person"
    if RE_PLACE.search(a):
        return "place"
    if len(a.split()) <= 3:
        return "short_fact"
    return "long_fact"


# ---------------------------------------------------------------------------
# 3. Read & deduplicate
# ---------------------------------------------------------------------------

print(f"Reading {INPUT} ...")
raw_qa: dict[str, str] = {}  # question -> answer (dedup by question text)

with open(INPUT, encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        q = row["Question"].strip()
        a = row["Answer"].strip()
        if q and a and q not in raw_qa:
            raw_qa[q] = a

print(f"  Raw unique Q&A pairs: {len(raw_qa)}")

# ---------------------------------------------------------------------------
# 4. Group answers by type (for distractor pool)
# ---------------------------------------------------------------------------

type_pools: dict[str, list[str]] = defaultdict(list)
qa_types: dict[str, str] = {}

for q, a in raw_qa.items():
    atype = classify_answer(a)
    qa_types[q] = atype
    type_pools[atype].append(a)

# Deduplicate pools
for atype in type_pools:
    type_pools[atype] = list(set(type_pools[atype]))

print("  Answer type pools:")
for atype, pool in sorted(type_pools.items()):
    print(f"    {atype}: {len(pool)} unique answers")

# ---------------------------------------------------------------------------
# 5. Generate distractors & build output rows
# ---------------------------------------------------------------------------

LETTERS = ["A", "B", "C", "D"]


def pick_distractors(correct: str, atype: str, n: int = 3) -> list[str]:
    """Pick n distractors from same answer-type pool, falling back to other pools."""
    pool = [a for a in type_pools[atype] if a != correct]

    if len(pool) < n:
        # Borrow from other pools
        for other_type, other_pool in type_pools.items():
            if other_type != atype:
                extras = [a for a in other_pool if a != correct and a not in pool]
                pool.extend(extras)
                if len(pool) >= n:
                    break

    if len(pool) < n:
        # Last resort: generate slight variations
        while len(pool) < n:
            pool.append(f"Not {correct}")

    return random.sample(pool, n)


questions = list(raw_qa.items())
random.shuffle(questions)
questions = questions[:MAX_QUESTIONS]

rows = []
for q, correct_answer in questions:
    atype = qa_types[q]
    category = detect_category(q, correct_answer)

    distractors = pick_distractors(correct_answer, atype)
    options = [correct_answer] + distractors
    random.shuffle(options)
    correct_idx = options.index(correct_answer)
    correct_letter = LETTERS[correct_idx]

    rows.append({
        "empire_id": EMPIRE_ID,
        "question": q,
        "option_a": options[0],
        "option_b": options[1],
        "option_c": options[2],
        "option_d": options[3],
        "correct": correct_letter,
        "difficulty": DIFFICULTY,
        "category": category,
        "explanation": "",
        "verified": False,
    })

# ---------------------------------------------------------------------------
# 6. Write output CSV
# ---------------------------------------------------------------------------

FIELDNAMES = [
    "empire_id", "question",
    "option_a", "option_b", "option_c", "option_d", "correct",
    "difficulty", "category", "explanation", "verified",
]

with open(OUTPUT, "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
    writer.writeheader()
    writer.writerows(rows)

# ---------------------------------------------------------------------------
# 7. Summary stats
# ---------------------------------------------------------------------------

cat_counts: dict[str, int] = defaultdict(int)
type_counts: dict[str, int] = defaultdict(int)
for r in rows:
    cat_counts[r["category"]] += 1
    correct_col = f"option_{r['correct'].lower()}"
    type_counts[classify_answer(r[correct_col])] += 1

print(f"\nOutput: {OUTPUT}")
print(f"Total questions: {len(rows)}")
print("\nBy category:")
for cat, count in sorted(cat_counts.items(), key=lambda x: -x[1]):
    print(f"  {cat}: {count}")
print("\nBy answer type:")
for atype, count in sorted(type_counts.items(), key=lambda x: -x[1]):
    print(f"  {atype}: {count}")
