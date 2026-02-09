# IC2 - Independent Coursework: KI-Einsatz in der Praxis

## Über dieses Projekt

Dieses Projekt entsteht im Rahmen des **Independent Coursework** an der **HTW Berlin**. Das Hauptziel ist das nähere Kennenlernen von KI-Einsatz in verschiedenen praktischen Anwendungsfällen. Dabei geht es nicht nur um theoretisches Wissen, sondern vor allem um hands-on Erfahrung mit modernen KI-Tools und -Technologien.

## Projektstruktur

Das Projekt besteht aus einer Website mit drei Jupyter Notebooks, die verschiedene Aspekte von KI und Machine Learning abdecken:

```
IC_2/
├── website/
│   ├── index.html           # Landing Page
│   ├── style.css            # Glassmorphism Design
│   ├── script.js            # Interaktive Funktionen
│   └── assets/
│       └── notebooks/
│           ├── IC2_01.ipynb # Intelligente Literatursuche (NLP)
│           ├── IC2_02.ipynb # KI-gestützte Datenanalyse
│           └── IC2_03.ipynb # Machine Learning Model Training
└── README.md
```

## Website starten

```bash
cd website
python -m http.server 8000
```

Dann im Browser öffnen: `http://localhost:8000`

---

## Notebook 1: Intelligente Literatursuche (NLP)

**Thema:** Natural Language Processing und LLM-Integration

**Was passiert hier:**
Eine intelligente Literatursuche, die semantische Anfragen versteht und passende Literaturhinweise generiert. Das System nutzt NLP, um aus natürlichsprachlichen Fragen relevante Informationen zu extrahieren.

### Code-Übersicht

**1. Setup & Dependencies**
```python
!pip install spacy gradio google-generativeai
!python -m spacy download de_core_news_lg
```
Installiert die benötigten Bibliotheken:
- `spacy`: NLP-Bibliothek für Named Entity Recognition und Keyword-Extraktion
- `gradio`: Framework für die interaktive Benutzeroberfläche
- `google-generativeai`: Zugriff auf die Gemini API
- `de_core_news_lg`: Großes deutsches Sprachmodell für spaCy

**2. NLP-Pipeline mit spaCy**
```python
import spacy
nlp = spacy.load("de_core_news_lg")

def extract_keyphrases(text):
    doc = nlp(text)
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    noun_phrases = [chunk.text for chunk in doc.noun_chunks]
    # ...
```
- Lädt das deutsche Sprachmodell
- `doc.ents`: Extrahiert Named Entities (Personen, Orte, Organisationen)
- `doc.noun_chunks`: Extrahiert Nominalphrasen (wichtige Konzepte)
- `token.pos_`: POS-Tagging (Part-of-Speech) zur Identifikation von Nomen, Verben etc.

**3. Gradio Interface**
```python
import gradio as gr

interface = gr.Interface(
    fn=analyze_research_query,
    inputs=gr.Textbox(lines=5, placeholder="Forschungsfrage eingeben..."),
    outputs=gr.Textbox(label="Analyse-Ergebnisse"),
    title="Intelligente Literatursuche"
)
interface.launch()
```
- Erstellt eine Web-UI mit Eingabe- und Ausgabefeld
- `fn=analyze_research_query`: Verknüpft die Funktion mit dem Interface
- `launch()`: Startet den Webserver

**4. Gemini API Integration**
```python
import google.generativeai as genai
genai.configure(api_key="YOUR_API_KEY")

model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content(prompt)
```
- Konfiguriert die Gemini API
- `GenerativeModel`: Wählt das Gemini-Modell aus
- `generate_content()`: Sendet den Prompt und erhält KI-generierte Antwort
- Das LLM fasst die extrahierten Keyphrases zusammen und schlägt Suchbegriffe vor

**Workflow:**
1. Nutzer gibt Forschungsfrage ein
2. spaCy extrahiert Schlüsselbegriffe und Entitäten
3. Gemini analysiert die Themen semantisch
4. System gibt optimierte Suchempfehlungen aus

---

## Notebook 2: KI-gestützte Datenanalyse

**Thema:** Automatisierte Datenanalyse mit LLM-Unterstützung

**Was passiert hier:**
Ein vollständiger Datenanalyse-Workflow, bei dem die Gemini API automatisch Insights aus Daten generiert. Statt manuell nach Mustern zu suchen, übernimmt die KI die Analyse und liefert geschäftsorientierte Empfehlungen.

### Code-Übersicht

**1. Datenverarbeitung mit Pandas**
```python
import pandas as pd
import numpy as np

df = pd.read_csv('data.csv')
print(df.info())
print(df.describe())
```
- `pd.read_csv()`: Lädt Daten aus CSV-Datei
- `df.info()`: Zeigt Datentypen und fehlende Werte
- `df.describe()`: Generiert statistische Zusammenfassung

