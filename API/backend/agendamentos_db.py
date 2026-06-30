import json
import os
import uuid
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'agendamentos.json')


def _load():
    if os.path.exists(DB_PATH):
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except (json.JSONDecodeError, ValueError):
                return []
    return []


def _save(data):
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_all_agendamentos(date_from=None, date_to=None):
    appts = _load()
    if date_from:
        appts = [a for a in appts if a.get('date', '') >= date_from]
    if date_to:
        appts = [a for a in appts if a.get('date', '') <= date_to]
    return sorted(appts, key=lambda a: (a.get('date', ''), a.get('start', '')))


def create_agendamento(date, start, end, title, type_='Consulta', patient_id=None):
    appts = _load()
    new_appt = {
        'id': str(uuid.uuid4()),
        'date': date,
        'start': start,
        'end': end,
        'title': title,
        'type': type_,
        'patient_id': patient_id,
        'created_at': datetime.now().isoformat(),
    }
    appts.append(new_appt)
    _save(appts)
    return new_appt


def update_agendamento(appt_id, **fields):
    appts = _load()
    for appt in appts:
        if appt['id'] == appt_id:
            for k, v in fields.items():
                if v is not None:
                    appt[k] = v
            appt['updated_at'] = datetime.now().isoformat()
            _save(appts)
            return appt
    return None


def delete_agendamento(appt_id):
    appts = _load()
    new_appts = [a for a in appts if a['id'] != appt_id]
    if len(new_appts) == len(appts):
        return False
    _save(new_appts)
    return True
