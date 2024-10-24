<script>
export default {
  name: "ContactList",

  props: {
    contacts: {}
  }
}
</script>

<template>
  <table class="table table-primary table-hover table-striped">
    <thead>
    <tr>
      <th scope="col" class="col">#</th>
      <th scope="col" class="col-md-4">Имя</th>
      <th scope="col" class="col-md-4">Фамилия</th>
      <th scope="col" class="col-md-4">Телефон</th>
      <th scope="col" class="col"></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(contact, index) in contacts" :key="contact.id">
      <td v-text="index + 1"></td>
      <td v-text="contact.name"></td>
      <td v-text="contact.family"></td>
      <td v-text="contact.phone"></td>
      <td>
        <div class="btn-group btn-group-sm" role="group">
          <button @click="$emit('delete', contact)" class="btn btn-danger" type="button"><i
              class="bi bi-trash"></i></button>
          <button @click="$emit('edit', contact)" class="btn btn-primary" type="button"><i
              class="bi bi-pencil-square"></i></button>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</template>