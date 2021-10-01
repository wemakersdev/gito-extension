<script>
  import { Datatable, rows } from "svelte-simple-datatables";

  let data = [
    {name: "test-recording-5", duration: "01:50", created: "30/09/21", actions: "play | delete | archive"},
    {name: "test-recording-6", duration: "02:20", created: "30/09/21", actions: "play | delete | archive"},
    {name: "test-recording-7", duration: "00:56", created: "30/09/21", actions: "play | delete | archive"},
    {name: "test-recording-8", duration: "01:23", created: "30/09/21", actions: "play | delete | archive"},
    {name: "test-recording-9", duration: "01:20", created: "30/09/21", actions: "play | delete | archive"},
  ]

  const settings = {
    sortable: true,
    pagination: true,
    rowPerPage: 50,
    columnFilter: true,
    searchInput: false
  };
</script>

<div class="navbar mb-2  text-neutral-content ">
  <div class="flex-1 hidden px-2 mx-2 lg:flex">
  </div>
  <div class="flex-1 lg:flex-none">
    <span class="text-lg font-bold text-accent"> Gito Explorer </span>
  </div>
</div>

<div class="" style="height:400px">
  <Datatable {settings} {data}>
    <thead>
      <th data-key="name">Name</th>
      <th data-key="duration">Duration</th>
      <th data-key="created">Created</th>
      <th data-key="actions">Actions</th>
    </thead>
    <tbody>
      {#each $rows as row}
        <tr class="py-1" style="padding-top: 5px; padding-bottom: 5px" >
          <td>{row.name}</td>
          <td>{row.duration}</td>
          <td>{row.created}</td>
          <td>{row.actions}</td>
        </tr>
      {/each}
    </tbody>
  </Datatable>
</div>

<svelte:head>
  <link
    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1/dist/tailwind.min.css"
    rel="stylesheet"
    type="text/css"
  />
  <link
    href="https://cdn.jsdelivr.net/npm/daisyui@1.14.0/dist/full.css"
    rel="stylesheet"
    type="text/css"
  />
</svelte:head>

<style>
  :global(body, html, table, thead, tbody, tr, td, th) {
    background: transparent !important;
  }

  :global(*) {
    background: transparent !important;
  }

  td{
    text-align: center;

    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>