**2. Data Cleaning & Preprocessing**
```python
# Fehlende Werte behandeln
df['column'].fillna(df['column'].mean(), inplace=True)

# Kategoriale Features encodieren
df = pd.get_dummies(df, columns=['category'])

# Daten normalisieren
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
df_scaled = scaler.fit_transform(df)
```
- `fillna()`: Ersetzt fehlende Werte (z.B. mit Durchschnitt)
- `get_dummies()`: One-Hot Encoding für kategoriale Variablen
- `StandardScaler`: Skaliert numerische Werte auf Mittelwert 0 und Standardabweichung 1

**3. Explorative Datenanalyse (EDA)**
```python
import matplotlib.pyplot as plt
import seaborn as sns

# Verteilungen visualisieren
plt.figure(figsize=(10, 6))
sns.histplot(df['revenue'], kde=True)
plt.title('Revenue Distribution')
plt.show()

# Korrelationen analysieren
correlation_matrix = df.corr()
sns.heatmap(correlation_matrix, annot=True)
```
- `histplot()`: Zeigt die Verteilung einer Variable
- `kde=True`: Fügt Kernel Density Estimation hinzu
- `corr()`: Berechnet Korrelationsmatrix
- `heatmap()`: Visualisiert Korrelationen farbcodiert

**4. Gemini API für automatische Insights**
```python
# Daten-Summary erstellen
data_summary = f"""
Dataset Info:
- Anzahl Zeilen: {len(df)}
- Features: {df.columns.tolist()}
- Statistiken: {df.describe().to_string()}
"""

# KI-Analyse anfordern
prompt = f"""
Analysiere diesen Datensatz und generiere Business-Insights:

{data_summary}

Identifiziere:
1. Wichtigste Muster und Trends
2. Auffälligkeiten oder Anomalien
3. Konkrete Handlungsempfehlungen
"""

response = model.generate_content(prompt)
print(response.text)
```
- Erstellt strukturierte Zusammenfassung der Daten
- Sendet Statistiken an Gemini API
- LLM analysiert die Daten und generiert automatisch:
  - Erkannte Muster
  - Business-relevante Insights
  - Konkrete Empfehlungen

**Workflow:**
1. Daten laden und bereinigen
2. Explorative Analyse und Visualisierung
3. Daten-Summary an Gemini API senden
4. KI generiert automatisch Business-Insights

**Der Vorteil:** Statt manuell nach Patterns zu suchen, liefert die KI sofort strukturierte, geschäftsorientierte Analysen in natürlicher Sprache.

---

## Notebook 3: Machine Learning Model Training

**Thema:** Customer Churn Prediction mit Random Forest

**Was passiert hier:**
Ein komplettes ML-Projekt von der Datenaufbereitung bis zur Modell-Evaluation. Das Ziel ist, vorherzusagen, welche Kunden ein Unternehmen verlassen werden (Churn). Der Fokus liegt auf Random Forest als interpretierbare ML-Methode.

### Code-Übersicht

**1. Daten laden und explorieren**
```python
import pandas as pd

df = pd.read_csv('customer_churn.csv')

# Quick Overview
print(f"Dataset Shape: {df.shape}")
print(f"Churn Rate: {df['Churn'].value_counts(normalize=True)}")
```
- Lädt Kundendaten
- Zeigt Dimensionen (Zeilen × Spalten)
- Berechnet Churn Rate (Prozentsatz der abgewanderten Kunden)

**2. Feature Engineering & Preprocessing**
```python
from sklearn.preprocessing import LabelEncoder, StandardScaler

# Kategoriale Features encodieren
le = LabelEncoder()
df['Contract'] = le.fit_transform(df['Contract'])

# Features und Target trennen
X = df.drop('Churn', axis=1)
y = df['Churn']

# Features skalieren
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```
- `LabelEncoder`: Konvertiert kategoriale Werte in Zahlen (z.B. "Monthly" → 0, "Yearly" → 1)
- `drop()`: Entfernt Target-Variable aus Features
- `StandardScaler`: Normalisiert Features für bessere ML-Performance

**3. Train-Test Split**
```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, 
    test_size=0.2, 
    random_state=42,
    stratify=y
)
```
- Teilt Daten in 80% Training und 20% Test
- `stratify=y`: Behält Churn-Verteilung in beiden Sets bei
- `random_state=42`: Macht Split reproduzierbar

**4. Random Forest Training**
```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=100,      # 100 Entscheidungsbäume
    max_depth=20,          # Maximale Baumtiefe
    random_state=42
)

model.fit(X_train, y_train)
```
- `RandomForestClassifier`: Ensemble-Modell aus vielen Decision Trees
- `n_estimators=100`: Trainiert 100 Bäume parallel
- `fit()`: Trainiert das Modell auf Trainingsdaten
- Jeder Baum bekommt zufällige Samples und Features
- Finale Vorhersage: Mehrheitsentscheidung aller Bäume

