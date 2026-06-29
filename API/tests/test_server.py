def test_create_patient_success(client, make_auth_headers, monkeypatch):
    import server

    monkeypatch.setattr(server, "generate_patient_id", lambda: "NEW_TEST_ID_001")
    monkeypatch.setattr(
        server,
        "ensure_patient_exists",
        lambda patient_id, name=None, **kwargs: {"name": name, "chat_history": []},
    )
    monkeypatch.setattr(server, "add_consultation_to_patient", lambda patient_id, title: "CONSULTA_ID_001")

    response = client.post(
        "/api/patients",
        json={"name": "Novo Paciente"},
        headers=make_auth_headers(),
    )

    assert response.status_code == 201
    response_data = response.get_json()
    assert response_data["patient_id"] == "NEW_TEST_ID_001"
    assert response_data["first_consultation_id"] == "CONSULTA_ID_001"


def test_check_patient_exists_found(client, make_auth_headers, monkeypatch):
    import server

    monkeypatch.setattr(server, "get_patient_data", lambda patient_id: {"name": "Existente"})

    response = client.get("/api/patient-exists/existing_id", headers=make_auth_headers())

    assert response.status_code == 200
    assert response.get_json()["exists"] is True


def test_check_patient_exists_not_found(client, make_auth_headers, monkeypatch):
    import server

    monkeypatch.setattr(server, "get_patient_data", lambda patient_id: None)

    response = client.get("/api/patient-exists/non_existing_id", headers=make_auth_headers())

    assert response.status_code == 200
    assert response.get_json()["exists"] is False


def test_get_all_patients_success(client, make_auth_headers, monkeypatch):
    import server

    mock_data = [
        {"id": "id_pac_1", "name": "Paciente A"},
        {"id": "id_pac_2", "name": "Paciente B"},
    ]
    monkeypatch.setattr(server, "get_all_patients_info", lambda: mock_data)

    response = client.get("/api/all-patients", headers=make_auth_headers())

    assert response.status_code == 200
    response_data = response.get_json()
    assert response_data["status"] == "success"
    assert response_data["patients"] == mock_data


def test_get_all_patients_empty(client, make_auth_headers, monkeypatch):
    import server

    monkeypatch.setattr(server, "get_all_patients_info", lambda: [])

    response = client.get("/api/all-patients", headers=make_auth_headers())

    assert response.status_code == 200
    response_data = response.get_json()
    assert response_data["status"] == "success"
    assert response_data["patients"] == []


def test_get_all_patients_internal_error(client, make_auth_headers, monkeypatch):
    import server

    def raise_error():
        raise Exception("Erro simulado de DB")

    monkeypatch.setattr(server, "get_all_patients_info", raise_error)

    response = client.get("/api/all-patients", headers=make_auth_headers())

    assert response.status_code == 500
    response_data = response.get_json()
    assert response_data["status"] == "error"
