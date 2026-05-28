<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  submitLabel: {
    type: String,
    default: "Speichern"
  }
})

const emit = defineEmits(["update:modelValue", "submit", "cancel"])

// Local copy to avoid mutating prop directly
const local = ref({ ...props.modelValue })

watch(() => props.modelValue, (val) => {
  local.value = { ...val }
}, { deep: true })

function update(field, value) {
  local.value[field] = value
  emit("update:modelValue", { ...local.value })
}

function addTag() {
  const tags = [...(local.value.tags || []), { name: "", color: "#000000" }]
  update("tags", tags)
}
function removeTag(index) {
  const tags = local.value.tags.filter((_, i) => i !== index)
  update("tags", tags)
}
function updateTag(index, field, value) {
  const tags = local.value.tags.map((t, i) => i === index ? { ...t, [field]: value } : t)
  update("tags", tags)
}

function addSubTask() {
  const sub_tasks = [...(local.value.sub_tasks || []), { name: "" }]
  update("sub_tasks", sub_tasks)
}
function removeSubTask(index) {
  const sub_tasks = local.value.sub_tasks.filter((_, i) => i !== index)
  update("sub_tasks", sub_tasks)
}
function updateSubTask(index, value) {
  const sub_tasks = local.value.sub_tasks.map((s, i) => i === index ? { ...s, name: value } : s)
  update("sub_tasks", sub_tasks)
}
</script>

<template>
  <div class="task-form">
    <!-- Name -->
    <div class="form-row">
      <input
          class="glas-input"
          type="text"
          placeholder="Name *"
          :value="local.name"
          @input="update('name', $event.target.value)"
      />
      <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
    </div>

    <!-- Beschreibung -->
    <div class="form-row">
      <textarea
          class="glas-input"
          placeholder="Beschreibung *"
          :value="local.description"
          @input="update('description', $event.target.value)"
      />
      <span v-if="errors.description" class="form-error">{{ errors.description }}</span>
    </div>

    <!-- Priorität -->
    <div class="form-row">
      <select
          class="glas-button-small"
          :value="local.priority"
          @change="update('priority', $event.target.value)"
      >
        <option value="1">1 – Niedrig</option>
        <option value="2">2</option>
        <option value="3">3 – Mittel</option>
        <option value="4">4</option>
        <option value="5">5 – Hoch</option>
      </select>
    </div>

    <!-- Zeiten -->
    <div class="form-row form-row--inline">
      <label>
        Start:
        <input
            class="glas-input"
            type="datetime-local"
            :value="local.start_time"
            @input="update('start_time', $event.target.value)"
        />
      </label>
      <label>
        Ende:
        <input
            class="glas-input"
            type="datetime-local"
            :value="local.end_time"
            @input="update('end_time', $event.target.value)"
        />
      </label>
    </div>

    <!-- Tags -->
    <div class="form-row">
      <strong>Tags</strong>
      <div v-for="(tag, i) in local.tags" :key="i" class="form-row--inline">
        <input
            class="glas-input"
            type="text"
            placeholder="Tag-Name"
            :value="tag.name"
            @input="updateTag(i, 'name', $event.target.value)"
        />
        <input
            class="glas-input"
            type="color"
            :value="tag.color"
            @input="updateTag(i, 'color', $event.target.value)"
        />
        <button class="glas-button-small" @click="removeTag(i)">✕</button>
      </div>
      <button class="glas-button-small" @click="addTag">+ Tag hinzufügen</button>
    </div>

    <!-- Sub-Tasks -->
    <div class="form-row">
      <strong>Unteraufgaben</strong>
      <div v-for="(sub, i) in local.sub_tasks" :key="i" class="form-row--inline">
        <input
            class="glas-input"
            type="text"
            placeholder="Unteraufgabe"
            :value="sub.name"
            @input="updateSubTask(i, $event.target.value)"
        />
        <button class="glas-button-small" @click="removeSubTask(i)">✕</button>
      </div>
      <button class="glas-button-small" @click="addSubTask">+ Unteraufgabe hinzufügen</button>
    </div>

    <!-- Aktionen -->
    <div class="form-row form-row--actions">
      <button class="glas-button-small" @click="emit('submit', local)">{{ submitLabel }}</button>
      <button class="glas-button-small" @click="emit('cancel')">Abbrechen</button>
    </div>
  </div>
</template>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-row--inline {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.form-row--actions {
  flex-direction: row;
  gap: 0.5rem;
  padding-top: 0.25rem;
}

.form-error {
  color: red;
  font-size: 0.8em;
}
</style>