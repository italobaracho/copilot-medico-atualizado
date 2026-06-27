import io
from datetime import datetime

from backend import patient_db as pdb


def test_patient_exists_endpoint_false(client, make_auth_headers):
    resp = client.get("/api/patient-exists/does-not-exist", headers=make_auth_headers())
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["status"] == "success"
    assert data["exists"] is False


def test_create_patient_endpoint(client, make_auth_headers):
    resp = client.post("/api/patients", json={"name": "Ana"}, headers=make_auth_headers())
    assert resp.status_code == 201
    payload = resp.get_json()
    assert payload["status"] == "success"
    assert payload["patient_id"]
    assert payload["patient_name"] == "Ana"
    assert payload["first_consultation_id"]


def test_chat_endpoint_creates_patient_and_consultation(client, make_auth_headers):
    resp = client.post("/api/chat", json={"message": "Ola doutor"}, headers=make_auth_headers())
    assert resp.status_code == 200
    payload = resp.get_json()
    assert payload["status"] == "success"
    assert "ai_response" in payload
    assert payload["consultation_id"]
    assert payload.get("patient_id")


def test_chat_endpoint_with_existing_patient_and_consultation(client, make_auth_headers):
    pid = pdb.generate_patient_id()
    pdb.ensure_patient_exists(pid, name="Teste")
    cid = pdb.add_consultation_to_patient(pid, "Consulta X")

    resp = client.post(
        "/api/chat",
        json={"message": "Pergunta", "patient_id": pid, "consultation_id": cid},
        headers=make_auth_headers(),
    )
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["consultation_id"] == cid


def test_upload_pdf_endpoint_happy_path(client, make_auth_headers):
    data = {
        "pdf": (io.BytesIO(b"exame do paciente Joao"), "doc.pdf")
    }
    resp = client.post(
        "/api/upload-pdf",
        data=data,
        content_type="multipart/form-data",
        headers=make_auth_headers(),
    )
    assert resp.status_code == 200
    payload = resp.get_json()
    assert payload["status"] == "success"
    assert payload["ai_response"].startswith("[stubbed AI reply]")
    assert payload["consultation_id"]


def test_create_and_list_consultations(client, make_auth_headers):
    headers = make_auth_headers()

    r = client.post("/api/patients", json={"name": "Carlos"}, headers=headers)
    pid = r.get_json()["patient_id"]

    resp = client.post(
        f"/api/patients/{pid}/consultations",
        json={"title": "Nova Consulta", "import_consultation_ids": []},
        headers=headers,
    )
    assert resp.status_code == 201
    new_id = resp.get_json()["consultation_id"]

    list_resp = client.get(f"/api/patients/{pid}/consultations", headers=headers)
    assert list_resp.status_code == 200
    consultations = list_resp.get_json()["consultations"]
    assert any(c["id"] == new_id for c in consultations)


def test_get_consultation_history(client, make_auth_headers):
    headers = make_auth_headers()

    r = client.post("/api/patients", json={"name": "Paula"}, headers=headers)
    pid = r.get_json()["patient_id"]
    cid = r.get_json()["first_consultation_id"]

    pdb.add_message_to_consultation_history(pid, cid, "user", "Oi")
    resp = client.get(f"/api/patients/{pid}/consultations/{cid}/history", headers=headers)
    assert resp.status_code == 200
    history = resp.get_json()["history"]
    assert len(history) >= 1


def test_get_all_patients(client, make_auth_headers):
    headers = make_auth_headers()
    client.post("/api/patients", json={"name": "ListMe"}, headers=headers)

    resp = client.get("/api/all-patients", headers=headers)
    assert resp.status_code == 200
    payload = resp.get_json()
    assert {"status", "patients"} <= set(payload.keys())
    assert isinstance(payload["patients"], list)


def test_start_recording_for_valid_patient_and_consultation(client, make_auth_headers):
    headers = make_auth_headers()
    pid = pdb.generate_patient_id()
    pdb.ensure_patient_exists(pid, name="Paciente Gravacao")
    cid = pdb.add_consultation_to_patient(pid, "Consulta Gravacao")

    resp = client.post(
        f"/api/patients/{pid}/consultations/{cid}/recording/start",
        headers=headers,
    )

    assert resp.status_code == 201
    payload = resp.get_json()
    assert payload["status"] == "success"
    assert payload["message"] == "Gravacao iniciada com sucesso."

    recording = payload["recording"]
    assert recording["id"]
    assert recording["patient_id"] == pid
    assert recording["consultation_id"] == cid
    assert recording["status"] == "active"
    assert recording["ended_at"] is None
    assert recording["duration_seconds"] == 0
    assert recording["started_at"]
    datetime.fromisoformat(recording["started_at"])

    consultation = pdb.get_patient_consultation(pid, cid)
    assert consultation["recordings"][0]["consultation_id"] == cid
    assert consultation["recordings"][0]["id"] == recording["id"]


def test_start_recording_twice_in_same_consultation_returns_conflict(client, make_auth_headers):
    headers = make_auth_headers()
    pid = pdb.generate_patient_id()
    pdb.ensure_patient_exists(pid, name="Paciente Duplicidade")
    cid = pdb.add_consultation_to_patient(pid, "Consulta Duplicidade")

    first_resp = client.post(
        f"/api/patients/{pid}/consultations/{cid}/recording/start",
        headers=headers,
    )
    second_resp = client.post(
        f"/api/patients/{pid}/consultations/{cid}/recording/start",
        headers=headers,
    )

    assert first_resp.status_code == 201
    assert second_resp.status_code == 409
    payload = second_resp.get_json()
    assert payload["status"] == "error"
    assert payload["error"] == "recording_already_active"


def test_start_recording_for_missing_consultation_returns_not_found(client, make_auth_headers):
    headers = make_auth_headers()
    pid = pdb.generate_patient_id()
    pdb.ensure_patient_exists(pid, name="Paciente Sem Consulta")

    resp = client.post(
        f"/api/patients/{pid}/consultations/consulta-inexistente/recording/start",
        headers=headers,
    )

    assert resp.status_code == 404
    payload = resp.get_json()
    assert payload["status"] == "error"
    assert payload["error"] == "consultation_not_found"


def test_start_recording_for_missing_patient_returns_not_found(client, make_auth_headers):
    resp = client.post(
        "/api/patients/paciente-inexistente/consultations/consulta-inexistente/recording/start",
        headers=make_auth_headers(),
    )

    assert resp.status_code == 404
    payload = resp.get_json()
    assert payload["status"] == "error"
    assert payload["error"] == "patient_not_found"


def test_start_recording_for_inactive_consultation_returns_conflict(client, make_auth_headers):
    headers = make_auth_headers()
    pid = pdb.generate_patient_id()
    pdb.ensure_patient_exists(pid, name="Paciente Inativo")
    cid = pdb.add_consultation_to_patient(pid, "Consulta Inativa")

    db = pdb.load_database()
    consultation = pdb.find_consultation_in_patient(db[pid], cid)
    consultation["status"] = "closed"
    pdb.save_database(db)

    resp = client.post(
        f"/api/patients/{pid}/consultations/{cid}/recording/start",
        headers=headers,
    )

    assert resp.status_code == 409
    payload = resp.get_json()
    assert payload["status"] == "error"
    assert payload["error"] == "consultation_inactive"
