"""
    Arquivo de configuração do projeto Copilot Médico
    Carrega a chave da API do Gemini a partir das variáveis de ambiente
"""
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Variáveis que já tínhamos
    db_url: str = "sqlite:///app.db"
    app_title: str = "Copilot Médico"

    # Nova variável para a chave do Gemini
    # O Pydantic irá procurar automaticamente a variável de ambiente "GEMINI_API_KEY"
    gemini_api_key: str = ""

    # Autenticacao
    auth_secret_key: str = ""
    auth_token_expiration_minutes: int = 60
    auth_users_db_file: str = str(Path(__file__).with_name("users_db.json"))
    auth_bootstrap_email: str = ""
    auth_bootstrap_password: str = ""
    auth_bootstrap_name: str = "Administrador"
    auth_bootstrap_profiles: str = "administrador"

    # CORS. Use "*" em desenvolvimento; em producao prefira uma lista separada por virgulas.
    cors_origins: str = "*"

    # Configuração para carregar do arquivo .env (dentro de backend/.env)
    _ENV_PATH = Path(__file__).with_name(".env")
    model_config = SettingsConfigDict(env_file=str(_ENV_PATH))


# Instância única das configurações
settings = Settings()