**5. Model Evaluation**
```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, roc_auc_score, confusion_matrix

# Vorhersagen machen
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

# Metriken berechnen
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_pred_proba)

print(f"Accuracy: {accuracy:.2f}")
print(f"ROC-AUC: {roc_auc:.2f}")
```
- `accuracy`: Wie viele Vorhersagen sind korrekt? (Gesamtgenauigkeit)
- `precision`: Von allen als Churn vorhergesagten: Wie viele sind wirklich Churn?
- `recall`: Von allen echten Churn-Fällen: Wie viele wurden erkannt?
- `roc_auc`: Maß für Trennfähigkeit des Modells (0.5 = zufällig, 1.0 = perfekt)
- `predict_proba()`: Gibt Wahrscheinlichkeiten statt binärer Vorhersagen

**6. Confusion Matrix**
```python
import seaborn as sns
import matplotlib.pyplot as plt

cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.show()
```
- Zeigt True/False Positives/Negatives in Matrix
- Diagonale = korrekte Vorhersagen
- Off-Diagonal = Fehler

**7. Feature Importance**
```python
# Wichtigste Features identifizieren
importances = model.feature_importances_
feature_names = X.columns

feature_importance_df = pd.DataFrame({
    'Feature': feature_names,
    'Importance': importances
}).sort_values('Importance', ascending=False)

# Visualisieren
plt.figure(figsize=(10, 6))
sns.barplot(x='Importance', y='Feature', data=feature_importance_df.head(10))
plt.title('Top 10 Most Important Features')
plt.show()
```
- `feature_importances_`: Zeigt, welche Features am wichtigsten für Vorhersagen sind
- Höherer Wert = Feature hat mehr Einfluss
- Hilft zu verstehen, WARUM Kunden churnen (z.B. "Contract Type" oder "Tenure")

**Workflow:**
1. Daten laden und explorieren
2. Features vorbereiten und encodieren
3. Train-Test Split durchführen
4. Random Forest Modell trainieren (100 Bäume)
5. Modell auf Testdaten evaluieren
6. Feature Importance analysieren
7. Business Insights ableiten

**Business Value:**
- Modell identifiziert gefährdete Kunden mit ~85-90% Genauigkeit
- Feature Importance zeigt, welche Faktoren Churn treiben
- Ermöglicht proaktive Retention-Maßnahmen
- ROI-Potenzial: Mehrere hunderttausend Euro durch Churn-Reduktion

---

## Technologien im Überblick

| Technologie | Verwendung | Notebook |
|-------------|------------|----------|
| **Python** | Programmiersprache | Alle |
| **spaCy** | Named Entity Recognition, Keyword-Extraktion | IC2_01 |
| **Gradio** | Interaktive Web-UI für ML-Prototypen | IC2_01 |
| **Gemini API** | LLM für semantische Analyse und Insights | IC2_01, IC2_02 |
| **Pandas** | Datenmanipulation und -analyse | IC2_02, IC2_03 |
| **NumPy** | Numerische Operationen | IC2_02, IC2_03 |
| **Matplotlib/Seaborn** | Statische Visualisierungen | IC2_02, IC2_03 |
| **Scikit-learn** | ML-Algorithmen und Preprocessing | IC2_03 |
| **Random Forest** | Classification-Algorithmus | IC2_03 |

---

## Lernziele & Erkenntnisse

**Was ich gelernt habe:**

1. **NLP in der Praxis:** Wie man mit spaCy echte Texte analysiert und relevante Informationen extrahiert
2. **LLM-Integration:** Wie man APIs wie Gemini sinnvoll in Workflows einbindet
3. **Prompt Engineering:** Wie man Prompts strukturiert, um präzise Ergebnisse zu bekommen
4. **Datenanalyse-Workflow:** Von rohen Daten bis zu KI-generierten Business-Insights
5. **ML-Pipeline:** Kompletter Workflow von Daten bis zum produktionsreifen Modell
6. **Feature Engineering:** Wie man Daten für ML-Modelle aufbereitet
7. **Model Evaluation:** Welche Metriken wann wichtig sind (Accuracy vs ROC-AUC vs Recall)
8. **Interpretierbarkeit:** Warum Feature Importance für Business-Entscheidungen wichtig ist

**Kernerkenntnisse:**

- KI-Tools können repetitive Analyseaufgaben automatisieren
- Die Kombination von klassischen Methoden (spaCy, Scikit-learn) und LLMs ist mächtig
- Prompt Engineering ist eine wichtige Fähigkeit für KI-Integration
- Interpretierbare Modelle (Random Forest) sind oft besser als Black-Box-Modelle
- Business-Verständnis ist genauso wichtig wie technisches Know-how

---

## Autor

Projekt im Rahmen des Independent Coursework  
**HTW Berlin** | Wintersemester 2025/2026

---

## Lizenz

Dieses Projekt dient ausschließlich Lern- und Demonstrationszwecken im Rahmen des Studiums.
