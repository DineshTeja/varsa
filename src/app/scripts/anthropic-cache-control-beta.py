import sys
import json
import subprocess
import pkg_resources
import base64

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

required = {'anthropic'}
installed = {pkg.key for pkg in pkg_resources.working_set}
missing = required - installed

if missing:
    install('anthropic')

import anthropic

def run_anthropic_cache_control(api_key, model_id, system_message, user_messages):
    client = anthropic.Anthropic(api_key=api_key)

    response = client.beta.prompt_caching.messages.create(
        model=model_id,
        max_tokens=1024,
        system=[
            {
                "type": "text",
                "text": system_message,
                "cache_control": {"type": "ephemeral"}
            }
        ],
        messages=[{"role": msg["role"], "content": msg["content"]} for msg in user_messages],
    )

    print(response.content[0].text)

if __name__ == "__main__":
    try:
        api_key = sys.argv[1]
        model_id = sys.argv[2]
        system_message = base64.b64decode(sys.argv[3]).decode('utf-8')
        user_messages = json.loads(base64.b64decode(sys.argv[4]).decode('utf-8'))
        run_anthropic_cache_control(api_key, model_id, system_message, user_messages)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)