import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import sys
import json

# Load the model and tokenizer
base_model = AutoModelForCausalLM.from_pretrained("sarvamai/sarvam-2b-v0.5")
tokenizer = AutoTokenizer.from_pretrained("sarvamai/sarvam-2b-v0.5")

# Load the fine-tuned model
model = PeftModel.from_pretrained(base_model, "path/to/your/finetuned/model")

# Set up the chat template
tokenizer.chat_template = "{% if messages[0]['role'] == 'system' %}{% set loop_messages = messages[1:] %}{% set system_message = messages[0]['content'] %}{% else %}{% set loop_messages = messages %}{% set system_message = false %}{% endif %}{% for message in loop_messages %}{% if (message['role'] == 'user') != (loop.index0 % 2 == 0) %}{{ raise_exception('Conversation roles must alternate user/assistant/user/assistant/...') }}{% endif %}{% if loop.index0 == 0 and system_message != false %}{% set content = '<<SYS>>\\n' + system_message + '\\n<</SYS>>\\n\\n' + message['content'] %}{% else %}{% set content = message['content'] %}{% endif %}{% if message['role'] == 'user' %}{{ bos_token + '[INST] ' + content.strip() + ' [/INST]' }}{% elif message['role'] == 'assistant' %}{{ ' '  + content.strip() + ' ' + eos_token }}{% endif %}{% endfor %}"

def generate_response(messages):
    model_input = tokenizer.apply_chat_template(messages, tokenize=False)
    tokenized_input = tokenizer(model_input, return_tensors='pt')
    
    with torch.no_grad():
        output = model.generate(**tokenized_input, max_new_tokens=1000)
    
    decoded_output = tokenizer.decode(output[0], skip_special_tokens=True)
    assistant_message = decoded_output.split('[/INST]')[-1].strip()
    return assistant_message

if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    messages = input_data['messages']
    response = generate_response(messages)
    print(json.dumps({"response": response}))