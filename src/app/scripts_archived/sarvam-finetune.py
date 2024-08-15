import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    DataCollatorForSeq2Seq,
    TrainingArguments,
    Trainer,
)
from peft import LoraConfig, get_peft_model

# Load the model and tokenizer
model_name = "sarvamai/sarvam-2b-v0.5"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Add chat template to the tokenizer
tokenizer.chat_template = "{% if messages[0]['role'] == 'system' %}{% set loop_messages = messages[1:] %}{% set system_message = messages[0]['content'] %}{% else %}{% set loop_messages = messages %}{% set system_message = false %}{% endif %}{% for message in loop_messages %}{% if (message['role'] == 'user') != (loop.index0 % 2 == 0) %}{{ raise_exception('Conversation roles must alternate user/assistant/user/assistant/...') }}{% endif %}{% if loop.index0 == 0 and system_message != false %}{% set content = '<<SYS>>\\n' + system_message + '\\n<</SYS>>\\n\\n' + message['content'] %}{% else %}{% set content = message['content'] %}{% endif %}{% if message['role'] == 'user' %}{{ bos_token + '[INST] ' + content.strip() + ' [/INST]' }}{% elif message['role'] == 'assistant' %}{{ ' '  + content.strip() + ' ' + eos_token }}{% endif %}{% endfor %}"

# Add pad token and resize model embeddings
tokenizer.add_tokens("[PAD]", special_tokens=True)
tokenizer.pad_token = "[PAD]"
model.resize_token_embeddings(len(tokenizer))

# Configure LoRA
lora_config = LoraConfig(
    r=64,
    lora_alpha=128,
    lora_dropout=0.0,
    target_modules=["lm_head", "k_proj", "q_proj", "v_proj", "o_proj", "gate_proj", "down_proj", "up_proj"]
)
model = get_peft_model(model, lora_config)

# Load and preprocess the dataset
ds = load_dataset("sarvamai/samvaad-hi-v1")
ds["train"] = ds["train"].select(range(1000))  # Limit to 1000 conversations for faster training

def preprocess_function(example):
    model_inputs = tokenizer.apply_chat_template(example["messages"], tokenize=False)
    tokenized_inputs = tokenizer(model_inputs, truncation=True, max_length=512)
    tokenized_inputs["labels"] = tokenized_inputs["input_ids"].copy()
    return tokenized_inputs

ds = ds.map(preprocess_function, remove_columns=ds["train"].column_names)

# Set up training arguments
training_args = TrainingArguments(
    output_dir="sarvam-2b-ft",
    num_train_epochs=1,
    save_total_limit=1,
    per_device_train_batch_size=1,
    warmup_steps=10,
    weight_decay=0.0001,
    learning_rate=1e-5,
    logging_steps=10,
    gradient_checkpointing=True,
    gradient_checkpointing_kwargs={"use_reentrant": False},
)

# Initialize the Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=ds["train"],
    data_collator=DataCollatorForSeq2Seq(tokenizer=tokenizer),
)

# Train the model
trainer.train()

# Save the fine-tuned model
output_dir = "sarvam-2b-ft-final"
trainer.save_model(output_dir)
tokenizer.save_pretrained(output_dir)

print(f"Fine-tuned model saved to {output_dir}")

# Test the model
def generate_response(message):
    model_input = tokenizer.apply_chat_template([{'role': 'user', 'content': message}], tokenize=False)
    tokenized_input = tokenizer(model_input, return_tensors='pt')
    
    with torch.no_grad():
        output = model.generate(**tokenized_input, max_new_tokens=256)
    
    decoded_output = tokenizer.decode(output[0], skip_special_tokens=True)
    assistant_message = decoded_output.split('[/INST]')[-1].strip()
    return assistant_message

# Test the model with a sample question
test_message = "भारत ने पहली बार विश्व कप कब जीता?"
response = generate_response(test_message)
print(f"Question: {test_message}")
print(f"Response: {response}")