# News Classification Project

Machine learning based news classification system.

**Categories:** World 🌍 | Sports ⚽ | Business 💼 | Sci/Tech 🔬

### Technologies
**Backend:** Python, FastAPI, scikit-learn, NLTK  
**Frontend:** React  
**ML:** TF-IDF, Naive Bayes, Logistic Regression, SVM
---

## Installation

### Data Set Download

https://www.kaggle.com/datasets/amananandrai/ag-news-classification-dataset downloaded to `backend/data/` folder:
- `train.csv` (120,000 samples)
- `test.csv` (7,600 samples)

### Model Training (Jupyter Notebook)

**Windows (CMD):**
```powershell
# Create virtual environment if not exists
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate
```
#### Linux / macOS
```bash
# Create virtual environment if not exists
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate
```
### Install Dependencies
pip3 install -r backend/requirements.txt

### Run Notebook
jupyter train.ipynb or jupyter notebook train.ipynb

Notebook runs all cells in order. Model is saved to `backend/models/` folder.

### Backend API Start

#### Virtual environment must be activated

#### Linux/macOS:
```bash
source .venv/bin/activate
```
#### Windows (CMD)
```powershell
.venv\Scripts\activate
```
cd backend/src
uvicorn api:app --reload

api url: http://localhost:8000

### Frontend Start

cd frontend
npm install
npm run dev

Frontend: http://localhost:5173
---

## Folder Structure

train.ipynb                   # Model training notebook
README.md                     # Project description
figures/                      # Notebook figures
backend/                      # Backend code
--requirements.txt
--data/                       # train.csv, test.csv
--models/                     # Trained best model files
--src/
----api.py                    # FastAPI backend
frontend/                     # React application
