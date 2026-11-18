
#!/bin/bash

set -e

# Raíz del backend
BACKEND_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$BACKEND_ROOT"

OLLAMA_URL="http://127.0.0.1:11434"
OLLAMA_PID=""

cleanup() {
    if [ -n "$OLLAMA_PID" ] && kill -0 "$OLLAMA_PID" 2>/dev/null; then
        echo "Deteniendo Ollama..."
        kill "$OLLAMA_PID" 2>/dev/null || true
        wait "$OLLAMA_PID" 2>/dev/null || true
    fi
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

echo "=== NEXUS BACKEND ==="

# Comprobar Ollama
if ! command -v ollama >/dev/null 2>&1; then
    echo "ERROR: Ollama no está instalado."
    exit 1
fi

if ! curl -fsS "$OLLAMA_URL/api/tags" >/dev/null 2>&1; then
    echo "Iniciando Ollama..."
    ollama serve &
    OLLAMA_PID=$!

    READY=0
    for i in $(seq 1 30); do
        if curl -fsS "$OLLAMA_URL/api/tags" >/dev/null 2>&1; then
            READY=1
            break
        fi
        sleep 1
    done

    if [ "$READY" -ne 1 ]; then
        echo "ERROR: Ollama no responde."
        exit 1
    fi
else
    echo "Ollama ya está activo."
fi

echo "Ollama preparado."

# Arrancar API
if [ -x "$BACKEND_ROOT/.venv/bin/uvicorn" ]; then
    UVICORN="$BACKEND_ROOT/.venv/bin/uvicorn"
else
    echo "ERROR: No encuentro Uvicorn en .venv."
    exit 1
fi

echo "Iniciando FastAPI..."
"$UVICORN" app.main:app --reload
